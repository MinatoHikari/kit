#!/bin/jsh

// These ./bin files are customized for stackblitz
// A local Script Kit install works a little differently

import path from "path"
import { configEnv } from "@johnlindquist/kit/core/utils"

let filePath = path.dirname(
  new URL(import.meta.url).pathname
)
let projectRoot = path.resolve(filePath, "..")

process.env.KIT = path.resolve(
  projectRoot,
  "node_modules",
  "@johnlindquist",
  "kit"
)
process.env.KENV = projectRoot

await import("@johnlindquist/kit/api/global")
await import("@johnlindquist/kit/api/kit")
await import("@johnlindquist/kit/api/lib")

await import(`@johnlindquist/kit/platform/stackblitz`)

configEnv()

await import("@johnlindquist/kit/target/terminal")
await import("../scripts/{{command}}.js")
