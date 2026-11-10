# Security policy

`backbencher-site` is the static website at <https://backbencher.cc>. It has no
server, no database, no accounts, and no environment secret is required to build
it. The site is prerendered and deployed as static output.

That makes the security surface of **this repository** small: dependency
vulnerabilities, injection through content, and accidentally committed secrets.

## Reporting

- **Do not open a public issue for a vulnerability.**
- Prefer GitHub **private vulnerability reporting** on this repository (Security
  tab → Report a vulnerability), or on the product repository
  [`backbencher-hq/backbencher-brain`](https://github.com/backbencher-hq/backbencher-brain).
- Email: `security@backbencher.cc`.

For vulnerabilities in the **product** (CLI, MCP server, language server,
installers), use the product repository's
[SECURITY.md](https://github.com/backbencher-hq/backbencher-brain/blob/main/SECURITY.md);
this repository only ships the pages that describe it.

## Secrets

No API keys, tokens, or credentials belong in this repository. The site build
requires none. If you find a committed secret, report it privately; do not open
an issue quoting it.

## Supported versions

The currently deployed site is supported. Fixes are deployed from `main`.
