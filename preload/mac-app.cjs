var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __objSpread = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// src/preload/api/global.ts
var import_dotenv = __toModule(require("dotenv"));

// src/preload/utils.ts
var assignPropsTo = (source, target) => {
  Object.entries(source).forEach(([key, value]) => {
    target[key] = value;
  });
};

// src/preload/api/global.ts
(0, import_dotenv.config)({path: process.env.DOTENV_CONFIG_PATH});
var globalApi = {
  cd: "shelljs",
  cp: "shelljs",
  chmod: "shelljs",
  echo: "shelljs",
  exec: "shelljs",
  exit: "shelljs",
  grep: "shelljs",
  ln: "shelljs",
  ls: "shelljs",
  mkdir: "shelljs",
  mv: "shelljs",
  sed: "shelljs",
  tempdir: "shelljs",
  test: "shelljs",
  which: "shelljs",
  spawn: "child_process",
  spawnSync: "child_process",
  fork: "child_process",
  get: "axios",
  put: "axios",
  post: "axios",
  patch: "axios",
  readFile: "fs/promises",
  writeFile: "fs/promises",
  appendFile: "fs/promises",
  createWriteStream: "fs",
  readdir: "fs/promises",
  compile: "handlebars"
};
global.cwd = process.cwd;
global.pid = process.pid;
global.stderr = process.stderr;
global.stdin = process.stdin;
global.stdout = process.stdout;
global.uptime = process.uptime;
Object.entries(globalApi).forEach(([key, value]) => {
  global[key] = (...args) => {
    return require(value)[key](...args);
  };
});
global.path = require("path");
global._ = new Proxy({}, {
  get(_o, p) {
    return require("lodash")[p];
  }
});
global.uuid = (...args) => require("uuid").v4(...args);
global.chalk = (...text) => require("chalk")(...text);
global.paste = (...args) => require("clipboardy").read(...args);
global.copy = (...args) => require("clipboardy").write(...args);
global.notify = (...args) => require("node-notifier").notify(...args);
global.trash = async (input, options) => {
  ;
  (typeof input === "string" ? [input] : input).flatMap((x) => x).forEach((trashArg) => {
    echo(global.chalk`{yellow ${trashArg}} moved to {yellow trash}`);
  });
  return await require("trash")(input, options);
};
global.rm = async (input, options) => {
  echo(global.chalk`{yellow rm} doesn't exist. You're probably looking for {yellow trash}`);
  await global.trash(input, options);
};
global.wait = async (time) => new Promise((res) => setTimeout(res, time));
global.checkProcess = (pid) => {
  let {stdout, stderr} = exec(`kill -0 ` + pid);
  return stdout;
};
global.home = (...pathParts) => {
  let path = require("path");
  let os = require("os");
  return path.resolve(os.homedir(), ...pathParts);
};
global.isFile = async (file) => test("-f", file);
global.isDir = async (dir) => test("-d", dir);
global.isBin = async (bin) => Boolean(exec(`command -v ${bin}`, {
  silent: false
}).stdout);
global.args = [];
global.env = async (envKey, promptConfig) => {
  let config2 = __objSpread({
    placeholder: `Set ${envKey} to:`,
    reset: false
  }, promptConfig);
  if (global.env[envKey] && !config2?.reset)
    return global.env[envKey];
  let input = await global.kitPrompt(config2);
  if (input.startsWith("~"))
    input = input.replace("~", global.env.HOME);
  await global.cli("set-env-var", envKey, input);
  global.env[envKey] = input;
  return input;
};
assignPropsTo(process.env, global.env);
global.env.KIT_BIN_FILE_PATH = process.argv[1];
global.env.KIT_SRC_NAME = process.argv[1].split(global.env.KENV.split(global.path.sep).pop()).pop();
global.env.KIT_SCRIPT_NAME = global.env.KIT_SRC_NAME.replace(".js", "");
global.kitPath = (...parts) => global.path.join(global.env.KIT, ...parts);
global.kenvPath = (...parts) => {
  return global.path.join(global.env.KENV, ...parts.filter(Boolean));
};
global.libPath = (...parts) => global.path.join(global.kenvPath("lib"), ...parts);
global.kitScriptFromPath = (path) => {
  path = path.replace(global.kenvPath() + "/", "");
  path = path.replace(/\.js$/, "");
  return path;
};
global.kitFromPath = (path) => {
  path = path.replace(global.env.KIT + "/", "");
  path = path.replace(/\.js$/, "");
  return path;
};
global.kitScript = global.kitScriptFromPath(global.env.KIT_SCRIPT_NAME);
global.db = (key, defaults) => {
  let low = require("lowdb");
  let FileSync = require("lowdb/adapters/FileSync");
  let _db = low(new FileSync(global.kenvPath("db", `${key}.json`)));
  _db._.mixin(require("lodash-id"));
  _db.defaults(defaults).write();
  return _db;
};
global.getScripts = () => require(kenvPath("cache", "menu-cache.json"));
global.memoryMap = new Map();

// src/preload/api/kit.ts
global.attemptImport = async (path, ..._args) => {
  global.updateArgs(_args);
  try {
    return await import(path + `?uuid=${global.uuid()}`);
  } catch (error) {
    console.warn(error.message);
    global.setPlaceholder(error.message);
    await global.wait(1e3);
    try {
      let stackWithoutId = error.stack.replace(/\?[^:]*/, "");
      console.warn(stackWithoutId);
      let errorFile = stackWithoutId.split("\n")[1].replace("at file://", "").replace(/:.*/, "").trim();
      let [, line, col] = stackWithoutId.split("\n")[1].replace("at file://", "").split(":");
      console.log({line, col});
      if (errorFile.includes(global.kenvPath())) {
        global.edit(errorFile, global.kenvPath(), line, col);
      }
    } catch {
    }
    await global.wait(2e3);
    exit(1);
  }
};
global.runSub = async (scriptPath, ...runArgs) => {
  return new Promise(async (res, rej) => {
    let values = [];
    if (!scriptPath.includes("/")) {
      scriptPath = global.kenvPath("scripts", scriptPath);
    }
    if (!scriptPath.startsWith(global.path.sep)) {
      scriptPath = global.kenvPath(scriptPath);
    }
    if (!scriptPath.endsWith(".js"))
      scriptPath = scriptPath + ".js";
    let scriptArgs = [
      ...global.args,
      ...runArgs,
      ...global.argOpts
    ].filter((arg) => {
      if (typeof arg === "string")
        return arg.length > 0;
      return arg;
    });
    let child = fork(scriptPath, scriptArgs, {
      stdio: "inherit",
      execArgv: [
        "--require",
        "dotenv/config",
        "--require",
        global.kitPath("preload/api.js"),
        "--require",
        global.kitPath("preload/kit.js"),
        "--require",
        global.kitPath("preload/mac.js")
      ],
      execPath: global.env.KIT_NODE,
      env: __objSpread(__objSpread({}, global.env), {
        KIT_PARENT_NAME: global.env.KIT_PARENT_NAME || global.env.KIT_SCRIPT_NAME,
        KIT_ARGS: global.env.KIT_ARGS || scriptArgs.join(".")
      })
    });
    let name = process.argv[1].replace(global.kenvPath() + global.path.sep, "");
    let childName = scriptPath.replace(global.kenvPath() + global.path.sep, "");
    console.log(childName, child.pid);
    let forwardToChild = (message) => {
      console.log(name, "->", childName);
      child.send(message);
    };
    process.on("message", forwardToChild);
    child.on("message", (message) => {
      console.log(name, "<-", childName);
      global.send(message);
      values.push(message);
    });
    child.on("error", (error) => {
      console.warn(error);
      values.push(error);
      rej(values);
    });
    child.on("close", (code2) => {
      process.off("message", forwardToChild);
      res(values);
    });
  });
};
process.on("uncaughtException", async (err) => {
  console.warn(`UNCAUGHT EXCEPTION: ${err}`);
  exit();
});
global.send = async (channel, data) => {
  if (process?.send) {
    process.send(__objSpread({
      kitScript: global.kitScript,
      channel
    }, data));
  } else {
  }
};
if (process?.send) {
  let _consoleLog = console.log.bind(console);
  let _consoleWarn = console.warn.bind(console);
  console.log = async (...args) => {
    global.send("CONSOLE_LOG", {
      log: args.map((a) => typeof a != "string" ? JSON.stringify(a) : a).join(" ")
    });
  };
  console.warn = async (...args) => {
    global.send("CONSOLE_WARN", {
      warn: args.map((a) => typeof a != "string" ? JSON.stringify(a) : a).join(" ")
    });
  };
}
global.show = (html, options) => {
  global.send("SHOW", {options, html});
};
global.showImage = (image, options) => {
  global.send("SHOW_IMAGE", {
    options,
    image: typeof image === "string" ? {src: image} : image
  });
};
global.setPlaceholder = (text) => {
  global.send("SET_PLACEHOLDER", {
    text
  });
};
global.run = async (name, ..._args) => {
  global.onTabs = [];
  global.kitScript = name;
  global.send("RUN_SCRIPT", {
    name,
    args: _args
  });
  let kitScriptPath = global.kenvPath("scripts", global.kitScript) + ".js";
  return global.attemptImport(kitScriptPath, ..._args);
};
global.kit = async (scriptPath, ..._args) => {
  let kitScriptPath = global.kitPath("lib", scriptPath) + ".js";
  return await global.attemptImport(kitScriptPath, ..._args);
};
global.main = async (scriptPath, ..._args) => {
  let kitScriptPath = global.kitPath("main", scriptPath) + ".js";
  return await global.attemptImport(kitScriptPath, ..._args);
};
global.lib = async (scriptPath, ..._args) => {
  let kitScriptPath = global.libPath(scriptPath) + ".js";
  return await global.attemptImport(kitScriptPath, ..._args);
};
global.cli = async (cliPath, ..._args) => {
  let cliScriptPath = global.kitPath("cli/" + cliPath) + ".js";
  return await global.attemptImport(cliScriptPath, ..._args);
};
global.setup = async (setupPath, ..._args) => {
  global.setPlaceholder(`>_ setup: ${setupPath}...`);
  let setupScriptPath = global.kitPath("setup/" + setupPath) + ".js";
  return await global.attemptImport(setupScriptPath, ..._args);
};
global.kitLib = async (lib) => {
  return await global.kit(`kit/${lib}`);
};
global.tmp = (file) => {
  let scriptTmpDir = global.kenvPath("tmp", global.kitScript);
  mkdir("-p", scriptTmpDir);
  return global.kenvPath("tmp", global.kitScript, file);
};
global.inspect = async (data, extension) => {
  let dashedDate = () => new Date().toISOString().replace("T", "-").replace(/:/g, "-").split(".")[0];
  let tmpFilePath = global.kenvPath("tmp", global.kitScript);
  let formattedData = data;
  let tmpFullPath = global.path.join(tmpFilePath, `${dashedDate()}.txt`);
  if (typeof data === "object") {
    formattedData = JSON.stringify(data, null, "	");
    tmpFullPath = global.path.join(tmpFilePath, `${dashedDate()}.json`);
  }
  if (extension) {
    tmpFullPath = global.path.join(tmpFilePath, `${dashedDate()}.${extension}`);
  }
  mkdir("-p", tmpFilePath);
  await writeFile(tmpFullPath, formattedData);
  await global.edit(tmpFullPath);
};
global.compileTemplate = async (template, vars) => {
  let templateContent = await readFile(global.kenvPath("templates", template), "utf8");
  let templateCompiler = compile(templateContent);
  return templateCompiler(vars);
};
global.currentOnTab = null;
global.onTabs = [];
global.onTabIndex = 0;
global.onTab = async (name, fn) => {
  global.onTabs.push({name, fn});
  if (global.arg.tab) {
    if (global.arg.tab === name) {
      let tabIndex = global.onTabs.length - 1;
      global.onTabIndex = tabIndex;
      global.send("SET_TAB_INDEX", {
        tabIndex
      });
      global.currentOnTab = await fn();
    }
  } else if (global.onTabs.length === 1) {
    global.onTabIndex = 0;
    global.send("SET_TAB_INDEX", {tabIndex: 0});
    global.currentOnTab = await fn();
  }
};
global.kitPrevChoices = [];
global.setChoices = async (choices) => {
  if (typeof choices === "object") {
    choices = choices.map((choice) => {
      if (typeof choice === "string") {
        return {
          name: choice,
          value: choice,
          id: global.uuid()
        };
      }
      if (typeof choice === "object") {
        if (!choice?.id) {
          choice.id = global.uuid();
        }
      }
      return choice;
    });
  }
  global.send("SET_CHOICES", {choices});
  global.kitPrevChoices = choices;
};
global.md = (markdown) => require("marked")(markdown);

// src/preload/os/mac.ts
global.applescript = async (script, options = {silent: true}) => {
  let formattedScript = script.replace(/'/g, `'"'"'`);
  if (global.env?.DEBUG) {
    await writeFile(global.kenvPath("tmp", "_debug.applescript"), script);
  }
  let {stdout, stderr} = exec(`osascript -e '${formattedScript}'`, options);
  if (stderr) {
    console.log(stderr);
    exit();
  }
  return stdout.trim();
};
global.terminal = async (script) => {
  let formattedScript = script.replace(/'|"/g, '\\"');
  let command = `tell application "Terminal"
  do script "${formattedScript}"
  activate
  end tell
  `;
  return await global.applescript(command);
};
global.iterm = async (command) => {
  command = `"${command.replace(/"/g, '\\"')}"`;
  let script = `
    tell application "iTerm"
        if application "iTerm" is running then
            try
                tell the first window to create tab with default profile
            on error
                create window with default profile
            end try
        end if
    
        delay 0.1
    
        tell the first window to tell current session to write text ${command}
        activate
    end tell
    `.trim();
  return await global.applescript(script);
};
var terminalEditor = (editor) => async (file) => {
  let supportedTerminalMap = {
    terminal: global.terminal,
    iterm: global.iterm
  };
  let {fileSearch} = await global.kit("file");
  let possibleTerminals = () => Object.entries(supportedTerminalMap).filter(async ([name, value]) => {
    return fileSearch(name, {
      onlyin: "/",
      kind: "application"
    });
  }).map(([name, value]) => ({name, value: name}));
  let KIT_TERMINAL = await global.env("KIT_TERMINAL", {
    placeholder: `Which Terminal do you use with ${editor}?`,
    choices: possibleTerminals()
  });
  return supportedTerminalMap[KIT_TERMINAL](`${editor} ${file}`);
};
var execConfig = () => {
  let editorParentPath = "/usr/local/bin";
  let PATH = [
    editorParentPath,
    ...process.env.PATH.split(":")
  ].filter((p) => !p.startsWith(home())).join(":");
  return {
    env: {
      HOME: home(),
      PATH
    }
  };
};
global.selectKitEditor = async (reset) => {
  let possibleEditors = () => [
    "atom",
    "code",
    "emacs",
    "nano",
    "ne",
    "nvim",
    "sublime",
    "webstorm",
    "vim"
  ].filter((editor) => exec(`PATH="/usr/bin:/usr/local/bin" which ${editor}`, {silent: true}).stdout).map((name) => ({name, value: name}));
  return await global.env("KIT_EDITOR", {
    reset,
    placeholder: "Which code editor do you use? (You can always change this later in .env)",
    choices: [
      ...possibleEditors(),
      {
        name: "None. Always copy path to clipboard",
        value: "copy"
      }
    ]
  });
};
var atom = async (file, dir) => {
  let command = `atom "${file}"${dir ? ` "${dir}"` : ``}`;
  exec(command, execConfig());
};
var code = async (file, dir, line = 0, col = 0) => {
  let codeArgs = ["--goto", `${file}:${line}:${col}`];
  if (dir)
    codeArgs = [...codeArgs, "--folder-uri", dir];
  let command = `code ${codeArgs.join(" ")}`;
  let config2 = execConfig();
  exec(command, config2);
};
var vim = terminalEditor("vim");
var nvim = terminalEditor("nvim");
var nano = terminalEditor("nano");
var fullySupportedEditors = {
  code,
  vim,
  nvim,
  nano,
  atom
};
global.edit = async (file, dir, line = 0, col = 0) => {
  if (global.arg?.edit === false)
    return;
  let KIT_EDITOR = await global.selectKitEditor(false);
  let execEditor = (file2) => {
    let editCommand = `${KIT_EDITOR} ${file2}`;
    exec(editCommand, execConfig());
  };
  let editorFn = fullySupportedEditors[KIT_EDITOR] || execEditor;
  global.setPlaceholder(`Opening ${file} with ${global.env.KIT_EDITOR}`);
  let result = await editorFn(file, dir, line, col);
  if (result?.stderr) {
    console.warn(`STDERR ${result.stderr}`);
    exit();
  }
  console.log(global.chalk`> Opening {yellow ${file}} with {green.bold ${global.env.KIT_EDITOR}}`);
};

// src/enums.ts
var MODE;
(function(MODE2) {
  MODE2["GENERATE"] = "GENERATE";
  MODE2["FILTER"] = "FILTER";
  MODE2["MANUAL"] = "MANUAL";
  MODE2["HOTKEY"] = "HOTKEY";
})(MODE || (MODE = {}));
var CHANNELS;
(function(CHANNELS2) {
  CHANNELS2["GENERATE_CHOICES"] = "GENERATE_CHOICES";
  CHANNELS2["TAB_CHANGED"] = "TAB_CHANGED";
  CHANNELS2["VALUE_SUBMITTED"] = "VALUE_SUBMITTED";
})(CHANNELS || (CHANNELS = {}));

// src/preload/target/app.ts
var displayChoices = (choices) => {
  switch (typeof choices) {
    case "string":
      global.setPanel(choices);
      break;
    case "object":
      global.setChoices(choices);
      break;
  }
};
var checkTabChanged = (data, messageHandler, errorHandler) => {
  if (data?.tab && global.onTabs) {
    process.off("message", messageHandler);
    if (errorHandler)
      process.off("error", errorHandler);
    updateTab(data);
  }
};
var updateTab = (data) => {
  let tabIndex = global.onTabs.findIndex(({name}) => {
    return name == data?.tab;
  });
  global.onTabIndex = tabIndex;
  global.currentOnTab = global.onTabs[tabIndex].fn(data?.input);
};
var promptId = 0;
var waitForPrompt = async ({choices, validate}) => {
  promptId++;
  let messageHandler;
  let errorHandler;
  let value = await new Promise(async (resolve, reject) => {
    let currentPromptId = promptId;
    let invokeChoices = (input) => {
      let resultOrPromise = choices(input);
      if (resultOrPromise.then) {
        resultOrPromise.then((result) => {
          if (currentPromptId === promptId)
            displayChoices(result);
        });
      } else {
        displayChoices(resultOrPromise);
      }
    };
    if (typeof choices === "function") {
      invokeChoices("");
    } else {
      displayChoices(choices);
    }
    messageHandler = async (data) => {
      switch (data?.channel) {
        case CHANNELS.GENERATE_CHOICES:
          invokeChoices(data?.input);
          break;
        case CHANNELS.TAB_CHANGED:
          checkTabChanged(data, messageHandler, errorHandler);
          break;
        case CHANNELS.VALUE_SUBMITTED:
          let {value: value2} = data;
          if (validate) {
            let validateMessage = await validate(value2);
            if (typeof validateMessage === "string") {
              global.setPlaceholder(validateMessage);
              global.setChoices(global.kitPrevChoices);
              return;
            }
          }
          resolve(value2);
          break;
      }
    };
    errorHandler = () => {
      reject();
    };
    process.on("message", messageHandler);
    process.on("error", errorHandler);
  });
  process.off("message", messageHandler);
  process.off("error", errorHandler);
  return value;
};
global.kitPrompt = async (config2) => {
  let {
    placeholder = "",
    validate = null,
    choices = [],
    secret = false,
    hint = "",
    input = "",
    drop = false,
    ignoreBlur = false,
    mode = MODE.FILTER
  } = config2;
  global.setMode(typeof choices === "function" && choices?.length > 0 ? MODE.GENERATE : mode);
  let scriptInfo = await global.cli("info", global.kitScript);
  global.send("SHOW_PROMPT", {
    tabs: global.onTabs?.length ? global.onTabs.map(({name}) => name) : [],
    tabIndex: global.onTabs?.findIndex(({name}) => global.arg?.tab),
    scriptInfo,
    placeholder,
    kitScript: global.kitScript,
    parentScript: global.env.KIT_PARENT_NAME,
    kitArgs: global.args.join(" "),
    secret,
    drop
  });
  global.setHint(hint);
  if (input)
    global.setInput(input);
  if (ignoreBlur)
    global.setIgnoreBlur(true);
  return await waitForPrompt({choices, validate});
};
global.drop = async (hint = "") => {
  return await global.kitPrompt({
    placeholder: "Waiting for drop...",
    hint,
    drop: true,
    ignoreBlur: true
  });
};
global.hotkey = async (placeholder = "Press a key combo:") => {
  return await global.kitPrompt({
    placeholder,
    mode: MODE.HOTKEY
  });
};
global.arg = async (placeholderOrConfig, choices) => {
  let firstArg = global.args.length ? global.args.shift() : null;
  let placeholderOrValidateMessage = "";
  if (firstArg) {
    let valid = true;
    if (typeof placeholderOrConfig !== "string" && placeholderOrConfig?.validate) {
      let {validate} = placeholderOrConfig;
      let validOrMessage = await validate(firstArg);
      valid = typeof validOrMessage === "boolean" && validOrMessage;
      if (typeof validOrMessage === "string")
        placeholderOrValidateMessage = validOrMessage;
    }
    if (valid) {
      return firstArg;
    }
  }
  if (typeof placeholderOrConfig === "undefined") {
    return await global.kitPrompt({
      placeholder: placeholderOrValidateMessage
    });
  }
  if (typeof placeholderOrConfig === "string") {
    return await global.kitPrompt({
      placeholder: placeholderOrConfig,
      choices
    });
  }
  return await global.kitPrompt(__objSpread({
    choices
  }, placeholderOrConfig));
};
global.updateArgs = (arrayOfArgs) => {
  let argv = require("minimist")(arrayOfArgs);
  global.args = [...global.args, ...argv._];
  global.argOpts = Object.entries(argv).filter(([key]) => key != "_").flatMap(([key, value]) => {
    if (typeof value === "boolean") {
      if (value)
        return [`--${key}`];
      if (!value)
        return [`--no-${key}`];
    }
    return [`--${key}`, value];
  });
  assignPropsTo(argv, global.arg);
};
global.updateArgs(process.argv.slice(2));
var npmInstall = async (packageName) => {
  if (!global.arg?.trust) {
    let placeholder = `${packageName} is required for this script`;
    let packageLink = `https://npmjs.com/package/${packageName}`;
    let hint = `[${packageName}](${packageLink}) has had ${(await get(`https://api.npmjs.org/downloads/point/last-week/` + packageName)).data.downloads} downloads from npm in the past week`;
    let trust = await global.arg({placeholder, hint: md(hint)}, [
      {
        name: `Abort`,
        value: "false"
      },
      {
        name: `Install ${packageName}`,
        value: "true"
      }
    ]);
    if (trust === "false") {
      echo(`Ok. Exiting...`);
      exit();
    }
  }
  setHint(`Installing ${packageName}...`);
  await global.cli("install", packageName);
};
global.npm = async (packageName) => {
  try {
    return require(packageName);
  } catch {
    await npmInstall(packageName);
    let packageJson = require(global.kenvPath("node_modules", packageName, "package.json"));
    setHint("");
    return require(global.kenvPath("node_modules", packageName, packageJson.main));
  }
};
global.npm = async (packageName) => {
  let pkg = null;
  try {
    pkg = require(packageName);
  } catch (error) {
    let kenvPackageJson = require(global.kenvPath("package.json"));
    let isESM = (packageJson2) => packageJson2.type === "module" && packageJson2.exports;
    let getModulePackageJson = () => {
      let pkgJsonFilePath = global.kenvPath("node_modules", packageName, "package.json");
      let pkgJson = require(pkgJsonFilePath);
      delete require.cache[pkgJsonFilePath];
      return pkgJson;
    };
    if (!kenvPackageJson.dependencies[packageName]) {
      await npmInstall(packageName);
      if (isESM(getModulePackageJson())) {
      }
    }
    let packageJson = getModulePackageJson();
    if (isESM(packageJson)) {
      let modulePath = global.kenvPath("node_modules", packageName, packageJson.exports);
      pkg = await global.attemptImport(modulePath);
    } else {
      console.log(`NOT ESM`);
      pkg = require(global.kenvPath("node_modules", packageName, packageJson.main));
    }
  }
  return pkg;
};
global.setPanel = async (html) => {
  global.send("SET_PANEL", {html});
};
global.setMode = async (mode) => {
  global.send("SET_MODE", {
    mode
  });
};
global.setHint = async (hint) => {
  global.send("SET_HINT", {
    hint
  });
};
global.setInput = async (input) => {
  global.send("SET_INPUT", {
    input
  });
};
global.setIgnoreBlur = async (ignore) => {
  global.send("SET_IGNORE_BLUR", {ignore});
};
global.sendResponse = async (value) => {
  global.send("SEND_RESPONSE", {
    value
  });
};
global.getDataFromApp = async (channel) => {
  if (process?.send) {
    return await new Promise((res, rej) => {
      let messageHandler = (data) => {
        if (data.channel === channel) {
          res(data);
          process.off("message", messageHandler);
        }
      };
      process.on("message", messageHandler);
      send(`GET_${channel}`);
    });
  } else {
    return {};
  }
};
global.getBackgroundTasks = () => global.getDataFromApp("BACKGROUND");
global.getSchedule = () => global.getDataFromApp("SCHEDULE");
global.getScriptsState = () => global.getDataFromApp("SCRIPTS_STATE");
//# sourceMappingURL=mac-app.cjs.map
