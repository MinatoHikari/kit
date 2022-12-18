import "@johnlindquist/globals"
import { exit } from "process"
import shelljs from "shelljs"

let { cd, cp } = shelljs

let kitPath = (...pathParts) =>
  path.resolve(process.env.KIT, ...pathParts)

console.log({ kitPath: kitPath() })

cp("-R", "./root/.", kitPath())
cp("-R", "./build", kitPath())
cp("-R", "./src/types", kitPath())

cp("*.md", kitPath())
cp("package*.json", kitPath())
cp("LICENSE", kitPath())

let { stdout: nodeVersion } = await exec(`node --version`)
console.log({ nodeVersion })
let { stdout: npmVersion } = await exec(`pnpm --version`)
console.log({ npmVersion })

console.log(`Building ESM to ${kitPath()}`)
try {
  let esm = await exec(`pnpx tsc --outDir ${kitPath()}`)
  console.log(esm)
} catch (e) {
  console.log(e)
  exit(1)
}

console.log(`Building declarations to ${kitPath()}`)
try {
  let dec = await exec(
    `pnpx tsc --project ./tsconfig-declaration.json --outDir ${kitPath()}`
  )
  console.log(dec)
} catch (e) {
  console.log(e)
  exit(1)
}

console.log(`Building CJS to ${kitPath()}`)

try {
  let cjs = await exec(
    `pnpx tsc --project ./tsconfig-cjs.json --outDir "${kitPath(
      "cjs"
    )}"`
  )
  console.log(cjs)
} catch (e) {
  console.log(e)
  exit(1)
}

console.log(`Fixing cjs`)

try {
  await exec(`node ./scripts/cjs-fix.js`)
} catch (e) {
  console.log(e)
  exit(1)
}

cd(kitPath())
