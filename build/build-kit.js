import "@johnlindquist/globals"
import shelljs from "shelljs"
import { homedir, platform } from "os"
import { existsSync } from "fs"

let originalDir = process.cwd()

let { cd, rm, cp } = shelljs

let kitPath = (...pathParts) =>
  path.resolve(
    process.env.KIT || path.resolve(homedir(), ".kit"),
    ...pathParts
  )

let knodePath = (...parts) =>
  path.join(
    process.env.KNODE || path.resolve(homedir(), ".knode"),
    ...parts.filter(Boolean)
  )

if (existsSync(kitPath())) rm("-rf", kitPath())
await ensureDir(kitPath())
await ensureDir(knodePath())

let installNodeWin = async () => {
  let { Extract } = await import("unzipper")
  let { rename } = await import("fs/promises")
  let { rm } = shelljs

  rm("-rf", knodePath())

  await new Promise(r => {
    download(
      `https://nodejs.org/dist/v16.17.1/node-v16.17.1-win-x86.zip`
    )
      .pipe(Extract({ path: knodePath() }))
      .on("finish", r)
  })

  let nodeDir = await readdir(knodePath())
  let nodeDirName = nodeDir.find(n => n.startsWith("node-"))

  await rename(knodePath(nodeDirName), knodePath("bin"))
}

let installNode =
  platform() !== "win32"
    ? exec(
        `./build/install-node.sh v16.17.1 --prefix '${knodePath()}'`
      )
    : installNodeWin()

cp("-R", "./root/.", kitPath())
cp("-R", "./build", kitPath())
cp("-R", "./src/types", kitPath())

cp("*.md", kitPath())
cp("package*.json", kitPath())
cp("LICENSE", kitPath())

console.log(`Building ESM to ${kitPath()}`)
let esm = exec(`npx tsc --outDir ${kitPath()}`)

console.log(`Building declarations to ${kitPath()}`)
let dec = exec(
  `npx tsc --project ./tsconfig-declaration.json --outDir ${kitPath()}`
)

console.log(`Building CJS to ${kitPath()}`)
let cjs = exec(
  `npx tsc --project ./tsconfig-cjs.json --outDir "${kitPath(
    "cjs"
  )}"`
)

await Promise.all([installNode, esm, dec, cjs])

console.log(`Fix cjs`)
await exec(`node ./scripts/cjs-fix.js`)

console.log(`Install deps`)

let options = {
  cwd: kitPath(),
  env: {
    PATH: `${knodePath("bin")}:${process.env.PATH}`,
  },
}
await exec(`pnpm i --production`, options)

// console.log(`Install app deps`)
// await exec(`${npm} i @johnlindquist/kitdeps@0.1.1`)

await exec(
  `node ./run/terminal.js ./help/download-docs.js`,
  options
)

await exec(
  `node ./run/terminal.js ./hot/download-hot.js`,
  options
)

console.log(`Write .kitignore`)
await writeFile(kitPath(".kitignore"), "*")
cd(originalDir)
