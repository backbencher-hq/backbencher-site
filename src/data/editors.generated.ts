// The public projection of the product's generated editor/LSP facts.
//
// The product repository generates the full record (evidence paths, capture
// corpus, precision ledger, publishing state). The site only renders the shipped
// surface, so this file carries that subset and nothing internal: extension
// identity and version, the launch-language set and its aliases, the declared
// exclusions, the settings rows, the version matrix and the editor integrations.
//
// This is generated data, projected for publication. Regenerate it from the
// product's editors generator rather than editing values by hand; if a value
// here disagrees with the product, the product wins and this projection is stale.

// Types are intentionally widened: the projection is data, and consumers must
// not be pinned to one literal union generated from today's product state.
export type EditorFactsShape = {
  schemaVersion: number
  generatedBy: string
  extension: { name: string; displayName: string; description: string; version: string; minServerVersion: string }
  launchLanguages: string[]
  launchLanguagesSource: string
  analyzerAliases: string[]
  outsideEditor: string[]
  exclusions: string[]
  settingsDocRows: { key: string; default: string; meaning: string }[]
  versionMatrix: { extension: string; minServer: string; notes: string }[]
  integrations: { id: string; name: string; kind: string; languages: string[] }[]
}

export const EDITOR_FACTS: EditorFactsShape = {
  "schemaVersion": 1,
  "generatedBy": "the Backbencher product repository (editors/LSP record)",
  "extension": {
    "name": "bb-lsp-vscode",
    "displayName": "Backbencher Brain (bb_lsp)",
    "description": "Honest code navigation from the Backbencher index: hover with evidence tier and staleness, definition, references, symbols, call hierarchy. A complement to your editor's own language servers — graph, navigation, and evidence only.",
    "version": "0.1.0",
    "minServerVersion": "0.1.0"
  },
  "launchLanguages": [
    "java",
    "groovy",
    "kotlin",
    "scala",
    "typescript",
    "javascript",
    "python",
    "zig",
    "go",
    "rust",
    "c",
    "cpp",
    "vue",
    "svelte",
    "tsx",
    "html",
    "css",
    "scss",
    "sass",
    "json",
    "yaml",
    "toml",
    "markdown",
    "xml",
    "graphql",
    "protobuf",
    "sql",
    "perl",
    "ruby",
    "php",
    "lua",
    "elixir",
    "erlang",
    "haskell",
    "clojure",
    "julia",
    "r",
    "bash",
    "powershell",
    "make",
    "swift",
    "dart",
    "csharp",
    "fsharp",
    "nim",
    "vb",
    "vba",
    "matlab",
    "clean",
    "solidity",
    "hcl",
    "terraform"
  ],
  "launchLanguagesSource": "the product repository launch-language registry",
  "analyzerAliases": [
    "tsx",
    "sass",
    "terraform"
  ],
  "outsideEditor": [
    "objective-c"
  ],
  "exclusions": [
    "no completion",
    "no diagnostics",
    "no rename"
  ],
  "settingsDocRows": [
    {
      "key": "bbLsp.serverPath",
      "default": "empty",
      "meaning": "explicit server entry override (validated, never guessed)"
    },
    {
      "key": "bbLsp.sourceMode",
      "default": "auto",
      "meaning": "compiled dist preferred; source via bun is a declared fallback"
    },
    {
      "key": "bbLsp.minServerVersion",
      "default": "0.1.0",
      "meaning": "minimum server version accepted"
    },
    {
      "key": "bbLsp.activationBudgetMs",
      "default": "150",
      "meaning": "declared activation budget; miss it and activation is treated as failed"
    },
    {
      "key": "bbLsp.autoIndexMode",
      "default": "ask",
      "meaning": "consent before building an index; never is a declared no-op"
    }
  ],
  "versionMatrix": [
    {
      "extension": "0.1.x",
      "minServer": "0.1.0",
      "notes": "declared in bbLsp.minServerVersion; a server that won't state its version is never trusted (fail closed)"
    }
  ],
  "integrations": [
    {
      "id": "vscode",
      "name": "VS Code (and VS Code forks)",
      "kind": "bundled extension",
      "languages": [
        "java",
        "groovy",
        "kotlin",
        "scala",
        "typescript",
        "javascript",
        "python",
        "zig",
        "go",
        "rust",
        "c",
        "cpp",
        "vue",
        "svelte",
        "tsx",
        "html",
        "css",
        "scss",
        "sass",
        "json",
        "yaml",
        "toml",
        "markdown",
        "xml",
        "graphql",
        "protobuf",
        "sql",
        "perl",
        "ruby",
        "php",
        "lua",
        "elixir",
        "erlang",
        "haskell",
        "clojure",
        "julia",
        "r",
        "bash",
        "powershell",
        "make",
        "swift",
        "dart",
        "csharp",
        "fsharp",
        "nim",
        "vb",
        "vba",
        "matlab",
        "clean",
        "solidity",
        "hcl",
        "terraform"
      ]
    },
    {
      "id": "zed",
      "name": "Zed",
      "kind": "wasm shim extension",
      "languages": [
        "TypeScript",
        "JavaScript"
      ]
    },
    {
      "id": "helix",
      "name": "Helix",
      "kind": "languages.toml entry",
      "languages": [
        "typescript",
        "javascript",
        "java",
        "scala"
      ]
    },
    {
      "id": "jetbrains",
      "name": "JetBrains via LSP4IJ",
      "kind": "user-defined server template",
      "languages": [
        "typescript",
        "javascript",
        "java",
        "scala"
      ]
    }
  ]
}
