//Menu: Share Script for Kit Discussion
//Description: Create a gist and copy discussion content to clipboard
let { menu } = await cli("fns");
let { command } = await arg({
    placeholder: `Which script do you want to share?`,
}, menu);
let token = await env("GITHUB_GIST_TOKEN", {
    secret: true,
    ignoreBlur: true,
    hint: md(`Click to create a [github gist token](https://github.com/settings/tokens/new?scopes=gist&description=kit+share+script+token)`),
    placeholder: chalk `Enter GitHub gist token:`,
});
let scriptJS = `${command}.js`;
let scriptPath = kenvPath("scripts", scriptJS);
let isPublic = await arg("Make gist public?", [
    { name: `No, keep ${command} private`, value: false },
    { name: `Yes, make ${command} public`, value: true },
]);
let content = await readFile(scriptPath, "utf8");
let body = {
    files: {
        [scriptJS]: {
            content,
        },
    },
};
if (isPublic)
    body.public = true;
let config = {
    headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${token}`,
    },
};
let response = await post(`https://api.github.com/gists`, body, config);
let gistUrl = response.data.files[scriptJS].raw_url;
let link = `https://scriptkit.com/api/new?name=${command}&url=${gistUrl}`;
let discussionPost = `
[Install ${command}](${link})

\`\`\`js
${content}
\`\`\`
`;
copy(discussionPost);
await arg({
    placeholder: "Post ready",
    hint: `JS fenced content copied to clipboard`,
    ignoreBlur: true,
}, md(`
* "Escape" to close prompt

## Open Kit Discussions
[Click to open new Kit discussion](https://github.com/johnlindquist/kit/discussions/new)

## View gist
[${gistUrl}](${gistUrl})

## Install Link
[${link}](${link})
`));
export {};
