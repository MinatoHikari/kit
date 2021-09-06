import { Bin } from "@core/enum"
import {
  createBinFromScript,
  selectScript,
} from "../utils.js"

let type = await arg<Bin>(
  "Select type:",
  Object.values(Bin)
)

let script = await selectScript(
  `Create bin from which script?`,
  false
)
await createBinFromScript(type, script)
export {}
