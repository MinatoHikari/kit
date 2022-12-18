import "@johnlindquist/globals"
import shelljs from "shelljs"
import { homedir } from "os"

let { cp } = shelljs

let kitPath = (...pathParts) =>
  path.resolve(
    process.env.KIT || path.resolve(homedir(), ".kit"),
    ...pathParts
  )

cp("-R", "./root/.", kitPath())
cp("-R", "./build", kitPath())
cp("-R", "./src/types", kitPath())

cp("*.md", kitPath())
cp("package*.json", kitPath())
cp("LICENSE", kitPath())

console.log(`Building ESM to ${kitPath()}`)
let esm = exec(`pnpx tsc --outDir ${kitPath()}`)

console.log(`Building declarations to ${kitPath()}`)
let dec = exec(
  `pnpx tsc --project ./tsconfig-declaration.json --outDir ${kitPath()}`
)

console.log(`Building CJS to ${kitPath()}`)
let cjs = exec(
  `pnpx tsc --project ./tsconfig-cjs.json --outDir "${kitPath(
    "cjs"
  )}"`
)

await Promise.all([esm, dec, cjs])
console.log(`Fix cjs`)
await exec(`node ./scripts/cjs-fix.js`)

console.log(`Downloading data`)

console.log(`Write .kitignore`)
await writeFile(kitPath(".kitignore"), "*")
