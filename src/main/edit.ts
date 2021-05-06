//Menu: Edit Menu
//Description: The right-click action of the app
//Shortcut: cmd shift ;
let { menu, validate } = await cli("fns")

let { filePath, command }: Script = await arg(
  {
    placeholder: `Which script do you want to edit?`,
    validate,
  },
  menu
)

let editActions: Choice<string>[] = [
  {
    name: "Open",
    description: `Open ${command}${
      env.KIT_EDITOR ? ` in ${env.KIT_EDITOR}` : ``
    }`,
    value: "edit",
  },
  {
    name: "Duplicate",
    description: `Make a copy of ${command} and open${
      env.KIT_EDITOR ? ` in ${env.KIT_EDITOR}` : ``
    }`,
    value: "duplicate",
  },
  {
    name: "Rename",
    description: `Prompt to rename ${command}`,
    value: "rename",
  },
  {
    name: "Remove",
    description: `Delete ${command} to trash`,
    value: "remove",
  },
]
let editAction = await arg("Which action?", editActions)
await cli(editAction, filePath)

export {}
