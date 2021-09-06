import { Choice } from "@core/type"
import { CLI } from "cli"

let kitManagementChoices: Choice<keyof CLI>[] = [
  {
    name: "Get Help",
    description: `Post a question to Script Kit GitHub discussions`,
    value: "get-help",
  },
  {
    name: "Online Docs",
    description: `Work in progress...`,
    value: "goto-docs",
  },
  {
    name: "Search Docs",
    description: `Work in progress...`,
    value: "search-docs",
  },
  {
    name: "Subscribe to Newsletter",
    description: `Receive a newsletter with examples and tips`,
    value: "join",
  },
]

let cliScript = await arg(
  `Got questions?`,
  kitManagementChoices
)

await run(kitPath(`cli`, cliScript + ".js"))

export {}
