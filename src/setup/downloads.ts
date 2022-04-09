// Description: Downloads the latest docs and hot
// This is run by the app.

try {
  await run(kitPath("hot", "download-hot.js"))
  await run(kitPath("help", "download-docs.js"))
} catch {
  console.warn(`Failed to download data`)
}

export {}