// The public reference of the agent tool registry, generated in the product
// repository from the executable descriptors. Do not edit these values by hand:
// the tools page renders this file and is forbidden from typing a tool fact.
// Performance and evidence prose are deliberately not part of the public record
// (they cite internal measurement artifacts); the declared limits that ship are.
export const TOOL_FACTS = [
  {
    "name": "bb_search",
    "category": "search",
    "summary": "Unified lexical, content, exact-symbol, and file retrieval.",
    "description": "Unified indexed retrieval for symbol lists, content, exact symbol source, or files. This is retrieval, not natural-language explanation or code analysis. `symbols` (default) searches indexed symbol NAMES with exact, prefix and substring phases, optional case folding (default: case-insensitive over every Unicode case pair), exact-name restriction, regex name matching (the query is then a JavaScript RegExp source, validated and bounded), language/symbolKind filters (case-insensitive against the indexed vocabulary), snippets and paging; it answers as text lines plus a final machine-readable match-set line (`[match-set] searchMode=symbols totalMatches=… returned=… truncated=… staleCount=…`) so a short page is never read as a complete one. `content` searches the indexed symbol corpus — name, qualified name, docstring and the stored bounded symbol body — case-insensitively, and answers as JSON declaring the match set (`total`, `returned`, `truncated`, `truncationReason`), HOW it matched (`matchMode` phrase when the query appeared verbatim, terms when nothing matched verbatim and the query's content words were matched instead, with `termMatch` naming which words carried the best hit), `bodyCoverage` ({ withBody, symbols, ratio }) so 'nothing matched' is distinguishable from 'nothing could match', and a freshness block. `symbol` returns the exact indexed symbol record(s) with byte bounds, language and per-match freshness, declaring `found` and `totalMatches` (the complete match set; this mode has no paging). `file` returns current source for one indexed project-relative file, bounded to 100,000 characters with `contentLength`/`truncated` and a file-scoped freshness block; it never auto-refreshes. `symbol`, `content` and `symbols` modes auto-refresh stale files they touch within a bounded budget and declare the decision in an `autoRefresh` field; `refresh:false` opts out. Stale rows carry `stale:true` and the freshness block's remediation names the manual reindex command (file scope names that exact file). `limit` is a page size and a work budget: 0 returns no rows, values above 2000 are refused rather than clamped, and `limit`/`offset` are accepted only by the modes that page (`symbols`, `content`). `language`/`symbolKind` values the index does not contain are errors naming the indexed vocabulary; options a mode cannot honour are refused naming that mode's accepted set; an invalid regex is a named error; a candidate cap, projection cap or time budget is reported as `truncated` with `truncationReason` instead of a complete-looking page.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "symbols",
      "content",
      "symbol",
      "file"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "caseSensitive",
        "type": "boolean",
        "required": false,
        "description": "case-sensitive matching (default false); folds every Unicode case pair, not only ASCII. symbols mode only"
      },
      {
        "name": "exact",
        "type": "boolean",
        "required": false,
        "description": "only exact name matches (default false); obeys caseSensitive. symbols mode only"
      },
      {
        "name": "filePath",
        "type": "string",
        "required": false,
        "description": "file target for file mode, or symbol disambiguation in symbol mode. Not accepted in symbols/content modes"
      },
      {
        "name": "includeContent",
        "type": "boolean",
        "required": false,
        "description": "include a code snippet per result (default false). symbols mode only"
      },
      {
        "name": "language",
        "type": "string",
        "required": false,
        "description": "filter by language, case-insensitive (e.g. typescript, python, go); a language this project does not index is an error. symbols/content modes only"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "max results (default 15; 0 returns no rows; above 2000 is refused; whole number). symbols/content modes page; symbol mode returns the COMPLETE match set when omitted and pages when given (its `totalMatches` is always the complete set size)"
      },
      {
        "name": "mode",
        "type": "string",
        "required": false,
        "description": "retrieval mode (default symbols)"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "pagination offset (default 0). symbols/content modes, and symbol mode when `limit` is given"
      },
      {
        "name": "query",
        "type": "string",
        "required": false,
        "description": "symbol/content/regex query, trimmed before use; also accepted as the exact symbol name in symbol mode. Not accepted in file mode"
      },
      {
        "name": "refresh",
        "type": "boolean",
        "required": false,
        "description": "false opts out of the inline auto-refresh of stale files (default: auto-refresh within budget before answering). Accepted by symbols/content/symbol; file mode never auto-refreshes and does not accept it"
      },
      {
        "name": "regex",
        "type": "boolean",
        "required": false,
        "description": "treat query as a regex against symbol names (default false). symbols mode only"
      },
      {
        "name": "symbolKind",
        "type": "string",
        "required": false,
        "description": "filter by symbol kind, case-insensitive (function, class, variable, interface, enum, ...); a kind this project does not index is an error. symbols/content modes only"
      },
      {
        "name": "symbolName",
        "type": "string",
        "required": false,
        "description": "exact symbol name for symbol mode; supplying it with a different query is an error"
      }
    ],
    "defaults": {
      "mode": "symbols",
      "limit": 15,
      "includeContent": false,
      "exact": false,
      "caseSensitive": false,
      "regex": false,
      "offset": 0
    },
    "examples": [
      {
        "mode": "symbols",
        "query": "handleRequest",
        "limit": 5
      },
      {
        "mode": "content",
        "query": "serialize cache entry"
      },
      {
        "mode": "symbol",
        "symbolName": "handleRequest"
      },
      {
        "mode": "file",
        "filePath": "src/app.ts"
      }
    ],
    "returns": [
      "`symbols` mode: one text line per match (name [kind] file:line (language), plus a snippet when includeContent is set) and a final machine-readable `[match-set] searchMode=symbols totalMatches=… returned=… truncated=… staleCount=…` line",
      "`content` mode: JSON with the match set (`total`, `returned`, `truncated`, optional `truncationReason`), the route (`matchMode` phrase/terms, `termMatch` on the terms route), `bodyCoverage`, page-local `staleCount`/`freshCount`/`pageStaleCount`, and a `freshness` block",
      "`symbol` mode: JSON `matches` of exact indexed symbol records (id, fileId, name, symbolType, lineStart, byteStart, byteEnd, language), `found`, `totalMatches`, `returned`/`truncated` when paged, per-match `stale`, and a `freshness` block",
      "`file` mode: JSON source envelope (`searchMode`, project-relative `file`, `fileId`, `language`, `content`, `contentLength`, `truncated` at 100,000 characters, `totalMatches: 1`, `stale`) plus a file-scoped `freshness` block"
    ],
    "errors": [
      "Missing or blank mode-specific query, symbolName or filePath",
      "Invalid regular expression: a named error carrying the pattern and the engine's reason",
      "`exact` combined with `regex` in symbols mode (they ask for different things)",
      "`limit` above 2000: refused, never clamped",
      "`language`/`symbolKind` value the index does not contain: the message names the indexed vocabulary",
      "Option that the chosen mode cannot honour: the message names that mode's accepted set",
      "Project has no index: the message names the reindex command",
      "File mode: path escapes the project root, path is not a file, or the file is not indexed"
    ],
    "limitations": [
      "Content search is lexical over the indexed symbol corpus (name, qualified name, docstring and the stored bounded body). It is not full-text file search and it is not semantic — use bb_ask for semantic discovery.",
      "A body-only word is unreachable when the index was built by an analyzer that does not store symbol bodies. `bodyCoverage` reports how much of the corpus carries a searchable body so 'nothing matched' is distinguishable from 'nothing could match'.",
      "Regex matching scans at most 20,000 candidate symbol names under a 2,000 ms matching budget. A cut scan is reported as `truncated` with `truncationReason` and is never presented as a complete answer.",
      "`symbol` mode returns the complete match set unless `limit` is given; with `limit` it pages over that complete set (`totalMatches` always names the whole set).",
      "Results reflect the index and may be stale. Stale/missing files are flagged per row and in the freshness block, and the remediation names the manual reindex command."
    ],
    "safety": "No source file is ever modified. `symbols`/`content`/`symbol` reindex stale files they touch within a bounded budget unless BB_NO_AUTO_REFRESH=1 or refresh=false (declared in `autoRefresh`); `file` never auto-refreshes. A content read does not persist schema in the index database: the durable search index is built by maintenance, and the ranking table a query needs is created in the connection's temp schema.",
    "relations": "For lexical/exact retrieval use this tool. For natural-language questions over the codebase use `bb_ask` (semantic, cited answers).",
    "staleness": "Freshness modes (registered as freshnessModes): symbol, content, file. Staleness surfaces as: per-row stale flags + freshness block ({ fresh, stale, missing, staleRatio, mode, remediation }). When something is stale/missing, the remediation names the registered reindex interfaces: project scope → reads auto-refresh stale files within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only); file scope → reads auto-refresh this file within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index \"<file>\" (or the bb_index tool with that file path). Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_ask",
    "category": "search",
    "summary": "Exact aggregates, exact-name lookups, and scored semantic or lexical matches — each labelled with its route and bounds.",
    "description": "Answer a question about the codebase from the index, with the route and its limits stated. Four routes: (1) an EXACT AGGREGATE over indexed rows (counts of symbols/functions/classes/interfaces/structs/enums/traits/types/constants/relationships/imports/files, optionally by language; the largest file; the most complex function) — exact about the indexed snapshot, with that snapshot's time reported, and never a similarity claim; (2) an EXACT SYMBOL NAME lookup when the query is a single symbol name — matched by name, not by similarity, with its neighbours listed and labelled as neighbours; (3) SEMANTIC RETRIEVAL over stored embeddings — only vectors from the same model and dimension as the query are compared, similarities are cosine scores, and the answer reports which model space it compared, how many symbols exist in that space versus across the whole library, whether the scan cap was reached, and whether the provider embedding timed out (then a capped local 50-dimension fallback runs); (4) a KEYWORD FALLBACK when embeddings are unavailable or nothing clears the similarity floor — lexical matches that carry NO similarity score, with the reason stated. Every answer reports its confidence kind: a mean of returned similarities (bounded 0.2–0.85), a declared floor when no score was computed, or NO confidence number at all when the ranking is declared non-discriminative (the answer then says the scores do not separate candidates). Every answer declares `returned`/`totalMatches`/`truncated` bounds so a prefix is never read as a complete match set. Cited sources carry `[STALE — file changed since index]` or `[MISSING — file no longer on disk]` markers, and nothing is auto-refreshed. `limit` is the page size: whole number 1..100, default 5, values outside refused rather than clamped. When embeddings are configured, the natural-language question itself is sent to the configured embedding provider to compute the query vector; with local word vectors everything stays offline.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "answer"
    ],
    "plannedModes": [
      "explain",
      "feature"
    ],
    "parameters": [
      {
        "name": "query",
        "type": "string",
        "required": true,
        "description": "natural-language question, or a symbol name for the exact-name route"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "max results (default 5; whole number 1..100; values outside are refused, not clamped). A larger page also means a larger work budget."
      }
    ],
    "defaults": {
      "limit": 5
    },
    "examples": [
      {
        "query": "how many functions are in this project"
      },
      {
        "query": "where is request handling implemented"
      },
      {
        "query": "handleRequest",
        "limit": 1
      }
    ],
    "returns": [
      "Exact aggregates over the indexed snapshot — symbol counts by kind (functions count both `function`- and `method`-kind symbols), relationships, imports, files (optionally by language), the largest file and the most complex function — each answer carrying the index snapshot's timestamp",
      "An exact symbol-name lookup when the query is a symbol name, with its neighbours listed and explicitly labelled as neighbours rather than better matches",
      "Ranked semantic matches with real cosine similarities when stored embeddings allow it, each answer naming the compared model, the symbols comparable in that model space, the library-wide coverage, the scan bounds, and per-source `[STALE — file changed since index]` / `[MISSING — file no longer on disk]` markers",
      "Lexical matches when embeddings are unavailable or nothing clears the similarity floor — with NO similarity number printed, because none was computed, and the fallback reason named",
      "Declared bounds on every answer: `returned`, `totalMatches` (or an explicit unknown), `truncated` and `truncationReason`; plus a confidence kind: exact aggregate, exact name lookup, mean of returned similarities (bounded 0.2–0.85), declared floor, or none when the ranking is declared non-discriminative"
    ],
    "errors": [
      "Empty or whitespace-only query",
      "`limit` outside 1..100 (0 included) — refused rather than clamped, because a clamped page looks like the page the caller asked for",
      "Unknown option, or a mode that exists only in `plannedModes` (`explain`, `feature`)",
      "No index for the project, or an index that cannot be read — answered as a declared unknown with zero sources, never a fabricated count"
    ],
    "limitations": [
      "Semantic similarity discovers candidates; it does not prove behaviour, ownership or architecture, and the answer says so",
      "Local word vectors are a 205-word programming vocabulary plus the project's own vocabulary hashed into 50 dimensions. Their cosines are not comparable with a model embedding's, and an identifier-shaped query whose tokens are all absent produces a zero vector, reported as `reason=degenerate-query-vector`",
      "Coverage is per comparison space. On a mixed-model index the symbols comparable in the query model's space can be far fewer than the library-wide number; both numbers are reported and labelled",
      "When the configured embedding provider does not answer within the tool's wait ceiling (2 s, or `BB_EMBEDDING_TIMEOUT_MS` when lower) the question is embedded with the local word-vector model, the answer declares the timeout, and the ranking is limited to that model's space",
      "A verified aggregate is exact about the indexed snapshot, not the working tree: files changed after the last index write are not reflected, and the answer reports the snapshot time so the reader can judge the gap",
      "The dense candidate scan is capped at `BB_VECTOR_SCAN_CAP` rows (default 20,000). When the cap is reached the answer declares `truncated=true`, and the candidates are a deterministic prefix of the embedding table ordered by entity id",
      "A non-discriminative ranking (several candidates within the 0.05 margin of the best) publishes no numeric confidence: the answer says the scores do not separate candidates instead of printing a number it calls unreliable"
    ],
    "safety": "Read-only. Every index open is byte-read-only: the tool does not create a database, run migrations, heal indexes or promote embeddings, and it never writes source or rebuilds embeddings behind the caller's back. When embeddings are configured, the natural-language question itself is sent to that embedding provider to compute the query vector; with local word vectors the whole call stays offline.",
    "relations": "For exact symbol/content/file retrieval use `bb_search`; this tool answers natural-language questions with citations.",
    "staleness": "Freshness modes (registered as freshnessModes): answer. Staleness surfaces as: per-source [STALE — file changed since index] markers on retrieval answers, repeated in the source list; a verified aggregate answer carries no per-file marker (it describes the whole index, not a file). This tool does not auto-refresh, and it emits no freshness envelope: a verified aggregate answer is a count over the whole index rather than a per-file fact, so there is no per-file envelope to publish. When a cited source is stale, remediation is manual: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only). Nothing is stale → no marker. Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_health",
    "category": "lifecycle",
    "summary": "Unified index, schema, freshness, embeddings, runtime, integrity, completeness and analysis-history report — status by default, one explicit refresh behaviour, and no `mode` parameter.",
    "description": "Unified index health: file/symbol/relationship/imports counts, embedding model + coverage, schema version, runtime, file freshness, what this call cost, and (when asked) the integrity battery, analysis-history totals and index completeness. There is no `mode` parameter: a call reports status, and `refresh`/`force` select the one behaviour that mutates the index. The default output names WHY each file was classified: `freshness why` separates fresh-verified-by-content-hash from fresh-verified-by-mtime+size-only (the file was not read), and names content-changed, deleted-from-disk, unreadable and unindexed separately, because those need different fixes and a single 'N stale' number is not actionable. Every report carries a top-level `healthy` boolean on the tool result (and inside the JSON payload when history=true): false exactly when the report contains an error-severity finding; a broken index is a successful REPORT, not a tool error (isError stays false), while wrong input is refused with isError. Options the chosen call cannot honour are refused: `limit` needs history=true; `wait` needs refresh/force; `sampleSize` belongs to sampled freshness only. Use verbose=true for a per-language breakdown, PER-LANGUAGE SEARCHABILITY (the share of each language's symbols a semantic query can reach — a language at 0% is invisible to bb_ask), the embedded/unembedded symbol kinds and stale-file names; verbose=true is also the only call that runs the per-symbol embedding aggregates, so a default call is bounded by the file count, not the symbol count. integrity=true runs the index integrity check battery, which NAMES each non-ok check with its remediation; with the default sampled freshness the battery falls back to a COMPLETE disk pass over the indexed files (it content-hashes files whose metadata changed), so it is materially more expensive than a status call. freshness=\"complete\" (not a `complete` option) checks every indexed file instead of a sample; includeAnalysisRuns=true adds persisted run/finding totals; history=true answers with a JSON object { health, history, healthy } instead of the text report and is the only caller of `limit` (minimum 1, default 20). checkUnindexed=true walks the project and reports files the indexer would index but the index does not contain — a stat per eligible file, opt-in because a default call must not silently acquire a walk. refresh=true reindexes before reporting (`wait` defaults true; wait=false detaches it and the NEXT call reports the outcome once, success or failure); force=true wipes and rebuilds first and is DESTRUCTIVE. Freshness defaults to a DETERMINISTIC sample spread across the whole index: `stale` is then a lower bound on the project, not a total, and the report says so — pass freshness=\"complete\" when you need the exact count.",
    "mutability": "read",
    "requiresIndex": false,
    "modes": [
      "status",
      "refresh"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "checkUnindexed",
        "type": "boolean",
        "required": false,
        "description": "WALK the project and report files on disk that the indexer would index but the index does NOT contain — the direction freshness cannot see (freshness reports files IN the index and gone from disk). Costs a stat per eligible file, i.e. the discovery phase of an index run, so it is opt-in. Uses the INDEXER'S OWN discovery rules, so gitignored files, node_modules, unsupported extensions and >5MB files are correctly NOT counted, and the output names that population. Without this option, index completeness is not asserted at all"
      },
      {
        "name": "force",
        "type": "boolean",
        "required": false,
        "description": "force a full in-place reindex before reporting — DESTRUCTIVE: the index is wiped before it is rebuilt, so a failure leaves it empty"
      },
      {
        "name": "freshness",
        "type": "string",
        "required": false,
        "description": "freshness mode (default sampled — a deterministic, unbiased sample spread over every indexed file, NOT the first N; freshness=\"complete\" checks every indexed file and makes the stale count exact)"
      },
      {
        "name": "history",
        "type": "boolean",
        "required": false,
        "description": "return persisted analysis history (default false). CHANGES THE OUTPUT SHAPE: this mode answers with a JSON object { health, history, healthy } instead of the text report, so a caller must not parse the text form when asking for it; the result also carries the same top-level `healthy` boolean as the text form"
      },
      {
        "name": "includeAnalysisRuns",
        "type": "boolean",
        "required": false,
        "description": "add persisted analysis run/finding totals (full-table counts, not a page length)"
      },
      {
        "name": "integrity",
        "type": "boolean",
        "required": false,
        "description": "run the index integrity check battery (14 checks, each named with its remediation when not ok). Cost: with the default sampled freshness the battery performs a COMPLETE disk pass over the indexed files (content-hashing those whose metadata changed), so this is the most expensive opt-in"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "analysis-history page size (default 20); must be a whole number >= 1 and is only read when history=true — supplying it without history is REFUSED"
      },
      {
        "name": "paths",
        "type": "array",
        "required": false,
        "description": "report the state of these project-relative files INSTEAD of a project-wide freshness answer — for the question an agent actually has after an edit, at O(files named) rather than O(project). At most 50, no duplicates, no blank entries. The answer is a SEPARATE self-describing block, so every other number in the report stays project-wide and the two can never be read as one. Each path is FIVE-state, not a boolean: fresh (indexed, on disk, unchanged), stale (content changed), gone (indexed, no longer readable on disk — `reason` distinguishes file-gone from unreadable), NOT-INDEXED (on disk, the indexer has not run since it appeared — a freshness verdict here would be meaningless), or absent (no such path). Paths that resolve outside the project, or through a symlink out of it, are REFUSED and reported as unchecked rather than answered"
      },
      {
        "name": "refresh",
        "type": "boolean",
        "required": false,
        "description": "reindex the project before reporting"
      },
      {
        "name": "sampleSize",
        "type": "number",
        "required": false,
        "description": "freshness sample count (default 200); must be a whole number >= 1 and applies to freshness=\"sampled\" only — supplying it together with freshness=\"complete\" is REFUSED"
      },
      {
        "name": "verbose",
        "type": "boolean",
        "required": false,
        "description": "include the per-language breakdown, per-language searchability, embedded/unembedded symbol kinds, embedding config/chain and stale/missing file names (default false). This is the only value that runs the per-symbol embedding aggregates; a default call skips them so it stays bounded by the file count"
      },
      {
        "name": "wait",
        "type": "boolean",
        "required": false,
        "description": "applies to refresh/force only (default true; supplying it without refresh/force is REFUSED). wait=false detaches the rebuild and returns the current snapshot; the NEXT call reports the detached outcome once — completion as well as failure"
      }
    ],
    "defaults": {
      "verbose": false,
      "history": false,
      "limit": 20,
      "refresh": false,
      "force": false,
      "wait": true,
      "freshness": "sampled",
      "sampleSize": 200,
      "integrity": false,
      "includeAnalysisRuns": false
    },
    "examples": [
      {
        "verbose": true
      },
      {
        "history": true,
        "limit": 5
      },
      {
        "refresh": true,
        "wait": false
      },
      {
        "force": true
      },
      {
        "integrity": true
      },
      {
        "freshness": "complete"
      },
      {
        "includeAnalysisRuns": true
      },
      {
        "paths": [
          "src/mcp/server.ts"
        ]
      },
      {
        "checkUnindexed": true
      }
    ],
    "returns": [
      "Counts (files, symbols, relationships, imports, syntax-error files), schema version, runtime, embedding model/coverage and a `freshness` block that states whether it checked a SAMPLE or the whole index",
      "The freshness reason mix per file (content-changed, deleted, unreadable, unindexed) and, on verbose, the bounded stale/missing file names",
      "When `paths` is given: a separate five-state block (fresh / stale / gone / not-indexed / absent) for exactly those files, while every other number stays project-wide",
      "When `checkUnindexed` is given: files on disk the indexer would index but the index does not contain, with the population named",
      "When `integrity` is given: the integrity checks with their status and remediation, naming each non-ok check rather than only a score",
      "When `includeAnalysisRuns` is given: persisted run/finding totals as full-table counts; `history` instead answers with JSON `{ health, history, healthy }`",
      "A `healthy` boolean on the result (and inside the history JSON): false exactly when the report contains an error-severity finding"
    ],
    "errors": [
      "An option the selected behaviour cannot honour: `limit` without `history=true`, `wait` without `refresh`/`force`, `sampleSize` with `freshness=\"complete\"` — each refused with the accepted form named",
      "Invalid values: unknown `freshness`, `sampleSize` below 1, a non-integer `limit` (and `limit: 0` with `history=true`)",
      "`paths` problems: an empty list, more than 50 entries, duplicate entries, blank entries, or a path that escapes the project (directly or through a symlink)",
      "An index that cannot be opened read-only is reported as an EMPTY_INDEX error finding, not as a tool failure: a broken index is a successful report"
    ],
    "limitations": [
      "Sampled freshness (the default) is a deterministic sample, so `stale` is a LOWER BOUND on the project, not a total; `freshness=\"complete\"` is the exact census",
      "A `fresh` verdict reached through the mtime+size fast path never read the file: a same-size edit that preserves the mtime reads fresh (the same trade-off as git's stat-cache)",
      "Embedding coverage reports stored vectors, not semantic quality or retrieval accuracy; verbose=true is what joins it to per-language searchability",
      "`integrity: true` with the default sampled freshness performs a COMPLETE disk pass over the indexed files, and `checkUnindexed: true` walks the project — both are opt-in precisely because a default call must not acquire them",
      "The default call does not run the per-symbol embedding aggregates (per-language symbol counts, searchable-by-language, embedded/unembedded kinds, provider chain); those run only for verbose=true, which is what keeps a default answer bounded by file count rather than symbol count",
      "No `mode` parameter exists: a call reports status, and `refresh`/`force` are the only behaviours selected by flags"
    ],
    "safety": "A status call is read-only: the index is opened through the driver's read-only mode, so no migrations, healers or WAL writes run. refresh=true and force=true are the only index mutations and are explicit: refresh reindexes, force WIPES the index before rebuilding and is destructive; wait=false detaches a rebuild and the next call reports its outcome once. `healthy:false` never means the tool failed — the report is the answer.",
    "relations": "For index size/counts use `bb index status` (CLI) or the stats surface; this tool reports index health, freshness, completeness and integrity.",
    "staleness": "Freshness applies to the tool's read output (no registered per-mode split). Staleness surfaces as: a top-level freshness block on every report ({ mode, requestedMode, checked, total, fresh, stale, missing, staleFiles, missingFiles, unresolved, isComplete, reasons }) — mode is what was actually CHECKED, isComplete is the boolean to branch on before reading stale as a project total, unresolved is counted as neither fresh nor stale, and reasons carries the verdict mix ({ byKind, freshVerifiedByContent, freshVerifiedByMetadata, isSample }) so a consumer can tell a content-hash-verified file from an mtime+size fast-path one without reading the prose. paths answers per-path state for named files; verbose adds the stale/missing file NAMES. It does not auto-refresh on a read: the report DESCRIBES the index and a reindex happens only when asked for (refresh: true reindexes before reporting, force: true wipes and rebuilds first and is destructive, wait: false detaches it), so a stale report is a measurement, not a repair. When the report names stale or missing files, repair them with the manual interface: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only), or pass paths to check named files instead of scanning the project. Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_patterns",
    "category": "analysis",
    "summary": "Pattern/orphan analysis ranked by confidence, with a bounded page, a declared census, per-finding staleness, and optional persisted run history.",
    "description": "Detect orphaned code, framework patterns, and anti-patterns, ranked by confidence, with staleness markers when a finding's file changed after indexing. Use scope=orphaned for dead code; scope=all (default) for the full pattern scan with the optional class/confidence filters. Orphan confidence is derived from evidence (0.30-0.70); anti-pattern confidence is 0.60-0.90; framework findings carry a fixed 0.6. `limit` is one bounded page (maximum 500) and the answer names the full census. Architecture and code-quality analysis are planned, not yet executable.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "orphaned",
      "all"
    ],
    "plannedModes": [
      "quality",
      "architecture"
    ],
    "parameters": [
      {
        "name": "confidenceThreshold",
        "type": "number",
        "required": false,
        "description": "drop findings below this confidence (default 0 = report everything, ranked). Orphan confidence is evidence-derived and spans 0.30-0.70; anti-pattern confidence spans 0.60-0.90; framework findings are a fixed 0.6"
      },
      {
        "name": "history",
        "type": "boolean",
        "required": false,
        "description": "return persisted pattern history (runs bounded by limit; the findings window and its total are declared in the answer)"
      },
      {
        "name": "includeAntiPatterns",
        "type": "boolean",
        "required": false,
        "description": "include anti-patterns (default true)"
      },
      {
        "name": "includeFramework",
        "type": "boolean",
        "required": false,
        "description": "include framework patterns (default true)"
      },
      {
        "name": "includeOrphaned",
        "type": "boolean",
        "required": false,
        "description": "include orphaned-code patterns in an all scan (default true)"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "maximum findings displayed (default 20, maximum 500); the answer's census line reports the full count"
      },
      {
        "name": "recordRun",
        "type": "boolean",
        "required": false,
        "description": "persist this scan as an analysis run (persists the whole census, not the displayed page; works in both scopes; capped at 50,000 findings with the cap disclosed)"
      },
      {
        "name": "scope",
        "type": "string",
        "required": false,
        "description": "orphaned only, or all pattern classes (default all)"
      }
    ],
    "defaults": {
      "scope": "all",
      "limit": 20,
      "includeOrphaned": true,
      "includeFramework": true,
      "includeAntiPatterns": true,
      "confidenceThreshold": 0,
      "history": false,
      "recordRun": false
    },
    "examples": [
      {
        "scope": "orphaned"
      },
      {
        "confidenceThreshold": 0.6
      },
      {
        "recordRun": true
      }
    ],
    "returns": [
      "A bounded page of findings (default 20, maximum 500): rule/type, file:line, symbol for orphan rules, confidence, and a per-finding [stale] marker when the finding's file changed after indexing",
      "A census line naming the full finding count and the per-rule breakdown, so the page never reads as the population",
      "scope=orphaned: suppression accounting (every candidate the scan discarded, by reason), refused-usage counts (selfLoop/inferred/lowConfidence), and import-resolution counts",
      "provenance line: evidence class, engine, symbols/files scanned, limitations count",
      "Explicit JSON when history=true: runs bounded by limit, a findings window (200) with findingsTotal/findingsReturned/findingsTruncated declared"
    ],
    "errors": [
      "scope must be one of: orphaned, all",
      "confidenceThreshold must be between 0 and 1",
      "limit must be a whole number >= 0; above 500 it is refused by name (the census line reports the full count)",
      "unknown or irrelevant options are refused and the accepted options are named",
      "No index found for <project>: run: bb index <project> — an unindexed project is a named refusal, never a clean zero"
    ],
    "limitations": [
      "A finding is not a deletion instruction. The tool reports what the index does and does not record; where the index is silent, the finding says so on its face rather than presenting absence of evidence as evidence of absence.",
      "The text answer does not include the engine's per-finding evidence array, limitations array or remediation text. Those travel on the engine report (PatternFinding) that the text is rendered from; the answer surface carries the aggregate disclosures listed under Returns.",
      "Confidence is derived from evidence classes, not assigned per rule. Orphans span 0.30-0.70 (0.30-0.55 for file findings); anti-patterns span 0.60-0.90. Name-unique orphan candidates measured a 0.0% false-positive rate against a source-text oracle; ambiguous names measured 14.4%; per-corpus rates are a lower bound because the oracle cannot see reflection or template indirection.",
      "Framework findings carry a FIXED confidence of 0.6 — that is the whole population of that rule, so a threshold above 0.6 removes every framework finding at once rather than discriminating among them.",
      "A relationship counts as usage evidence only when it is not a self-loop, its published evidenceClass is not \"inferred\", and its confidence is at least 0.7. Refused rows are counted in the orphaned answer's [usage-evidence] line and itemised on the findings they would have cleared.",
      "A finding whose symbol had no recorded incoming reference while its file did carries a coverage-gap indicator: that is the signature of an analyzer that reached the file and not the declaration, and such a finding may be a coverage gap rather than dead code.",
      "Dynamic dispatch, reflection and string-keyed lookups are invisible to the index; the engine never fabricates a resolved edge for them, so a symbol reached only that way is reported with the limitation stated on the finding.",
      "Lifecycle methods can look unreferenced because a framework invokes them by convention rather than by a recorded call: Ruby \"initialize\", constructors in Java/Kotlin/C#/Python, and similar framework entry points are known false-positive classes. Treat them as entry points when reviewing a report.",
      "Test files are excluded from candidates but not from evidence: a production symbol called only from a test is not reported, and a production file imported only by a test is not reported as orphaned. The engine option includeTests (true means \"also report test symbols\") is an engine API option, not a bb_patterns parameter.",
      "Framework and anti-pattern detection is heuristic and confidence-qualified; non-code languages (JSON, YAML, Markdown, ...) contribute no symbol candidates and no anti-pattern findings, though they are still indexed and checked as whole files."
    ],
    "safety": "The read path is byte-read-only: db and WAL are unchanged by a call (the -shm read marks may move). A read never creates an index or a schema. recordRun is the one write and it is opt-in: it persists analysis-history records (never source), records the whole census up to a declared 50,000-finding cap rather than the displayed page, and reports the recorded count and any cap on the answer.",
    "relations": "For security-specific taint findings use `bb_security`; this tool covers orphans, framework patterns, and anti-patterns.",
    "staleness": "Freshness applies to the tool's read output (no registered per-mode split). Staleness surfaces as: per-finding [stale] markers + counts footer naming the remediation; silent when all fresh. This tool does NOT auto-refresh: the per-finding flags DESCRIBE the index as it stands, nothing is reindexed to make them stale or fresh, and there is no refresh option to opt out with. When findings name stale or missing files, repair them with the manual interface: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only). Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_security",
    "category": "analysis",
    "summary": "Taint-flow findings over the index, with optional persisted run history. A flow is a finding only when both endpoints resolve to indexed symbols; one-sided flows are reported as unvalidated observations. A findings answer states the pre-cap census so a capped scan is never mistaken for a complete one; a history answer states its run count and its finding total, and its findings page is capped and declared. Reads open the index read-only and refuse an unindexed project; recordRun is the one write. Not detected: hardcoded secrets; genuine cross-language taint; standalone weak crypto.",
    "description": "Taint-flow security scan over the indexed source-to-sink flows: SQL injection, XSS, command injection, path traversal, insecure deserialization, SSRF, open redirect and code execution. Flows whose endpoints both resolve to indexed symbols are findings; one-sided flows are reported separately as unvalidated observations, never as confirmed exploits. Reads are read-only against the index; an unindexed project is refused by name. Findings whose underlying file changed after indexing carry a staleness marker.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "findings"
    ],
    "plannedModes": [
      "flow",
      "summary",
      "hotspots"
    ],
    "parameters": [
      {
        "name": "history",
        "type": "boolean",
        "required": false,
        "description": "return persisted security history"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "history run limit (default 20)"
      },
      {
        "name": "recordRun",
        "type": "boolean",
        "required": false,
        "description": "persist this scan as an analysis run"
      }
    ],
    "defaults": {
      "history": false,
      "recordRun": false,
      "limit": 20
    },
    "examples": [
      {},
      {
        "recordRun": true
      },
      {
        "history": true
      }
    ],
    "returns": [
      "A findings answer: one line per finding with severity, label, symbol, resolved `file:line`, source and sink type, and `[mitigated]` / `[stale]` flags when they apply — at most 20 findings are rendered per answer",
      "A `[scan: …]` census line stating how many taint flows were indexed, how many findings they deduplicated into, how many are shown, how many are beyond the scan cap, and — when the cap bites — the explicit `CAPPED at <cap>` sentence naming how many findings were not examined",
      "One-sided flows listed separately as unvalidated observations, each with its real severity, its location and the reason it is unvalidated (at most 5 rendered; the census names the total)",
      "A staleness footer only when a finding's file changed after indexing: `N stale, M missing of K finding file(s)` plus the manual repair command; silence when everything is fresh",
      "A history answer: a JSON page with the persisted runs (bounded by `limit`), the persisted findings (capped at 200 with `findingsTotal`/`findingsShown`/`findingsTruncated`), the finding-state summary, and a `census` object. Persisted findings carry the engine's evidence, calibrated confidence and per-finding limitations; unvalidated observations are never persisted"
    ],
    "errors": [
      "Unavailable index — every door (MCP, CLI, library) refuses by name; a read never creates an index",
      "Invalid history limit (non-integer, or negative)",
      "Unknown option (rejected with the accepted set named)",
      "`limit` without `history: true` (refused: it would be accepted and then ignored)",
      "`history` together with `recordRun` (refused: they are different answers; pass one)"
    ],
    "limitations": [
      "Static taint analysis can produce false positives and false negatives",
      "It is not runtime testing or a penetration test",
      "`confirmed` means both flow endpoints are indexed symbols — it does **not** prove the values are connected. The indexer pairs every taint source with every taint sink in a symbol body, so two tokens in one function produce a confirmed flow whether or not one reaches the other",
      "**Not detected:** hardcoded secrets (no such finding type is emitted; that rule belongs to `bb_patterns`), genuine cross-*language* taint (the `crossLanguage` flag means the flow was stitched across symbols, not that languages differ), standalone weak-crypto use (emitted as a sink with no co-located source, so it remains an observation)",
      "Severity is normalized into exactly `critical|high|medium|low|unknown`; an unrecognised stored value becomes `unknown` rather than vanishing from the counts. Persisted history stores the normalized grade of a confirmed/mitigated flow, so an ungradeable resolved flow is recorded as `unknown`",
      "A parameterized or escaped sink may still be reported: the indexer matcher is token-based and does not track sanitizers, so validate a critical finding against the actual data flow before acting on it"
    ],
    "safety": "Reads are read-only: the index is opened with the driver's read-only mode, so a read runs no migrations and moves no WAL. `recordRun` is the one write — it stores analysis-history rows — and, because it opens the database for writing, it may also run the additive open-path migrations every write path runs. No source file is ever modified.",
    "relations": "For general code-quality patterns use `bb_patterns`; this tool focuses on taint flows and security findings.",
    "staleness": "Freshness applies to the tool's read output (no registered per-mode split). Staleness surfaces as: per-finding [stale] markers + counts footer naming the remediation; silent when all fresh. This tool does not auto-refresh and has no refresh option: a touched finding file is marked [stale] and the footer names the MANUAL repair — run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only). Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_visualize",
    "category": "analysis",
    "summary": "Scoped canonical dependency graphs with explicit truncation and provenance.",
    "description": "Scoped dependency and architecture visualization: one bounded projection over the index's stored symbol and relationship rows, with explicit filters, provenance, truncation, machine-readable JSON, and genuinely self-contained HTML (no network, no fonts, no build step — it renders offline, in an air-gapped editor, anywhere). The answer is an AUDITABLE projection of the index, not a picture: every link carries the stored relationship row it traces to (rowId) and its stored confidence, and every node carries its line, lineEnd and qualifiedName, so the graph is navigable and every edge can be checked against the row that justifies it. Distinct relationship types between the same pair are SEPARATE links, so a pair that is both contains and exports renders as both. Node size follows the index’s own gravity score. In the HTML, edge opacity encodes stored confidence, relationship type sets colour and a structural/behavioural dash, a CROSS-LANGUAGE edge gets its own wide dash and is drawn beneath the local edges so a polyglot project shows where one language hands off to another, and a stale endpoint (file changed since index) is drawn as a hollow ring; links inherit worst-of-endpoints. Nodes are grouped into the NAMED REGION they live in — a directory of the project, a directory with fewer than three matching symbols folded into its parent — each region placed at its own anchor inside a rounded pod and switchable from the sidebar like any other class, At overview zoom an edge BETWEEN two regions is drawn as one REGION LINK per region pair — dotted, because it is a summary and not a stored row; its width and alpha come from how many stored edges it stands for — while an edge INSIDE one region is always drawn as itself, and the individual cross-region edges return past ~1.15x zoom or when a link is opened (double-click frames both of its regions). Edges drawn individually are capped at a zoom-dependent count with the readout naming the cap, because an uncapped aggregate is a smear rather than a map; the frame's readout reconciles the picture with the census (how many cross-region edges the links stand for, how many pairs exist, how to open them), the sidebar's live line repeats it, and the links — with their regions, counts, stored rows, commonest relationship and screen geometry — are PUBLISHED on the view's API rather than only painted, because a summary that can only be seen cannot be checked. Moving the pointer across the map never changes the view: hover emphasises the node's own edges, and a CLICK is what focuses, so the map cannot dissolve under the reader's hand. The graph has TWO arrangements and the reader picks: `layout: \"regions\"` (the default) is the region map described above, and `layout: \"force\"` drops the directories entirely — one force layout, no region pods and no region links, every stored edge drawn as itself under the same zoom-dependent cap — which is the graph as it looked before the regions existed, and which is the honest shape for a project whose parts do not fall along directory lines. The layout is written onto the document itself (data-bb-layout) and both arrangements are offered as a switch in the generated page's sidebar, so `layout` sets the arrangement the page OPENS with and the reader can move between them without regenerating anything. The picked-item panel is deliberately not a modal: it docks to either side of the frame and collapses to its own heading — which always names what is picked — while KEEPING the selection, because hiding a panel to see the picture must not cost the reader the focus and the zoom they just asked for (its X is the control that clears). The layout runs in frame-sized slices with a progress readout, so the artifact stays interactive and visible at the maximum graph size and in a background tab. Every answer declares its bounds as three DISTINCT numbers — totalNodesAvailable (what the scope and filters actually match), truncation.originalNodes (what reached the projection) and nodes (what was returned) — and the HTML artifact carries the same declaration in its machine-readable payload (`declared`), so a short page can never be mistaken for a whole set in any format. `offset` walks that same order rather than re-reading the first page: the ranking carries a final `s.id` tiebreaker so page k+1 begins exactly where page k ended, and `considered.page` declares which page the answer is, of how many, and where the next one starts (null on the last) — a scope larger than one page can be walked, and an offset past the end is stated as an empty PAGE rather than as an empty project. Whatever the noise filter removes is counted onto excluded with the patterns responsible — always present, including when it is empty, so silence and zero are never confused — and an empty answer is declaredAbsent with a reason rather than an empty result that looks like a real project. `considered` declares what the answer actually READ: the relationship rows connecting the returned nodes (complete for that node set, not a slice of the relationship table), the selection order that chose the nodes, the applied filters, and the symbol-kind and language census of what was returned, plus the annotation overlay and the owner-cascade counts. `considered.overlays` carries the index's OTHER facts about the returned symbols — agent annotations from `bb_annotate`, matched by NAME AND PATH (never by name alone: two symbols can share a name, and a note is about one of them), with the notes themselves, the author class, and a count of notes that name a symbol of this scope at another path and are therefore NOT attached. The layer is declared even when it is empty, so \"no agent has annotated these symbols\" and \"nobody looked\" are different replies. Language filters are applied BEFORE the limit, so a rare language receives the same budget as a common one. The DEFAULT text format carries the same declared coverage, selection and exclusion as the JSON one, so the reply a caller gets without asking is the reply that can be audited. Member-level relationships are FOLDED onto the owner class, and every folded edge says so: when a class-like symbol is selected and a relationship is stored on one of its MEMBERS that is not itself in the node set, the row is attributed to the owner and the edge carries ownerCascade with matchedMembers naming the member it came through — so an attributed edge is never presented as one the index stored between the two drawn nodes. The fold is deliberately narrow (one level, class-like owners only, never for contains, an exact edge always preferred to an attributed one) and `considered.ownerCascade` declares whether it ran, how many members it scanned, how many rows it folded and whether a cap truncated it, so \"nothing to fold\" and \"the fold never ran\" are distinguishable. This is NOT bb_graph's depth-N traversal: the edge set is the relationships between the selected nodes, plus the folded member rows.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "project",
      "file",
      "module",
      "symbol",
      "feature"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "excludePatterns",
        "type": "array",
        "required": false,
        "description": "path SEGMENTS treated as build noise and excluded. Matched on whole segments, never as substrings — a substring rule removed `src/util/edit_distance.rs` because `dist` is inside `edit_distance`, and `src/compiler/layout.rs` because `out` is inside `layout`. Omit to use the defaults (node_modules, .git, .next, .turbo, .cache, coverage, dist, build, out, target, vendor, __pycache__)"
      },
      {
        "name": "format",
        "type": "string",
        "required": false,
        "description": "output format (default text)"
      },
      {
        "name": "includeTests",
        "type": "boolean",
        "required": false,
        "description": "include test/spec sources. Default true: they are ordinary source. When false, test/spec/testdata directories and *_test.* / *spec.* files are excluded and counted"
      },
      {
        "name": "languages",
        "type": "array",
        "required": false,
        "description": "language filter. Matched case-insensitively against the index's OWN stored spellings, and an unknown language is REJECTED with the stored set named (never answered as zero nodes). Applied BEFORE the node limit, so a rare language receives the same budget as a common one, and the applied filter is echoed in considered.languagesConsidered."
      },
      {
        "name": "layout",
        "type": "string",
        "required": false,
        "description": "the GRAPH view's arrangement, and the only option here that shapes the picture without changing the data. `regions` (default) groups every node into the DIRECTORY it lives in, anchors and names each region, and summarises the edges between regions as one dotted region link per pair at the overview. `force` ignores directories entirely: one force layout, no pods and no region links, every stored edge drawn as itself under a zoom-dependent cap the readout names. The generated page carries BOTH as a switch in its sidebar, so this sets the arrangement the page OPENS with; the layout is declared on the document itself (data-bb-layout), so the file draws what it says it is."
      },
      {
        "name": "maxLinks",
        "type": "number",
        "required": false,
        "description": "max links (default 5000, accepted range 1-20000); 0 and anything above the ceiling are REFUSED with the range named rather than clamped, because a returned page must mean the page that was asked for"
      },
      {
        "name": "maxNodes",
        "type": "number",
        "required": false,
        "description": "max nodes (default 200, accepted range 1-2000); 0 and anything above the ceiling are REFUSED with the range named rather than clamped, because a returned page must mean the page that was asked for"
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "description": "how many symbols of the ranking to SKIP before this page starts (default 0; a whole number >= 0, refused rather than normalised). The order is the scope's own ranking with a final `s.id` tiebreaker, so page k+1 begins where page k ended and no symbol is repeated or lost. `considered.page` states the page number, the page count, the total matching the scope, and the next offset (null on the last page). Without this, a scope bigger than `maxNodes` had symbols that could not be asked for at all"
      },
      {
        "name": "relationshipTypes",
        "type": "array",
        "required": false,
        "description": "relationship type filter. Matched case-insensitively against the index's OWN stored spellings, and a type the index does not contain is REJECTED with the stored set named (never answered as zero links, which would read like a project with no calls). The applied filter is echoed in considered.relationshipTypesConsidered."
      },
      {
        "name": "scope",
        "type": "string",
        "required": false,
        "description": "graph scope (default project)"
      },
      {
        "name": "symbolKinds",
        "type": "array",
        "required": false,
        "description": "symbol kinds to KEEP (class, interface, struct, enum, function, method, property, constant, variable, ...). Omitted = every kind, and on a real project gravity ranks files’ constants and properties first: the reply states the composition it returned in `considered.kindCensus`, so a graph of string constants is visible as one rather than mistaken for the architecture. Matched case-insensitively against the index’s own spellings, and a kind the index does not contain is REJECTED with the stored set named (never answered as zero nodes). The applied filter is echoed in considered.symbolKindsConsidered. The filter also scopes the symbols the owner cascade would add; removed additions are counted on considered.ownerCascade.nodesFiltered."
      },
      {
        "name": "target",
        "type": "string",
        "required": false,
        "description": "file, module, symbol, or feature target (`symbol` and `query` are accepted as aliases for `target`)"
      },
      {
        "name": "view",
        "type": "string",
        "required": false,
        "description": "The dependency map (nodes are symbols, lines are relationships, sized by stored evidence). Accepts only `graph`; any other value is REFUSED rather than answered as the graph."
      }
    ],
    "defaults": {
      "scope": "project",
      "maxNodes": 200,
      "maxLinks": 5000,
      "offset": 0,
      "format": "text"
    },
    "examples": [
      {
        "scope": "symbol",
        "target": "handleRequest",
        "format": "json"
      },
      {
        "scope": "module",
        "target": "src/api",
        "format": "html"
      }
    ],
    "returns": [
      "Nodes and links projected from the index's stored symbol and relationship rows. Every stored relationship type between a pair is kept as a separate link, each link carries the stored `rowId`, `rowIds` and `occurrences` behind it plus its stored confidence, and each node carries its `line`, `lineEnd`, `qualifiedName` and stored gravity, so every edge can be checked against the row that justifies it",
      "Three DISTINCT declared counts — `totalNodesAvailable` (what the scope and filters match), `truncation.originalNodes` (what reached the projection) and the returned `nodes` — plus the page cursor (`offset`, `nextOffset`, `considered.page`), so a short page is never mistaken for a whole set and an offset past the end is stated as an empty PAGE rather than an empty project",
      "`considered` — what the answer actually READ: the relationship rows connecting the returned nodes (complete for that node set, not a slice of the table), which selection order produced the nodes, the symbol-kind and language census of what was returned, the applied filters, the annotation overlay, and the owner-cascade fold with its caps",
      "`excluded` — what the noise filter removed, how many, and which path segment, build suffix or test rule removed it — always present, including when it is empty",
      "`declaredAbsent` with an `absenceNote` when the answer is empty, distinguishing a query that matched nothing from a page that walked past the end and from symbols that did not survive the projection",
      "A `freshness` envelope (fresh/stale/missing of the graph's files) and per-node `stale` flags, with links inheriting the worst of their endpoints; the read path never refreshes the index and says so",
      "Text, JSON, or a genuinely SELF-CONTAINED HTML artifact: one file with no network request, no webfont and no build step, carrying its own force-directed layout and canvas renderer. Both arrangements — `regions` (named directory pods and one dotted region link per region pair at the overview) and `force` (one force layout, every edge drawn as itself) — are in the page and switchable from its sidebar, and the document declares the one it opens with (`data-bb-layout`)",
      "The HTML payload carries the declared bounds and freshness under `declared`, so the artifact is auditable on its own rather than only next to a JSON call: totalNodesAvailable, originalNodes, returnedNodes, the limits, the page, the owner-cascade counts and the freshness totals",
      "In the HTML the evidence is ENCODED rather than decorated: edge opacity is stored confidence, relationship type sets colour and a structural/behavioural dash, a cross-language edge gets its own wide dash and is drawn beneath the local edges, a stale endpoint is a hollow ring, node size is the index's gravity, and any node or edge can be selected to read its stored facts",
      "The DEFAULT text format carries the same declared coverage, selection and exclusion as the JSON one, so the reply a caller gets without asking is the reply that can be audited",
      "`view` is `graph` and rides the result as `view`: the dependency map. Any other value is refused rather than answered as the graph"
    ],
    "errors": [
      "A scoped call without a non-empty `target` — refused by name for file, module, symbol and feature scopes",
      "An unknown scope, view, format, layout or option — refused with the accepted set named, never silently defaulted",
      "A filter value the index does not contain (language, relationship type, symbol kind) — refused with the stored vocabulary named, never answered as zero results",
      "`maxNodes` outside 1..2000, `maxLinks` outside 1..20000, or an `offset` that is not a whole number >= 0 — refused rather than clamped, so a returned page means the page that was asked for",
      "An absent or uninitialised index — a loud error naming the project and the index command"
    ],
    "limitations": [
      "The graph is a projection of static indexed relationships; it does not observe runtime calls",
      "THE EDGE SET IS COMPLETE for the returned nodes and declared as such: relationships are fetched by joining the selected identities, not by slicing the relationship table. Several stored rows sharing one (source, target, type) are one drawn edge: `occurrences` and `rowIds` keep the evidence, and the readout totals the rows behind the drawn edges",
      "THE NODE SET IS A SELECTION, and says so in `considered.nodeSelection`: project and feature scope rank by the index's gravity (the busiest core rather than a sample); file, module and symbol scope use source order. `offset` walks that same total order — every ORDER BY ends with `s.id` — so page k+1 starts where page k ended",
      "`symbolKinds` and `languages` scope the whole answer, including the symbols the owner cascade would add. Cascade additions are filtered by the caller's kinds and languages; removed additions are counted on `considered.ownerCascade.nodesFiltered`, and folded rows whose counterpart cannot be drawn are counted on `foldedRowsWithoutDrawableCounterpart` rather than reported as drawn edges",
      "THE OWNER FOLD IS NARROW AND BOUNDED. Only class-like owners are folded, only one level, never for `contains`, and an exact edge always beats an attributed one. The scan caps are declared on `considered.ownerCascade.capped`: at most 500 class-like owners, 3,000 member rows and 20,000 rows on members per answer, which is a bounded sample of the member evidence on a very large hub graph rather than a claim of completeness",
      "NOISE FILTER (declared, and the caller's to change). Build output and VCS metadata are excluded by default, matched on whole path SEGMENTS; `.d.ts`, `.min.js` and `.map` are excluded by build-artifact rule and declared in `excluded.suffixes`; test and spec sources are ordinary source and are INCLUDED by default. `excludePatterns` and `includeTests` change all of it, and whatever is removed is counted onto `excluded` with the rule that removed it",
      "SCOPE TARGETS ARE VALUES, not patterns: `%`, `_` and `\\` match themselves, and a directory prefix matches on a segment boundary, so `src/util` never reaches `src/utilities`",
      "LANGUAGE FILTERS ARE APPLIED BEFORE THE LIMIT. `relationshipTypes` deliberately filters EDGES rather than nodes: a caller narrowing edges must not change which nodes exist, and the applied filter is echoed in `considered.relationshipTypesConsidered`",
      "`feature` scope matches a symbol name or a docstring. The docstring half is thin in practice — 70 of 40,595 symbols carried one on the index measured here — so a feature query is usually a name match",
      "PAGE WINDOW: a page is cut from a fetch of `offset + 2 * maxNodes` symbols, so a deep `offset` reads a wider window than a first page. The returned page and its cursor are exact, but paging deep into a very large scope costs more than the first page",
      "PERFORMANCE on the reference index (6,452 files / 310,423 symbols / 820,040 relationships): the default text answer measured 372 ms p50 / 496 ms p95 warm, with a 723 ms first call in a fresh process; JSON and HTML at the same budget measured 380/392 ms and 357/373 ms p95; the largest accepted budget (`maxNodes: 2000`, JSON) measured 4.4 s p50 / 5.7 s p95 with a 15.9 MB payload. The HTML artifact for the default 200-node graph is about 0.84 MB. All of it is bounded by the output budget, not by a client timeout",
      "The HTML artifact is a single file with no network, no fonts and no build step; the view publishes its own state (`window.__bbView`) so the census, the region links and the layout can be checked rather than inferred from pixels",
      "THE DOCUMENT SAVES ITSELF: each artifact re-serialises its own live page through a Blob and an object URL and publishes that as `saveHtml`, because a reader who wants to keep the page has no other way to"
    ],
    "safety": "Read-only, and byte-read-only: the tool opens the index with the driver's read-only mode, runs no migrations or healers, writes neither the database nor its WAL, and never writes the repositories it visualises. The HTML output contains the same bounded graph as JSON and makes no network request.",
    "relations": "For one symbol's depth-bounded callers and callees with per-edge evidence tiers, use `bb_graph`; `bb_visualize` projects a whole scope — a project, file, module, symbol or feature — into one bounded graph and renders it as text, JSON or a self-contained HTML map.",
    "staleness": "Freshness applies to the tool's read output (no registered per-mode split). Staleness surfaces as: per-node and per-link stale flags (links inherit worst-of-endpoints) + freshness envelope ({ fresh, stale, missing, staleRatio, mode, remediation }) on JSON; truncation composes with staleness. This tool does NOT auto-refresh: the flags and the envelope DESCRIBE the index as it stands, nothing is reindexed to make them stale or fresh, and there is no refresh option to opt out with. Project scope → run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only). File scope → run: bb index \"<file>\" for the one file named in the answer. Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_migrate",
    "category": "analysis",
    "summary": "Batch cross-language migration plans with ordering, waves, cohort rollup, scope completeness, and unsupported mappings.",
    "description": "Read-only single or batch migration planning with dependency order, explicit effort methodology, library mappings, risks, truncation, and unsupported cases. A request is a list of entries (symbol names, indexed symbol ids, project-relative paths) unioned and capped at 100; every entry resolves to at most one component before any relationship is read, and a component named through more than one entry is planned once. Plans whose source file changed since the last index are flagged stale up front — a plan is a claim about current code; JSON output carries the freshness block.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "plan"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "targetLanguage",
        "type": "string",
        "required": true,
        "description": "e.g. rust, go, python. An unknown target is refused; a known target with no dictionary rows for the source pair is planned with the missing-data gap declared and no mapping invented. Blank is refused"
      },
      {
        "name": "format",
        "type": "string",
        "required": false,
        "description": "output format (default text)"
      },
      {
        "name": "paths",
        "type": "array",
        "required": false,
        "description": "project-relative file or DIRECTORY paths (absolute paths inside the project are accepted); every indexed symbol in them joins the request, so a whole module can be planned in one call. UNION with symbolNames, not a replacement: naming a symbol AND a path that contains it plans it once. A path that matches no indexed file is refused by name"
      },
      {
        "name": "symbolIds",
        "type": "array",
        "required": false,
        "description": "indexed symbol ids (shape `<projectId>:<relative file>:<name>:<line>`), the ONLY unambiguous way to name a component. Use this when a refusal reported that a name matches several symbols; a name is not an identity, and ids come from an earlier result's plans or an ambiguity refusal's candidates. An id no symbol carries is refused by name"
      },
      {
        "name": "symbolName",
        "type": "string",
        "required": false,
        "description": "legacy single-symbol alias for symbolNames; when both are supplied the entries are UNIONED, never silently dropped"
      },
      {
        "name": "symbolNames",
        "type": "array",
        "required": false,
        "description": "one or more component names; a name that matches several symbols in different files is refused with candidate ids to re-run against symbolIds. Blank entries are refused by name"
      }
    ],
    "defaults": {
      "format": "text"
    },
    "examples": [
      {
        "symbolName": "handleRequest",
        "targetLanguage": "go"
      },
      {
        "symbolNames": [
          "parse",
          "handle"
        ],
        "targetLanguage": "rust",
        "format": "json"
      },
      {
        "paths": [
          "src/api"
        ],
        "targetLanguage": "go"
      },
      {
        "symbolIds": [
          "<projectId>:src/api/handler.ts:handleRequest:12"
        ],
        "targetLanguage": "go"
      }
    ],
    "returns": [
      "Dependency-ordered migration plans, grouped into parallel-workable waves, one plan per component named by the request",
      "Scope completeness: how much of the cited integration surface the request actually covers",
      "Cohort rollup by source file and by wave, plus the zero-indexed `cohort.wavePlan` keyed by symbol id",
      "Effort methodology with its rates published as data, library mappings by provenance, and measured risks",
      "Explicit unsupported entries with typed reasons (missing-symbol, ambiguous-symbol with candidate ids, same-language, unsupported-source, unsupported-target)",
      "Truncation split into `deduplicated` (entries that resolved to an already-planned component) and `capped` (entries the 100-entry cap dropped, named in `cappedNames`)",
      "Freshness of every plan's source file: per-plan `stale` flags, an up-front stale-plan notice in text, and the `freshness` envelope in JSON"
    ],
    "errors": [
      "Missing targetLanguage",
      "A blank targetLanguage (refused: the tool will not resolve an empty language name)",
      "No symbolName, symbolNames, symbolIds or paths",
      "A blank entry in symbolNames, symbolIds or paths (refused by name: a blank entry would silently narrow the request)",
      "A path that matches no indexed file (the tool says so rather than returning an empty plan set)",
      "A symbol id that no indexed symbol carries (the tool names the id, because an id is the only unambiguous selector)",
      "No index for the project (the tool is read-only and refuses with the `bb index` remediation rather than creating one)",
      "Unknown option (the door names the accepted options)"
    ],
    "limitations": [
      "Plans are estimates, not translated source; the tool does not generate, replace or compile target-language code",
      "Library mappings are advisory and unsupported routes remain explicit; an unmapped third-party library is named at confidence 0 and charged 6h of research, never claimed as supported",
      "A library with an observed import but no registered target is reported with `target: null` and `confidence: 0` — declared absence, never an invented equivalence",
      "Dependency ordering and mapping depend on the analyzer-extracted symbol and relationship graph; reflection, dynamic dispatch, or relations the grammar does not model limit the completeness of the resulting plan",
      "A request names a bounded set of components, and the cited integration surface is usually much larger: measured 98.6-99.8% out of scope on the cobra corpus for requests of 1-16 symbols. The `scope` block reports this on every result",
      "The dictionary carries 486 rows across 30 source languages and 21 target languages, covering 126 of the 630 possible source-to-target pairs (20%). Two keys (`flutter/material`, `shadcn/ui` — 4 of 486 rows, 0.8%) cannot be produced by import canonicalization at all; the audit enforces that class in both directions. A further 31 rows carry knowledge an import lookup can only reach through a specifier real source code does not write (API idioms such as `pool.query`, a framework name, 16 Flutter widget or type names, and display names with spaces) — they are kept, and this is their stated limit. The dictionary is audited for this class in both directions."
    ],
    "safety": "Read-only, including the index open: plans are computed from a byte-read-only connection, no migrations run on a read, and the tool never creates an index. It does not generate, replace, or compile target-language source.",
    "relations": "For dependency structure use `bb_graph`; this tool produces migration plans with declared limitations.",
    "staleness": "Freshness modes (registered as freshnessModes): plan. Staleness surfaces as: per-plan sourceFile + stale flags with an up-front stale-plan notice + freshness envelope ({ fresh, stale, missing, staleRatio, mode, remediation }) on JSON. This tool does NOT auto-refresh and has no refresh option: the flags and the envelope DESCRIBE the index as it stands, and the repair is manual — project scope → run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only); file scope → run: bb index \"<file>\" for the file the plan belongs to. Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_analyze",
    "category": "analysis",
    "summary": "One typed analysis surface over the graph, the file graph, project counts, complexity, impact and test evidence. Every mode is bounded, declares its own bounds, and reports what it returned against what exists.",
    "description": "Unified evidence-backed analysis over graph relationships, dependencies, project statistics, complexity, impact, and test intelligence. Select exactly one mode. Every read mode carries a freshness block (fresh/stale/missing counts + remediation) resolved against the live working tree, and report rows carry a stale flag when their file changed after indexing. Every mode is BOUNDED and says so: `limit` is the most items returned (edges per direction for callers/callees/trace, files for dependencies, entries for the test modes, the same everywhere) and the answer reports what it returned against what exists, so a page is never read as the whole set. callers/callees/trace/impact share the graph engine's owner-cascade semantics — a relationship stored against a class member is attributed to the owner class — and every edge states which it was through `targetMatch`. WHICH symbol the name resolved to is declared as well: `rootMatch` is `exact`, `exact-any-kind` or `containment`, and `containment` means the answer is about a symbol whose name CONTAINS the one asked for, or differs only in case — `found: true` on its own does not mean the name was itself a symbol. Locations are project-relative. Per-mode parameters: target applies to callers, callees, trace, complexity, impact, and test_impact; filePath scopes dependencies, test_mapping, test_gaps, and test_quality to a project-relative path PREFIX and is REFUSED (not ignored) on every other mode; limit applies to callers, callees, trace, dependencies, test_mapping, test_gaps and test_quality and is refused elsewhere; stats is always project-wide.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "callers",
      "callees",
      "trace",
      "dependencies",
      "stats",
      "complexity",
      "impact",
      "test_mapping",
      "test_gaps",
      "test_impact",
      "test_quality"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "mode",
        "type": "string",
        "required": true,
        "description": "analysis mode"
      },
      {
        "name": "filePath",
        "type": "string",
        "required": false,
        "description": "Project-relative path PREFIX scoping dependencies, test_mapping, test_gaps and test_quality. Refused on every other mode. Matched on a whole segment boundary, so `src/util` does not match `src/utilities`."
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "Maximum items returned: edges per direction for callers/callees/trace, files for dependencies, entries for test_mapping/test_gaps/test_quality. Defaults: 25 edges per direction, 20 files, 50 entries. Range 1-5000 (graph modes) or 1-2000 (the rest); 0 and anything above the ceiling are REFUSED rather than clamped, because a returned page must mean the page that was asked for. The answer reports what it returned and whether that is the whole set. Refused on the modes it does not apply to."
      },
      {
        "name": "target",
        "type": "string",
        "required": false,
        "description": "A symbol name for callers/callees/trace/impact/test_impact, or a project-relative FILE PATH for complexity (an exact file, or a directory prefix at any depth INCLUDING a top-level one; anything else is refused rather than treated as a path fragment). `symbol`/`symbolName`/`query` are accepted as aliases. A target is a VALUE, never a pattern: `%`, `_` and `\\` are escaped and match themselves. Echoed back bounded at 200 characters with its full length stated — the search always uses the whole string."
      }
    ],
    "defaults": {
      "limit": "25 edges per direction (callers/callees/trace); 20 files (dependencies); 50 entries (test_mapping/test_gaps); 50 files (test_quality)",
      "target": "required for callers, callees, trace, impact, test_impact; optional file path or directory prefix for complexity",
      "filePath": "optional path prefix (or an exact file) for dependencies, test_mapping, test_gaps, test_quality"
    },
    "examples": [
      {
        "mode": "callers",
        "target": "handleRequest"
      },
      {
        "mode": "complexity",
        "target": "src/api"
      },
      {
        "mode": "test_quality"
      },
      {
        "mode": "dependencies",
        "filePath": "src/core"
      },
      {
        "mode": "impact",
        "target": "handleRequest",
        "limit": 50
      }
    ],
    "returns": [
      "Mode-specific typed analysis: graph edges, file dependency edges, project counts, complexity metrics, impact, or test evidence",
      "A declared bound on every answer — what was returned, what exists, and whether the set is the whole one",
      "Explicit unavailable states: a metric or target that cannot be computed is `available: false` / `notFoundReason`, never a substituted number"
    ],
    "errors": [
      "Missing required mode",
      "Missing or blank target for a target-based mode",
      "Option irrelevant to the selected mode (refused, never ignored)",
      "`limit` on a mode it does not apply to, or `limit: 0`",
      "A `complexity` target that names no indexed file and no directory prefix"
    ],
    "limitations": [
      "Static relationships cannot establish runtime behavior",
      "Test results describe indexed static evidence, not executed coverage; a project whose tests the indexer did not recognise is reported as having none, with the reason",
      "Callers/callees/trace/impact modes share the graph engine's owner-cascade semantics: a relationship stored against a class member is attributed to the owner class. Every edge states which it was through `targetMatch` (`exact` or `owner-cascade`); absent means the engine could not tell, which is not the same as `exact`",
      "Callers/callees/trace answer from the graph engine's DEFAULT kind set, which is EVERY kind the index stores — so a `callers` set means \"who has a stored edge INTO this\", not only who calls it. `contains` is the parent→member edge, so a class that CONTAINS a symbol is reported as that member's caller (membership, not dependency); `uses`/`references` are lexical evidence and `imports`/`exports` are module-level. Measured on this engine's own answers: lodash `baseConvert` answered 99 `calls` rows of 230 edges, cobra `getCompletions` 36 of 65, rake `standard_rake_options` 72 of 76. Every edge carries its stored `relationshipType`, so the composition is readable per answer. Mode `impact` does NOT share that set: it walks the declared dependency kinds (`calls`, `instantiates`, `extends`, `implements` — `src/lsp/impact.ts` `IMPACT_REL_TYPES`) and states the rule it applied, so a `callers` count and an `impact` count about the same symbol answer different questions",
      "A name resolves to ONE stored symbol, and WHICH one is declared in `rootMatch`: `exact` (a structural symbol of that name), `exact-any-kind` (a symbol of that name the graph cannot traverse — a constant, a type alias — which still has callers), or `containment`. `containment` is the documented near-miss fallback and means the answer is about a symbol whose name CONTAINS the one asked for. Measured on this repository's src: `target: \"us\"` answered `found: true` rooted at `analyzeCSharpBareIdentifierUses`, and `target: \"_\"` answered `found: true` rooted at `build_registry` when no symbol is named `_`. `found: true` alone does not mean the name was a symbol",
      "A CASE difference resolves by containment, because the exact step is `name = ?` (case-sensitive) and SQLite's `LIKE` is case-insensitive for ASCII. So `target: \"HUB\"` and `target: \"hub\"` are the same answer, reached by the weaker step — which is why `rootMatch` says `containment` for the first",
      "`limit` has two ends and both are declared: refused below 1 (an empty page is indistinguishable from a real answer) and refused above 5,000 for the graph modes / 2,000 for the rest. It is refused rather than clamped, because a returned page must mean the page that was asked for. Measured on this repository's src, `limit: 2147483648` was accepted before this and answered with the whole corpus",
      "`complexity` accepts a directory prefix at ANY depth, including a top-level directory. It did not: the prefix branch required a `/` in the target, so `target: \"ast\"` was refused as \"no indexed file matches\" while 84 indexed files sat under it, and the same for every top-level directory on every project",
      "`complexity` publishes both file counts: `filesMatchingScope` is how many files the scope names and `filesInScope` is how many hold a symbol the metrics are over. They differ when a file in scope has no indexed symbol (83 of 84, measured), and `linesOfCode` covers the second number — so the gap is visible instead of an unexplained discrepancy",
      "`test_mapping.summary.productionSymbols` and `test_gaps.summary.productionSymbols` are the SAME number, and each report also states `excludedAsNoise`, so `productionSymbols + excludedAsNoise` is the store's population under the mode's own filter. `test_gaps.summary.total` is a count of GAPS, not of production symbols — it is the population minus `directlyTested`, and the identity closes in public",
      "A `not-found` answer is bounded: the target is echoed at most 200 characters with its full length stated. A 4,000-character target produced a 9,409-byte answer (~2.6k tokens for two words of information) before this. The bound is on the ECHO only — the search always uses the whole string",
      "A name resolves among several stored symbols. `rootCandidates` says how many — 1 means the name was unique, more means the answer is about one of several",
      "mode `impact` refuses a target the graph cannot root at, with `notFoundReason: \"not-traversable\"` and the symbol type. Measured on a fixture: a type alias and a namespace refuse; a constant and an enum DO root (`found: true`, `rootMatch: \"exact-any-kind\"`), so the kind alone does not predict the outcome — the field does. Such a symbol IS in the index; `callers`/`callees` resolve the same name because they match any type",
      "A depth-capped walk is TRUNCATION and says so: `summary.truncated` is true with `truncationReason` naming the depth cap, beside `maxDepth` and `maxDepthReached`",
      "`test_impact` refuses `limit`, so its declared bound is the same 2,000 ms walk ceiling the command accepts no page size for: `summary` carries `returned`, `total`, `truncated`, `truncationReason`, `timeBudgetMs`, `timeBudgetExhausted` and `depthCap`. An answer with `truncated: true` names the bound that fired",
      "`test_quality`'s `limit` bounds the files ANALYSED and the files RETURNED: `summary` carries `returned`, `totalFiles` and `truncated`, so `limit: 1` answers one row and says it is one of three, not three rows with no page statement",
      "`complexity`'s `breakdown` is a page of at most the 20 highest-complexity symbols; `breakdownReturned` and `breakdownTruncated` state what was cut, beside `symbolCount` (the population)",
      "A record's `stale` flag means its file changed after indexing OR is gone from disk: `missing` is not `fresh`, and the modes that carry row flags (callers/callees/trace/dependencies/complexity/impact/test_mapping/test_gaps/test_quality) all mark it",
      "`dependencies` and the three test modes accept an EXACT project-relative file as `filePath`, not only a directory prefix; matching is on a whole segment boundary, so `src/util` does not match `src/utilities`",
      "These three modes' walks run under a wall-clock ceiling THIS TOOL declares — 2,000 ms, published on the answer as `summary.timeBudgetMs` with `summary.timeBudgetExhausted` saying whether it fired (`walk-time-budget-exhausted` among the reasons). It is not an inherited engine default: the graph engine applies no clock bound unless a caller asks for one, so the ceiling is visible here rather than implicit. It is kept because `mode=trace` on a hub is the walk that motivated a clock bound at all. A node is not a unit of work: the per-node caller query is priced by the reproducible ORDER BY, which SQLite applies before the LIMIT, so `edgeLimit` cannot bound it. Measured on this repository's own src: 2,436 matching rows for one symbol cost 85.8 ms of the 87.8 ms, and the walk was unbounded until this budget existed",
      "`dependencies` resolves an internal specifier against the importing file's own directory and LABELS each edge `resolved` / `suffix-match` / `unresolved`. It is not a guess from a basename: on this repository's own src only 74 of 906 `imports` relationships carry both endpoints and `brain_import.resolved_symbol_id` is empty, so specifier resolution is the primary path, not a fallback",
      "A file's `dependents` and `dependencies` lists are capped per row; `dependentsTotal` / `dependenciesTotal` are the real sizes and the Truncated flags say the list was cut",
      "Neither list carries `fileId` — a file id is `<40-hex project id>:<relative path>`, so it repeated the path printed beside it (56,540 of 121,340 bytes on a default page of this repository's src). The path is the locator, `resolution` says how it was reached, and the row above carries the id for the file the row is about",
      "`metrics.couplingEdges` counts only the relationship types listed in `couplingRelationshipTypes`; `exports` and `contains` are index bookkeeping. `stats.relationships` is every row and is a different number",
      "`metrics.maintainability` is unavailable when the formula's domain does not cover the scope (it is negative above roughly 3·10⁴ non-blank lines) rather than clamped to 0",
      "Locations are project-relative. `nodes[].filePath` (absolute) is not emitted, so the same question returns the same bytes on any machine",
      "A mapping entry carries at most 20 links (`linksTruncated` says when more exist); the ranking and every summary count use the complete set",
      "`provenance` on a `dependencies` page is on the REPORT, not repeated per row"
    ],
    "safety": "Read-only. Analysis never creates tests or edits source.",
    "relations": "For the plain per-symbol call graph use `bb_graph` (same engine, evidence tiers). For bounded impact-with-files use mode `impact` (numbers identical to `bb_impact`).",
    "staleness": "Freshness modes (registered as freshnessModes): callers, callees, trace, dependencies, stats, complexity, impact, test_mapping, test_gaps, test_impact, test_quality. Staleness surfaces as: freshness block ({ fresh, stale, missing, staleRatio, mode, remediation }); graph nodes and report rows carry stale flags (project-wide modes sample or resolve visible rows only — the block names its coverage mode). When something is stale/missing, the remediation names the registered reindex interfaces: project scope → reads auto-refresh stale files within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only); file scope → reads auto-refresh this file within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index \"<file>\" (or the bb_index tool with that file path). Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_doc",
    "category": "analysis",
    "summary": "Cited Markdown or JSON documentation over indexed source and relationships, with declared bounds, emitted-citation freshness counts, and a payload-measured output budget.",
    "description": "Generate read-only, evidence-backed documentation with resolvable citations and a freshness block over the cited files. Every mode emits its declared section set, an empty result is never reported as passing, and the output budget is enforced on the payload the caller receives: `quality.budget.estimatedTokens` is measured on the decorated answer, and `estimatedTokens * 4` is never smaller than what was sent. When the required sections cannot fit, the result says so rather than dropping one. `quality.references` counts the citations the answer EMITS (plus the `collected*` totals of everything gathered), so the stale/missing numbers match the Sources list. Supports symbol, file, module, feature, API, project, and documentation-coverage modes in Markdown or JSON. When the cited files are stale, the handler auto-refreshes exactly those files within the shared budget and regenerates the document; refresh=false opts out and answers from existing data with the freshness block. A module target that matches no indexed file is refused by name rather than answered with project-wide facts, and `limit`/`maxTokens` outside their ranges are refused rather than clamped.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "symbol",
      "file",
      "module",
      "feature",
      "api",
      "project",
      "coverage"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "mode",
        "type": "string",
        "required": true,
        "description": "documentation mode"
      },
      {
        "name": "audience",
        "type": "string",
        "required": false,
        "description": "documentation audience: selects OPTIONAL sections only; a required section is never dropped for a smaller audience"
      },
      {
        "name": "detail",
        "type": "string",
        "required": false,
        "description": "detail level: `brief` caps each section at 5 facts and drops optional sections, `standard` caps at `limit`, `deep` caps at 3x`limit` and adds the optional all-edges section; for `feature` it also enables semantic candidate expansion, which is much slower"
      },
      {
        "name": "format",
        "type": "string",
        "required": false,
        "description": "output format (default markdown)"
      },
      {
        "name": "includeDiagrams",
        "type": "boolean",
        "required": false,
        "description": "include cited diagrams when available. This implementation does not emit diagrams; `reference.diagrams` stays empty and an honest not-observed unknown is recorded"
      },
      {
        "name": "includeExamples",
        "type": "boolean",
        "required": false,
        "description": "include source-backed examples. No example is emitted when no cited snippet or verified contract supplies one; an honest not-observed unknown is recorded instead"
      },
      {
        "name": "includeTests",
        "type": "boolean",
        "required": false,
        "description": "include indexed test evidence. Accepted for `symbol` and `feature` modes only (their documents render a test section); the other modes REFUSE it because it would do nothing. Absent means the mode default (on); explicit false suppresses the test facts"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "maximum evidence items per section (whole number 1-100, default 20). Out-of-range values are REFUSED, not clamped, so the page returned is the page requested"
      },
      {
        "name": "maxTokens",
        "type": "number",
        "required": false,
        "description": "output token budget measured on the emitted payload (whole number 1-16000, default 8000; the default clears the measured minimum honest rendering on the reference index, ~6,700 tokens). `estimatedTokens` reports that measurement; when the required sections cannot fit, `budget.passed` is false and a shortfall unknown names the smallest honest rendering. Out-of-range values are REFUSED"
      },
      {
        "name": "refresh",
        "type": "boolean",
        "required": false,
        "description": "false opts out of the inline auto-refresh of the files this document cites (default: auto-refresh those files within the shared budget, then regenerate); the decision is always declared in `autoRefresh` or the answer text"
      },
      {
        "name": "target",
        "type": "string",
        "required": false,
        "description": "symbol, file, module, feature, or API target (`symbol`/`symbolName`/`query` are accepted as aliases); optional for project and coverage. `symbol` matches an indexed name, qualified name or its last dotted/`::` segment. `file` accepts an exact repository-relative path, an absolute path, a directory prefix, or a bare file name with or without its extension. `module` needs a repository-relative directory the index holds; a target that matches nothing is REFUSED with the forms tried. `project` accepts a target but uses it as document metadata only — it does not scope the selection."
      }
    ],
    "defaults": {
      "format": "markdown",
      "audience": "developer",
      "detail": "standard",
      "includeExamples": false,
      "includeDiagrams": false,
      "includeTests": false,
      "limit": 20,
      "maxTokens": 8000
    },
    "examples": [
      {
        "mode": "symbol",
        "target": "handleRequest"
      },
      {
        "mode": "feature",
        "target": "request handling",
        "format": "json",
        "detail": "deep"
      },
      {
        "mode": "coverage",
        "target": "src",
        "audience": "maintainer"
      }
    ],
    "returns": [
      "Markdown or structured JSON documentation: title, summary, the mode's declared sections, citation objects with stable IDs and per-citation freshness, and declared unknowns",
      "`quality`: the four-term verdict, emitted-citation reference counts (`broken`/`stale`/`missing` plus the `collectedStale`/`collectedMissing` totals of everything gathered), completeness against the declared section set, the index snapshot, and the payload-measured budget",
      "`quality.bounds`: per-section numbers — `available`, `capped`, `droppedForBudget`, `emitted` — with `emitted + droppedForBudget === capped` enforced before the result is returned",
      "A declared selection bound when a scope has more indexed symbols than the evidence limit selected, naming both numbers",
      "`reference`: stable website keys (`projectId`, `snapshotId`, `generatedAt`, `indexVersion`, `schemaVersion`, `sourceLanguage`, `canonicalPath`, `slugs`, `tags`) and an empty `diagrams` array",
      "An `autoRefresh` line whenever stale cited files were repaired or a repair was declined, with the reason"
    ],
    "errors": [
      "Missing mode, or a mode outside symbol|file|module|feature|api|project|coverage",
      "Missing target for `symbol`, `file`, `module` or `feature`",
      "`limit` outside 1-100, or `maxTokens` outside 1-16000 — refused with the accepted range rather than clamped",
      "`includeTests` on a mode that renders no test evidence (everything except `symbol` and `feature`)",
      "A `module` target that matches no indexed file — refused by name, with the two directory forms it tried",
      "An invalid `format`, `audience` or `detail` value (rejected by the registry validator with the accepted enum)",
      "Unavailable indexed evidence"
    ],
    "limitations": [
      "Unknown facts are explicit, and a required section that renders empty says why in its own words; a document with no cited claim never reports `passed`",
      "Stale evidence is qualified per citation and counted as `freshness.passed: false`; it cannot silently become current",
      "`includeTests` is a real option only where a test section is rendered: `symbol` and `feature`. The other modes refuse it instead of accepting a no-op",
      "`project` mode accepts a target but uses it as document metadata; it does not scope the selection",
      "`feature` mode's semantic candidate expansion is opt-in via `detail: \"deep\"`; every other call is lexically discovered and says so, because semantic expansion measured 19-52 s on a 310k-symbol index",
      "A scope with more indexed symbols than `2 x limit` reports the selection bound (`selected` of `available`) rather than implying it mapped the whole set",
      "When the required sections cannot fit `maxTokens`, the result is returned with `budget.passed: false` and the smallest honest rendering named; it is never met by dropping a required section"
    ],
    "safety": "Read-only with one bounded, declared exception: when the files a document cites are stale, the handler reindexes exactly those cited files (at most 25 files / 2 MiB per call) and regenerates. `refresh:false` or `BB_NO_AUTO_REFRESH=1` opts out and the answer declares the decline. It never writes source, never creates a file, never calls bb_edit, and never touches a file the document does not cite.",
    "relations": "For raw symbol metadata use `bb_search` mode `symbol`; this tool composes documented, cited explanations. For cross-language reference facts on one symbol use `bb_cross_language`; for graph traversal use `bb_graph`.",
    "staleness": "Freshness applies to the tool's read output (no registered per-mode split). Staleness surfaces as: freshness envelope ({ fresh, stale, missing, staleRatio, mode, remediation }) on JSON + footer naming the remediation; per-citation (stale) in Sources; silent when all fresh. When something is stale/missing, the remediation names the registered reindex interfaces: project scope → reads auto-refresh stale files within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only); file scope → reads auto-refresh this file within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index \"<file>\" (or the bb_index tool with that file path). Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_edit",
    "category": "operations",
    "summary": "Unified safe source editing with preview, validation, rollback, and reindex.",
    "description": "Unified, validated source mutation. Discriminated by mode: write, update, insert, delete, or refactor. Supports dry-run previews, separator/symlink-safe paths, AST byte bounds, caller protection, rollback on validation failure, formatting, and reindexing. If the target file changed since it was indexed, this tool refreshes that one file and re-resolves the symbol before editing (reported in warnings) — an edit is never applied to stale byte bounds, and a symbol that was renamed or removed is refused by name. The bytes each target had when the edit was PLANNED are re-checked immediately before the write, so a file that changed in between (an editor saving during a multi-file refactor, say) is refused with nothing written rather than overwritten from a plan computed against its previous contents. A project with no index is not a dead end: `write` plans from the request and the disk, resolves no symbol, and reindexes the file it wrote (so `reindexed` is how a brand-new project gets its first indexed rows), while `update`, `insert`, `delete` and `refactor` resolve their target through the index and are refused — with the mode that still works named beside the reindex command — until one exists. `write` replacing an existing file is guarded: a replacement that removes at least half of a file's lines (and at least 5 lines) is refused as a probable mistake unless `overwrite: true` is passed, and `overwrite: false` makes the write create-only — the refusal names the file, the line counts and both options. `batch` applies several edits, or one edit across several files, as ONE atomic call: every entry is planned before anything is written (so a refusal anywhere writes nothing), the bytes of EVERY target are re-checked together immediately before the first write, and formatting, validation and reindexing each run ONCE for the whole call. Two entries may not resolve to the same file — each is planned from its file's pre-edit bytes, so the second would discard the first, and that is refused by entry index. Every answer carries a per-file `envelope` (`planned`, `committed`, `restored`, and the pre/post byte counts), and a refused call carries the same envelope on the error, so \"is my working tree back?\" is answered per file rather than by one boolean. Unlike `write`, `batch` needs an index: the mode cannot promise of a list what a single entry's plan proves.",
    "mutability": "write",
    "requiresIndex": true,
    "modes": [
      "write",
      "update",
      "insert",
      "delete",
      "refactor",
      "batch"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "mode",
        "type": "string",
        "required": true,
        "description": "Edit kind: write (create or overwrite a file), update (replace a symbol body), insert (add code relative to a symbol), delete (remove a symbol), refactor (identifier-aware rename), or batch (apply several edits, or one edit across several files, as one atomic call)"
      },
      {
        "name": "content",
        "type": "string",
        "required": false,
        "description": "Full file content for write mode; also accepted in place of newContent for update and insert"
      },
      {
        "name": "dryRun",
        "type": "boolean",
        "required": false,
        "description": "Preview the planned changes without writing any file (default false)"
      },
      {
        "name": "edits",
        "type": "array",
        "required": false,
        "description": "batch only, required there: the edits to apply, each a complete request in one of the five single-file modes (write|update|insert|delete|refactor), e.g. [{mode:'update',symbolName:'helper',newContent:'...'},{mode:'delete',symbolName:'oldFlag'}]. Entries may not set dryRun or format (those belong to the batch, which previews, formats and reindexes once), may not nest a batch, and may not two of them resolve to the same file — each entry is planned from its file's pre-edit bytes, so a second entry on one file would discard the first (refused by entry index)."
      },
      {
        "name": "filePath",
        "type": "string",
        "required": false,
        "description": "write: project-relative target file to create or overwrite. Other modes: disambiguates symbolName when it appears in multiple files"
      },
      {
        "name": "files",
        "type": "array",
        "required": false,
        "description": "batch only: the fan-out form — each entry applies once per listed project-relative path, and `files` supplies the filePath of every entry (so an entry with `files` must not name its own). Omit it to let each entry name its own target. The list may not repeat a path."
      },
      {
        "name": "force",
        "type": "boolean",
        "required": false,
        "description": "delete: allow removal when indexed callers or live references survive; leftovers are reported as warnings (default false)"
      },
      {
        "name": "format",
        "type": "boolean",
        "required": false,
        "description": "Run the project formatter on written files after the edit (default true)"
      },
      {
        "name": "lineStart",
        "type": "number",
        "required": false,
        "description": "Declaration line of the target symbol, used with symbolName/filePath to disambiguate repeated names"
      },
      {
        "name": "newContent",
        "type": "string",
        "required": false,
        "description": "Replacement source: update swaps the symbol body for this text; insert adds this text relative to targetSymbolName"
      },
      {
        "name": "newName",
        "type": "string",
        "required": false,
        "description": "refactor: the valid identifier the symbol is renamed to"
      },
      {
        "name": "overwrite",
        "type": "boolean",
        "required": false,
        "description": "write only. Omitted: replace the file, but refuse a replacement that removes at least half of a file's lines and at least 5 lines (a probable mistake, such as a body fragment sent to write instead of update). true: replace it whatever the size. false: create-only — refuse when the file already exists."
      },
      {
        "name": "position",
        "type": "string",
        "required": false,
        "description": "insert anchor relative to targetSymbolName (default after)"
      },
      {
        "name": "symbolName",
        "type": "string",
        "required": false,
        "description": "Name of the symbol to update, delete, or refactor (the index must contain it; a target file changed since indexing is refreshed automatically before the edit)"
      },
      {
        "name": "targetSymbolName",
        "type": "string",
        "required": false,
        "description": "insert: symbol whose body or boundary receives the new code (required for insert)"
      }
    ],
    "defaults": {
      "dryRun": false,
      "format": true,
      "force": false
    },
    "examples": [
      {
        "mode": "update",
        "symbolName": "helper",
        "newContent": "export function helper() { return 2 }"
      },
      {
        "mode": "insert",
        "targetSymbolName": "main",
        "position": "inside-top",
        "newContent": "const started = true"
      },
      {
        "mode": "write",
        "filePath": "src/new.ts",
        "content": "export const value = 1"
      }
    ],
    "returns": [
      "Structured mutation result or dry-run preview",
      "Validation, rollback, and reindex status, plus the measured per-file formatter outcome (`formatting`)",
      "Affected paths and caller protection outcomes",
      "`envelope` — the per-file outcome of the call (`planned`, `committed`, `restored`, the pre/post byte counts, and any restore that FAILED with its reason), on the answer and on a refusal alike, so `batch`'s per-file question is answered per file",
      "`batch` (batch only) — one row per `edits` entry with the mode it ran and the files it reached",
      "`importPruning` (delete only) — `attempted`, `language`, the `removedBindings` it removed, and for a language other than TypeScript/JavaScript the `reason` it left the file's imports unchanged",
      "a refusal carries the per-file `envelope` too — the EMPTY one (`entries: []`, nothing committed, nothing restored) with `refusedBeforeWriting: true` when the call refused while planning"
    ],
    "errors": [
      "Path escape or symlink escape, and a target inside a protected path (`.git/`, `.hg/`, `.svn/`, `node_modules/`, or the index data directory — refused by name before anything is written)",
      "Ambiguous symbol name (the message names filePath/lineStart)",
      "`refactor` onto a name the file already declares, or onto the symbol's current name — both refused at plan time, nothing written",
      "Symbol renamed or removed since the target file was indexed (refreshed first, then refused by name)",
      "`update`, `insert`, `delete` or `refactor` on a project with NO index — the refusal names the reindex command and says that `write` still works, because the symbol modes resolve their target through the index and `write` resolves none",
      "Caller protection, parse, or reindex failure — a FORMATTER failure is not an error: the edit stands and the outcome is reported per file in `formatting` with `formatted: false`",
      "`batch`: an empty or missing `edits`, an entry with no mode or with an option its own mode does not accept (the refusal names the entry index), a per-entry `dryRun`/`format` (they belong to the call), an entry that names its own `filePath` while `files` supplies the targets, a repeated path in `files`, two entries that resolve to ONE file, or more than 200 planned edits — each refused with the run's own reason and nothing written"
    ],
    "limitations": [
      "Named symbol edits need an INDEX, not a fresh one: when the target file changed after it was indexed, the tool refreshes that ONE file's rows and re-resolves the symbol before planning, so bounds always come from the bytes on disk and never from a stale span. The refresh is reported in `warnings`; if the symbol was renamed or removed in the meantime the edit is refused by name instead of guessing a span",
      "Directly after a write, the file's own evidence is current but cross-file relationships are only re-derived within the bounded post-pass, so a caller in an unrelated file may lag until the next dir index (same bound as bb_index)",
      "Refactoring is identifier-aware static rewriting, not a full language-server proof",
      "Per-mode arguments are enforced in BOTH directions and the accepted set is named, so a rejection can be acted on: `bb_edit update mode does not accept: position (position is accepted for insert) — accepted for update: mode, dryRun, filePath, symbolName, lineStart, content, newContent, format`. An option this mode cannot honor is REFUSED, never silently ignored, and an option that belongs to exactly one other mode says which one. The mode contract: `write` → `mode`, `dryRun`, `filePath`, `content`, `newContent`, `format`, `overwrite`; `update` → `mode`, `dryRun`, `filePath`, `symbolName`, `lineStart`, `content`, `newContent`, `format`; `insert` → `mode`, `dryRun`, `filePath`, `targetSymbolName`, `position`, `lineStart`, `content`, `newContent`, `format`; `delete` → `mode`, `dryRun`, `filePath`, `symbolName`, `lineStart`, `force`, `format`; `refactor` → `mode`, `dryRun`, `filePath`, `symbolName`, `lineStart`, `newName`, `format`; `batch` → `mode`, `dryRun`, `edits`, `files`, `format`.",
      "Body-fragment updates (`newContent` that is a statement, not a declaration) require a BRACE-bodied language. TypeScript, JavaScript, Go, Rust, Java, C/C++, Swift, Kotlin, Scala and PHP all take this path. In an indentation- or keyword-delimited language — Python, Ruby, YAML — there is no `{ ... }` range to splice and the tool REFUSES rather than guessing; the refusal names the remedy and passing the full declaration then works. Elixir's `do ... end` is likewise refused. Measured across Python (2-space, 4-space and tab indentation), Ruby at two nesting depths, Go, Rust, Java and Elixir.",
      "`reindexed` is measured from the reindex result, not from the intent: an edit whose reindex reports per-file failures keeps its validated bytes on disk, answers `reindexed: false` and names the files in a `reindex:` warning. The index is then stale for those files; the NEXT symbol edit on them either refreshes that one file inline (when inline refresh is enabled) or refuses with the stale-file remedy (`bb_index` for that file), which is the tool declining to write to bytes it cannot vouch for, not a lost edit.",
      "`delete` refuses when the symbol has indexed callers OR when an import or re-export specifier in another file names it, which covers `import { x as alias }` — the analyzer records no call edge there because it never resolved the alias. The specifier is matched by RESOLVING the module path, not by name, so `../models/user` and `./user` are both caught and a same-named module in a different directory is not. It does NOT refuse for a side-effect-only `import './x'`, a namespace import, or a file with a local that merely shares the name, because none of those can dangle. A forced delete always warns and names every surviving specifier and its file.",
      "KNOWN GAP in `delete`: a tsconfig path alias (`@/models/user`, `~/models/user`) is not caught. The indexer records no import row for a non-relative specifier, so there is nothing to resolve; such a project's only remaining signal is the indexed `calls` edge. A bare package specifier (`react`, `lodash/fp`) is likewise unresolved, correctly, since it cannot be shown to refer to a project file.",
      "Formatting is best-effort and MEASURED, never assumed: an extension with no mapping (`.rb`, `.swift`, `.kt`, `.yaml`, …), a formatter that is not installed, a non-zero exit, and the 1.5s timeout all report `formatted: false` with the per-file reason in `formatting`. The tool never installs a formatter and does not read a project's own formatter configuration — it invokes the standard binary for the extension (prettier/rustfmt/gofmt/clang-format/black-or-ruff) that it can resolve from `node_modules/.bin` or `PATH`.",
      "`write` replacing an existing file is GUARDED rather than free: with `overwrite` omitted, a replacement that removes at least half of the file's lines and at least 5 lines is refused as a probable mistake (a body fragment sent to `write` instead of `update`, or the wrong `filePath`), and the refusal states both line counts, the share that would be lost, and both ways forward. `overwrite: true` replaces it whatever the size; `overwrite: false` is create-only. A 41-line file replaced by one line is therefore refused rather than reported `ok` with nothing distinguishing it from an intentional rewrite",
      "The pre-image check covers staleness on the WRITE side too, and it is not about the index: every target's sha256 is taken as the plan reads it and compared with the bytes the commit is about to replace, immediately before the first write of the batch. A file that changed in that window — an editor saving during a multi-file refactor — is refused with NOTHING written and both hashes named, rather than overwritten from a plan computed against its previous contents. A path the plan intended to create must still not exist; a file that appeared there is refused the same way.",
      "Import cleanup after `delete` is TypeScript/JavaScript-only and AST-driven: the tree names the import statements and identifier occurrences decide usage, so dead bindings are removed and still-used (including aliased and namespace) bindings are kept. In every other language the file is left byte-for-byte unchanged and the answer DECLARES it (`importPruning.attempted: false` with the language and the reason) plus a warning — a leftover import never breaks a build, while an import removed on a pattern can",
      "Writes are refused inside `.git/`, `.hg/`, `.svn/`, `node_modules/`, and the index data directory, by resolved path and by name. That is a safety list beside the security boundary (containment in the project), so a typo'd `filePath` cannot rewrite version-control state or the database the tool's answers come from",
      "A formatter may rewrite a file's line endings with its own: `gofmt -w` turns a CRLF file into LF. The engine restores the file's own ending after formatting and declares the repair on that file's `formatting` entry (`lineEndingRestored: true`), so an edit never silently migrates a file to another line-ending convention",
      "A commit is SECONDS, not milliseconds: it formats, validates and reindexes synchronously before answering. Measured warm p50/p95 on lane fixtures: update commit 1801.5/2062.9 ms on a 5-file fixture and 4500.7/7052.3 ms on a 100-file fixture; a dry run of the same edit is 11.5-71 ms p50. The MCP client's 30 s timeout is the only ceiling, and a timed-out write call is the case where `envelope` (or a re-run, which re-plans against the current bytes) is how a caller recovers committed-versus-restored"
    ],
    "safety": "Write-capable. Uses project-root path checks, atomic writes, snapshots, validation, and rollback; use dryRun before risky edits. dryRun writes no source file, but a stale target file is still refreshed in the INDEX first (derived data only), because the bounds it previews must be the bounds the real edit would use. `write` on an existing file is guarded against the catastrophic case — a replacement that removes at least half of a file's lines and at least 5 lines needs `overwrite: true`, and `overwrite: false` makes the write create-only — and every committed batch re-checks that the bytes it is replacing are the bytes the plan read, refusing with nothing written when they moved. The guard's refusal is raised at PLAN time, so a dry run reports exactly what the real call would. `batch` plans every entry before the first write, so a refusal anywhere is a refusal of the whole call; the pre-image check then reads every target of the call at once — a target that moved refuses all of it, including entries whose own plan was fine; and a failure AFTER the writes restores each committed file and reports what happened in `envelope` rather than in one boolean. Two entries that resolve to one file are refused rather than composed, because both are planned from that file's pre-edit bytes.",
    "relations": "To attach human-visible notes to symbols use `bb_annotate`; this tool mutates source files.",
    "staleness": "No freshness flags are returned — this tool does not summarize OTHER files' staleness, and it does not read stale data: a stale TARGET file is refreshed (that file only) and the symbol re-resolved from the bytes on disk before the edit is planned, and the refresh is named in warnings. If that change renamed or removed the symbol, the edit is refused by name rather than applied to a stale span. For unrelated files, remediation stays manual: project scope → run bb index --changed (or the bb_index tool with the project path — incremental, changed files only).",
  },
  {
    "name": "bb_index",
    "category": "operations",
    "summary": "Immediately refresh the index for a just-written/edited file or directory; mode=post re-derives relationships/taints/health without re-parsing.",
    "description": "Reindex a file or directory so the index reflects edits immediately (agent-fresh). Accepts a path (file or dir); a file reindexes only that file, a dir runs an incremental index of that dir (changed files only). mode=post re-runs the heavy derived-data phases (relationships/enrichment/gravity/taints/health) WITHOUT re-parsing — the remediation after edits on incremental paths. Every mode requires `path`, and it MUST resolve inside this project: an absolute path elsewhere, a `../` traversal, a foreign directory and a symlink inside the project pointing out of it are all REFUSED, because an out-of-tree file would be stored with a `relative_path` that is not relative to anything and every scoped query, file name and freshness check for it would then be wrong. For mode=post the path must additionally NOT be a file: the phases are project-wide, so pass the project root (or a directory inside it). The report says what happened rather than only how much: `outcome` is `indexed`, `partial` or `no-op`; a no-op carries a `reason` that distinguishes \"nothing changed: the file already matches the index (mtime, size and sha256 agree)\" from \"this file holds nothing the indexer extracts\", and `unchanged`/`declined`/`skipped` say how many files fell into each case. When errors occurred, `errorDetail` names the file and the message beside the `errors` count, and `walCheckpointed` says whether the write WAL was reclaimed after the run. Paths in the report are PROJECT-RELATIVE, so the same request returns the same bytes on any machine. The counts are stable between identical calls; the `ms` fields are measured wall-clock and are expected to vary.",
    "mutability": "write",
    "requiresIndex": false,
    "modes": [
      "auto",
      "file",
      "dir",
      "post"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "path",
        "type": "string",
        "required": true,
        "description": "Project-relative file (reindex only that file) or directory (incremental index of changed files); for mode=post, the project root or a directory inside it whose derived phases should be re-run (a file path is refused). REQUIRED in every mode and checked rather than ignored. Must resolve INSIDE the project: both sides are resolved through realpath, so a symlink inside the project pointing out of it is refused too."
      },
      {
        "name": "mode",
        "type": "string",
        "required": false,
        "description": "auto (default) infers file vs dir from path; file reindexes one file (unchanged files answer no-op instead of being re-parsed); dir runs an incremental directory index; post re-runs derived phases (relationships/taints/health) without re-parsing"
      }
    ],
    "defaults": {
      "mode": "auto"
    },
    "examples": [
      {
        "path": "src/new-file.ts"
      },
      {
        "path": "src",
        "mode": "dir"
      },
      {
        "path": ".",
        "mode": "post"
      }
    ],
    "returns": [
      "`indexed`, `deleted`, `errors`, `unchanged`, `declined` and `skipped` counts for the refreshed path",
      "The mode actually applied (`auto` resolves to `file` or `dir`; `file`/`dir`/`post` are reported as named)",
      "`outcome` — `indexed`, `partial`, or `no-op`. A no-op also carries `reason`, and the two reasons are different facts: \"nothing changed\" (mtime, size and sha256 all still match the stored row) versus \"this file holds nothing the indexer extracts\" (an extension the indexer does not parse)",
      "`errorDetail`: the file and the message for each failure, beside the `errors` count",
      "`walCheckpointed`: whether the write-ahead log was reclaimed after the run (a refused checkpoint — another reader holding a snapshot — reports false, never success)",
      "For mode=dir, `candidates` (files the walk found changed) beside `processed`, so a partial dir index is visible as a count, and `unchanged: true` when the tree is settled",
      "For mode=post, the per-phase report (relationships, enrichment, gravity, taint, health, integrity, planner stats, vector blobs, analysis) with each phase's timing and outcome, `totalMs`, and the post-run `integrityHealth` score"
    ],
    "errors": [
      "Missing or blank path",
      "A path that resolves OUTSIDE the project — an absolute path elsewhere, a `../` traversal, a foreign directory, or a symlink inside the project pointing out of it — for file, dir, auto AND post mode",
      "mode=post with a path that does not exist, or with a FILE path: the post pass re-derives project-wide phases, so it takes the project root (or a directory inside it)",
      "mode=file on a directory, or mode=dir on a file",
      "Unknown mode, or an option this tool does not accept (the refusal names the accepted set)",
      "Another LIVE indexer holding the project lock; the refusal names the holder's pid, host and start time, and the remedy. A lock whose holder is dead, a lock naming no process once it is older than the grace window, and a foreign-host lock past its 24h expiry are reclaimed automatically"
    ],
    "limitations": [
      "A file reindex updates only that file's evidence; cross-file relationships are repaired within the bounded post-pass for the touched files (see `derived.pass`), while callers in unrelated files can lag until the next dir or full index",
      "Dir mode reuses the incremental indexer: unchanged files are skipped by design, a settled tree answers `unchanged: true`, and a file the walk's skip rules exclude is left untouched in the index rather than being treated as deleted — an index row is deleted only when the file is genuinely gone from disk",
      "File mode's `no-op` is a real no-op: an unchanged file is detected by mtime+size and confirmed by comparing the stored sha256 with the bytes on disk, so a repeated call does not re-parse (and does not pay a parse's latency)",
      "The COUNTS in a report are stable between identical calls; the `ms` fields are measured wall-clock and DO vary, so a diff of two reports will show timing drift",
      "Dir mode walks with the indexer's own skip rules; a directory that the indexer excludes from DISCOVERY (build output, dependency trees) is not revisited by an incremental dir walk. The walk's skip list matches discovery's for the names that matter here — `vendor` is indexed, because it is first-party source in Go and in repositories that curate code under src/vendor",
      "A reindex does not run the full derived pipeline: `derived.pass` is `bounded` for incremental runs, and mode=post is the explicit remedy when derived data looks stale"
    ],
    "safety": "Write-capable against INDEX data only — it never modifies source files, and it never deletes an index row for a file that still exists on disk. It will only index paths inside this project: both sides are resolved through realpath, so a symlink inside the project pointing out of it is refused and a symlink to a file inside it is allowed. Concurrent index runs are refused by the project index lock rather than interleaved.",
    "relations": "The CLI twin is `bb index`. The MCP path is incremental only: `auto`/`file`/`dir` refresh changed files, `post` re-derives the heavy phases; a full rebuild is the CLI's `bb index --force`. Refresh changed files after agent edits with mode `dir`/`file` or the CLI `--changed`.",
    "staleness": "This tool does not report per-file index staleness and does not auto-refresh. Output reflects the index as of the last index run; when files changed after indexing, refresh first: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only).",
  },
  {
    "name": "bb_graph",
    "category": "graph",
    "summary": "Per-symbol graph with per-edge evidence tiers — the agent view of the editor's graph panel.",
    "description": "Per-symbol dependency graph over the canonical graph engine: callers, callees, per-edge evidence tier (structural/import_based/usage_contextual/reference_qualified/inferred), the stored evidence class and resolution basis behind each tier, confidence, and cross-language edge count. Same engine and tier rules the editor graph panel uses; truncated traversals are declared with a reason, never silent. Traversal semantics: a relationship stored against any member of a class (a method call, an inherited behavior) is attributed to the owner class, so caller/callee sets include the owner-family level — every edge still traces to a stored relationship row and states whether it matched the symbol itself or one of its members. Each edge's `rowId` is the stored relationship key with its leading '<projectHash>:rel:' removed, and each endpoint's `id` is the stored symbol key with its leading '<projectHash>:' removed — both prefixes are constant within one answer, and `root.id` carries the FULL stored form, so '<projectHash>' is the segment before its first ':' and prepending it (plus ':rel:' for a rowId) reconstructs the store key exactly. An `ext:` id has no such prefix and is returned whole. The graph is READ from a read-only index handle: asking a question cannot mutate the index. Measured on this repository's reference index (11,440 files, 310,423 symbols, 820,040 stored relationships), a default call answers in 22-355 ms p95 depending on the symbol's degree, where the same call took 131 s before the engine's cascade and arm queries were rewritten to seek their indexes.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "graph"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "symbol",
        "type": "string",
        "required": true,
        "description": "symbol name to root the graph at (`target`/`symbolName`/`query` are accepted as aliases). Required; a blank name is refused as missing. An unknown name is refused after the resolver's declared containment fallback runs: that fallback is a substring scan, and on the 11,440-file reference index it costs about 5 s before answering not-found. It is a documented step of the resolver, not a silent budget breach; an exact-name miss does not run it."
      },
      {
        "name": "direction",
        "type": "string",
        "required": false,
        "description": "which side to traverse (default both). 'callers' answers \"who depends on this\" and skips the callee walk entirely — on a real index that is the difference between 1 edge and 37 in the same payload."
      },
      {
        "name": "edgeLimit",
        "type": "number",
        "required": false,
        "description": "Per-symbol call-site limit for one edge query (default 200, max 5000; whole numbers only). Reaching it is declared in `summary.truncated` with `summary.truncationReason` and the root's true count in `summary.callersIfUncapped`/`summary.calleesIfUncapped` — the limit is never a silent cap. Raise it to receive more sites in one answer."
      },
      {
        "name": "includeCrossLanguage",
        "type": "boolean",
        "required": false,
        "description": "include edges the indexer marked cross-language (default true). Set false for a single-language view; the rows removed BY REQUEST are counted in `summary.crossLanguageExcluded` per direction, so an empty set beside a non-zero count is a request, not an empty store."
      },
      {
        "name": "maxDepth",
        "type": "number",
        "required": false,
        "description": "traversal depth bound (default 5, max 10). Must be a whole number: a fractional depth is refused rather than floored."
      },
      {
        "name": "maxEdges",
        "type": "number",
        "required": false,
        "description": "hard cap on the number of edges in the WHOLE answer, across both directions and all depths (default 1000, max 5000; whole numbers only). `edgeLimit` bounds one query and this bounds the answer; their product is what a caller receives. Reaching it is declared as `total-edge-limit` with the value in `summary.maxEdges`. Raise it for a hub symbol, lower it for a quick shape check — a value below `edgeLimit` IS honored (the answer stops at it and says so), so `maxEdges` is the knob for \"just show me the shape\""
      },
      {
        "name": "relationshipTypes",
        "type": "array",
        "required": false,
        "description": "stored relationship kinds to include. Default: EVERY kind the index stores (calls, extends, implements, uses, instantiates, overrides, contains, references, imports, exports, decorates, renders, mixes_in, part_of) — deliberately not narrowed, because a narrower default silently drops a fifth of the graph and cannot descend a class hierarchy: 'contains' is the parent-to-member edge, so excluding it means a traversal rooted at a class cannot reach that class's own methods. The cost is size — the type-level 'uses'/'references'/'contains' rows are roughly half of what a typical index stores, so a hub symbol's default answer is 2.5-4.8x larger than a filtered one (measured: lodash 487 KiB against 101 KiB, ripgrep 795 against 321). Pass relationshipTypes: ['calls'] for the pure call graph, or ['implements'] to see only interface satisfaction. A kind you do not list is never reported; a filter you supply is a REQUEST, not a bound — it is reported in `summary.filterNarrowed` and `summary.filterReason` (never in `truncationReason`, which is reserved for bounds), and the kinds actually searched come back in `summary.scope.relationshipTypes`."
      },
      {
        "name": "timeBudgetMs",
        "type": "number",
        "required": false,
        "description": "wall-clock ceiling for the whole walk in milliseconds. DEFAULT 0 = NO clock bound: every other bound on this answer is a function of the DATA (edgeLimit, the 50-symbol per-direction fan-out, maxEdges, maxDepth), so the default answer is complete over them and byte-identical on a re-run. Pass a value only to cap latency, and know what you are buying: the ceiling is checked BETWEEN statements and never inside one — a SQLite statement cannot be interrupted — so a run that hits it returns a SAMPLE of the set. The sample is declared, never silent: `summary.timeBudgetExhausted` is true and `walk-time-budget-exhausted` is among `summary.truncationReasons`. There is no value that makes a clock-bounded answer reproducible; if you need the whole set, leave this unset"
      }
    ],
    "defaults": {
      "maxDepth": 5,
      "direction": "both"
    },
    "examples": [
      {
        "symbol": "handleRequest"
      },
      {
        "symbol": "handleRequest",
        "maxDepth": 8
      },
      {
        "symbol": "handleRequest",
        "direction": "callers"
      },
      {
        "symbol": "Handler",
        "relationshipTypes": [
          "calls"
        ]
      }
    ],
    "returns": [
      "Per-symbol dependency graph: callers and callees",
      "Per-edge endpoints as described nodes — `{ id, name, symbolType, file, line, isExternal }` on BOTH ends, so an edge is self-contained and no id has to be parsed or looked up in a second call",
      "Per-edge `rowId`: the stored `brain_relationship` row the edge came from, so every claim is auditable against the index (measured: every emitted rowId resolves to exactly one stored row, and the edge's endpoints agree with that row)",
      "Endpoints the index could not resolve as `ext:<name>` nodes, with `isExternal: true` — a recorded name, never a symbol guessed from that name",
      "Per-edge `match` (`exact` | `owner-cascade`) and `matchedMember` (`{ name, file }` when the cascade matched): whether the stored row names the symbol that was asked for, or one of its members folded onto it",
      "Per-edge `evidenceClass`: the stored classification when the index made one, or `null` when the `tier` was DERIVED from the edge's own stored kind and confidence — so a reader can tell a stored claim from a derivation without a second query",
      "Per-edge `targetBasis`: why the target may claim this identity, from the stored row — `symbol` (a stored declaration), `external` or `unresolved` (a name the index could not attach). Never inferred by this tool",
      "Per-edge evidence tier (structural/import_based/usage_contextual/reference_qualified/inferred) with confidence",
      "Per-edge call-site address: `{ kind, file, line, note }` — `call-site` is an exact stored line; `declaration` is a LABELED substitute (the calling symbol's own declaration, shown only when no call-site line is stored); `unknown` has no position at all (line null) and states why. A position is never fabricated and never reported as line 0",
      "`summary.edgesByType`: the composition of the RETURNED edges by stored relationship kind, counted from the emitted edges. The default filter covers every stored kind, so an answer is usually not all call edges — measured: lodash `baseConvert` 99 of 230, cobra `getCompletions` 36 of 65, rake `standard_rake_options` 72 of 76. This is how you learn the ratio without walking the edges",
      "`summary.maxEdges` / `totalEdgeLimitReached`: the bound on the WHOLE answer, across both directions and every depth, and whether it bit. `edgeLimit` bounds one query; this bounds the answer, and their product is what a caller receives. A requested `maxEdges` is HONORED even below `edgeLimit` — `{maxEdges: 5}` returns 5 edges with `totalEdgeLimitReached: true` and `truncationReason: \"total-edge-limit\"` — so it is the way to ask for a quick shape check",
      "`summary.truncated` / `truncationReason` / `truncationReasons`: a DECLARED BOUND bit — the walk stopped before the store ran out. `truncationReasons` is the same set as a list (`truncationReason` is its `+`-joined rendering, kept for existing consumers)",
      "`summary.filterNarrowed` / `filterReason`: the `relationshipTypes` argument narrowed the QUESTION — a request, not a bound. `filterNarrowed: true` with `truncated: false` means the edge sets are the whole of what was asked for (and possibly not the whole of what the store holds); `filterReason` names the narrowing (e.g. `relationshipTypes:calls|uses`) and is `null` when the default kind set ran. Asking for `relationshipTypes:[\"implements\"]` on a symbol with none answers 0 edges with `truncated: false, filterNarrowed: true` — an empty subset, not a clipped answer",
      "`summary.edgeKindPriority`: the order in which kinds survive the per-symbol site limit — dependency kinds first, then lexical, then module-level, then membership. Only observable under `truncated`, published always",
      "`summary.scope.relationshipTypes`: the relationship kinds this run actually searched, RESOLVED from the engine's own registered list rather than restated, so the filter that produced the answer is never a restatement of a default that may have moved",
      "`summary.exactCallers` / `cascadedCallers` / `exactCallees` / `cascadedCallees`: DEPTH 0 only — how much of the answer is about the symbol that was asked for and how much the owner cascade folded in from its members. `deeperCallers` / `deeperCallees` hold the edges about symbols the traversal discovered, so exact + cascaded + deeper is the number of edges returned",
      "`summary.callerBudget` / `calleeBudget` with `callerBudgetExhausted` / `calleeBudgetExhausted`: the fan-out bound in force and whether it bit. `truncationReason` can name `caller-budget-exhausted`; this says what the budget was",
      "`summary.unattributed`: stored rows that NAME this symbol (or one of its owner-cascade members) but carry no source symbol, so the caller and callee queries — which join the source side — cannot show them in either direction. Per direction, depth 0 only, and `null` (not zero) when the count could not be taken. Measured on this repository's index: 11.0% of stored rows (69,171 of 631,139) carry no source symbol and 2,099 symbols answered `callers: []` while the store held incoming rows for them. The rows are counted, never fabricated into edges",
      "`summary.noiseFiltered` and `summary.crossLanguageExcluded`: how many stored rows this answer dropped BY POLICY (vendored, generated, fixture, snapshot, dist or build paths, and generated names) and BY REQUEST (`includeCrossLanguage: false`), per direction. Both are filters, not bounds: `truncated` stays false while they bite, which is why they are numbers rather than prose — a zero edge set beside a non-zero count is a policy or a request, not an empty result",
      "`summary.edgesInBothDirections`: stored rows present in both the caller and the callee list — `totalCallers + totalCallees` double-counts exactly this many",
      "`root.candidates` and `root.match`: how many stored symbols the requested name resolved among, and which resolution step won — `exact`, `exact-any-kind` (the name is a symbol the graph cannot traverse: a constant, a type alias), or `containment` (the answer is about a symbol whose name CONTAINS the one asked for, so the name was not itself a symbol). When `root.candidates` is greater than 1 the graph is about one of those symbols, so confirm `root` first",
      "`summary.maxDepth` and `summary.maxDepthReached`: the bound this run actually used and the depth it actually reached. Together they are the only way to tell \"the walk finished\" from \"the walk stopped\"",
      "A per-edge `depth`, which is HOW FAR THE WALK WENT before finding that row — not the shortest distance between two symbols. See Limitations",
      "`summary.scope`: the `direction`, `relationshipTypes` and `includeCrossLanguage` actually applied, so a narrowed traversal returning zero edges is distinguishable from a widened one that found nothing",
      "Declared truncation with a reason when the traversal is bounded"
    ],
    "errors": [
      "Missing symbol (a blank/whitespace-only `symbol` is refused as missing, not echoed back)",
      "`maxDepth` outside the declared 1-10 range, or not a whole number",
      "`edgeLimit` outside 1-5000, or not a whole number",
      "`maxEdges` outside 1-5000, or not a whole number",
      "`direction` outside `callers`|`callees`|`both`",
      "`relationshipTypes` given as an empty list, or with a blank entry (a narrowed traversal that can match nothing is refused rather than silently reinterpreted)",
      "`timeBudgetMs` negative (0 is accepted and means no clock bound)",
      "`includeCrossLanguage` not a boolean",
      "An option the tool does not accept (the acceptance set and the aliases are named in the error)",
      "Symbol not found in the index. The refusal runs the resolver's three declared steps first — exact name among traversable kinds, exact name among all kinds, then a `LIKE '%name%'` containment fallback — and the containment step is a substring scan: on the 11,440-file reference index an unknown name costs about 5 s before the not-found error. That cost is the declared fallback, not a hidden budget breach, and it is the same step that lets a near-miss (`root.match: \"containment\"`) answer instead of refusing"
    ],
    "limitations": [
      "Edges reflect indexed static evidence with declared tiers; inferred edges are labeled, not proven",
      "An edge's `depth` is the depth of the query that found its stored row, not the shortest path between the two symbols. The traversal is depth-first and the per-row dedupe is global, so the first traversal to reach a row emits it: measured, 24% of edges on cobra, 57% on lodash and 60% on rake sit deeper than the shortest path in their own answer. No edge ever claims a SHORTER path than its answer can demonstrate, so `depth` is a valid upper bound on distance — read it as 'how far the walk got', not 'how far apart these are'. Use `direction` with a smaller `maxDepth` when the distance itself matters",
      "The default filter covers every stored relationship kind, so an answer mixes dependency edges with lexical references (`uses`, `references`), structural membership (`contains`) and module edges (`imports`, `exports`). `contains` means owner → member: a class reporting its own methods is structure, not dependency. Filter with `relationshipTypes` for a pure call graph, or read `edgesByType`",
      "Every kind competes for the per-symbol site limit, and the surviving set is decided by `edgeKindPriority` — dependency kinds first. A truncated answer therefore keeps more `calls` and fewer `contains` than an untruncated one would, and the published order is the rule that decides it",
      "A target the index could not resolve appears as an `ext:<name>` node rather than as a symbol. That is a real gap in the index, surfaced rather than papered over: the edge `caller --calls--> ext:name` is what the store holds, and no internal symbol is substituted for it",
      "A blank or whitespace-only `symbol` is refused immediately (it used to be sent through the containment scan and echoed back in the not-found message). An unknown name is refused AFTER the containment fallback runs, which scans symbol names: about 5 s on the 11,440-file reference index. Both refusals are declared here because a caller budgeting latency on this tool should not discover the scan from a timeout",
      "The graph reflects the index as of the last index run. This tool does not auto-refresh and does not report per-file staleness; when files changed after indexing, run: bb index --changed (or the `bb_index` tool with the project path)",
      "Owner-cascade attribution: a relationship stored against a class member (e.g. a call to a method) is reported toward the owner class, so caller/callee sets are a superset of exact-symbol-only matches. The superset is REDUCIBLE: every edge carries `match` (`exact` or `owner-cascade`), `matchedMember` naming the member the stored row actually referenced, and the summary carries the exact/cascade split. Measured on cobra, `Command` (182 methods) answers with 184 caller edges of which 24 name `Command` itself. Every edge also carries the `rowId` it traces to",
      "A target the index could not resolve is reported as an `ext:<name>` node — a NAME the index saw and could not attach to a symbol — and is never resolved by matching that name against other symbols in the project. The name is not unique there (measured on vscode, `match` names 37,876 stored symbols; on svelte, `end` names 437,570), so matching it would manufacture edges the store does not contain, crowd out the resolvable callees, and seed the traversal with a guess. `ext:` nodes are leaves: there is nothing stored about them to walk into",
      "Two identical calls return identical answers: the DEFAULT asks for no wall-clock bound, and every remaining bound — the per-query site limit, the fan-out budget, the total-answer bound, the depth — is a function of the data. Passing `timeBudgetMs` ends that guarantee on purpose: the ceiling is checked BETWEEN statements and never inside one (a SQLite statement is not interruptible), so a run that hits it returns a declared SAMPLE of the set — `summary.timeBudgetExhausted: true` with `walk-time-budget-exhausted` among `summary.truncationReasons`",
      "A symbol name is not a unique identifier. When one name matches several stored symbols the resolver takes the highest-gravity match (ties broken by lowest id, so the pick is reproducible rather than SQLite's whim) and says how many it chose between in `root.candidates` — measured: `build` in lodash resolves among 7, `code_block.go` in cobra among 50, `Command` among 1. When `root.candidates` is greater than 1 the graph is about ONE of those symbols, so confirm `root` is the one you meant before reading the edges. The other candidates are not listed",
      "A name containing a SQL LIKE wildcard (`%`, `_`) is matched LITERALLY, not as a pattern: it either resolves to a symbol that genuinely contains those characters or is reported not found. It never widens into a match on an unrelated symbol",
      "Call-site positions depend on the analyzer: an exact line is claimed only where the index stored a real line; a legacy 0 or a NULL line yields the declared `declaration` or `unknown` address instead (derived by src/intelligence/graph/line-address.ts — never an inline fallback)",
      "`summary.totalCallers`/`totalCallees` are the RETURNED counts, not the totals. A per-symbol site limit (`edgeLimit`, default 200, max 5000) bounds one edge query; when it is reached the answer declares `truncated` with `truncationReason` naming the bound (`caller-site-limit` / `callee-site-limit`), `cappedQueries` says how many queries hit it, and `callersIfUncapped`/`calleesIfUncapped` carry the root's true site count (null when no cap was reached — never zero). The cap fires only when rows were ACTUALLY dropped: the query asks for one row beyond the limit, so a symbol holding exactly `edgeLimit` sites is reported complete instead of falsely truncated",
      "An empty caller or callee set is not proof that nothing references the symbol. Three populations sit BESIDE the edge sets rather than inside them, each with its own number: rows the JOIN cannot attribute because they carry no source symbol (`summary.unattributed`), rows removed by the noise policy (`summary.noiseFiltered`), and rows removed by the `includeCrossLanguage: false` scope option (`summary.crossLanguageExcluded`). Read them before concluding that a set is empty — in the measured index one symbol had 40 stored `calls` rows and answered three callers, 38 of them in the first population",
      "`truncated` means a BOUND bit, and nothing else. A `relationshipTypes` filter does not set it: the filter reports through `summary.filterNarrowed` / `filterReason` instead. The two questions are separate and both are answerable — \"is this the whole store?\" (`truncated`) and \"is this the whole of what I asked for?\" (`filterNarrowed` + the counts)",
      "`provenance.evidenceClass` is `inferred` for the ANSWER, not for every edge: root resolution (a gravity tie-break, or the containment fallback), the owner cascade, the noise policy and any cap are constructions over stored rows, so the whole object cannot claim `structural` even when each returned edge carries one stored row. Per-row evidence is on each edge's `tier` (a stored `calls` row is `structural`) and its `evidenceClass` / `targetBasis`"
    ],
    "safety": "Read-only. It does not modify source files or index data: the traversal opens the index read-only, with no migrations, no auto-refresh and no write tool. When the index is stale, refresh it deliberately with: bb index --changed (or the bb_index tool with the project path).",
    "relations": "For richer analysis (dependencies, complexity, tests, impact aggregation) use `bb_analyze`; for plain callers/callees with evidence tiers this is the tool.",
    "staleness": "This tool does not report per-file index staleness and does not auto-refresh. Output reflects the index as of the last index run; when files changed after indexing, refresh first: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only).",
  },
  {
    "name": "bb_impact",
    "category": "graph",
    "summary": "Bounded impact with declared truncation — identical numbers to the editor's impact mode.",
    "description": "Bounded reverse-dependency impact for one symbol via the same component the editor graph panel uses: declared node budget (200) and depth (5), truncation as a first-class field with reason, and a declared total that is the size of the set the answer is a prefix of — measured, not inferred, so an answer that is short of the whole set says so even when no bound fired. Unknown symbols are loud declared errors — an empty impact set is never invented. Owner-cascade applies: impact includes dependents attributed at class level, not only exact-symbol rows. The relationship kinds that count are named in every answer's `rule.relationshipTypes` and can be overridden; a dependent carries its evidence tier, cross-language flag, bridge and position.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "impact"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "symbol",
        "type": "string",
        "required": true,
        "description": "symbol name to compute impact for (`target`/`symbolName`/`query` are accepted as aliases)"
      },
      {
        "name": "file",
        "type": "string",
        "required": false,
        "description": "optional defining-file hint for a symbol NAME that several stored symbols carry — the same server-resolved identity the editor's hover sends as `file`. Accept the stored project-relative path, or an absolute path ending in it. It must identify the symbol: a hint that does not is REFUSED with a named error, never silently ignored and never silently relabelled to another same-named copy. Ambiguous MEMBER names (constructors, members outside the graph's root types) resolve through their owning declaration at the hinted file; for a traversable name the walk roots where the graph engine resolves it, and a hint naming another copy is refused rather than answered. Omit it for unique names."
      },
      {
        "name": "refresh",
        "type": "boolean",
        "required": false,
        "description": "set false to skip the bounded staleness repair and answer from the existing index. When omitted, stale files inside the answer are repaired and the walk is re-run so the answer is not built from the rows the refresh replaced."
      },
      {
        "name": "relationshipTypes",
        "type": "array",
        "required": false,
        "description": "stored relationship kinds to count as dependencies. Default: calls, instantiates, extends, implements. A kind that is not listed is never reported, and the applied list is echoed in `rule.relationshipTypes` on every answer. This is the same control bb_graph has, so a caller who wants the type-level `uses`/`references` rows can ask for them on either door."
      }
    ],
    "defaults": {},
    "examples": [
      {
        "symbol": "handleRequest"
      }
    ],
    "returns": [
      "The rule the answer was MEASURED under, in `rule`: which relationship kinds count as dependencies (the applied list is echoed here on every answer), the owner-cascade, the noise policy, and the depth cap. The set and the declared total are measurements of this same list",
      "The declared limits, from the component that owns them: `budget` (node budget 200, depth cap 5, the three work ceilings the declared total is computed under, and the two WALL-CLOCK deadlines — `walkTimeCeilingMs` for the engine walk and `callDeadlineMs` for the component's own work) and `traversal` (depth actually reached, the engine's own truncation state and reason, its per-query site limit, its capped-query count, its returned caller rows, and the root's uncapped caller count when computable). `maxDepth` is an EXPANSION cap: direct dependents are `depth: 0`, so the deepest dependent the engine can report is `maxDepth - 1` (4), and the depth cap is shared by the completeness measurement, so a declared total is the total UNDER that cap",
      "Whether the set is the WHOLE truth or a prefix of a larger one, and how that was established: whenever truncation was declared or the walk reached the last expandable depth, the returned set is measured against an unbounded walk of the same rule, and a prefix is declared when the two disagree. `countVerification` carries `ran`, `skipped`, `timedOut`, `boundarySuspect` and `complete` — `complete: true` means the measurement proved the returned set IS the whole truth (an ENGINE row cap may still have fired on the way; it is then published in `traversal.engineTruncated`, because a row cap that dropped only duplicate call sites of an already-counted dependent hides no dependent), `false` means a prefix or a declared unknown, and `null` means no measurement was bought because the set is complete by construction (shallow walk, no bound fired)",
      "Downstream dependents of the symbol with per-edge evidence tiers and confidence, cross-language flags, bridge mechanism, and each dependent's own position. Every one of those describes ONE stored row, and `evidenceAtDepth` says which path that row is on: `depth` is the MEASURED shortest path, while the graph engine walks depth-first and stamps the first trace, so the two can name different rows (measured across nine repositories before this was fixed: 340 of 4 258 rows, 7.98%). The evidence is re-read at the reported depth, and where no row can be attributed every evidence field is null rather than quoted from a longer path",
      "How the requested name became the root it walked: `rootMatch` carries the name asked for, whether the match was exact, an `exact-exempt-kind` hit (the name matched EXACTLY and unambiguously but the kind — an enum variant, a constant, a plain field — is outside the graph whitelist, so the walk is the one every other root gets and nothing was substituted), a containment match, or the member→owner substitution, and how many stored symbols carry that exact name. An ambiguous traversable name is ANSWERED about the copy the engine resolves, with `rootMatch.nameMatches` disclosing the ambiguity; an ambiguous member name is refused unless a `file` hint identifies its owning declaration",
      "How each dependent is a dependent, per row, in `via`: `exact` (the stored row names the symbol asked about), `member` (it names one of its members — the owner cascade working as declared, with the member named in `viaMember`), or `range-folded` (it names neither, and the row is in the answer only because the cascade RANGE widened). `cascade` is the composition of the returned set by those three, or `null` when the index refused the member lookups it needs to establish it",
      "`directCount` — the number of DIRECT dependents (depth 0), or `null` when the completeness measurement hit a declared ceiling, was refused, stopped on its clock, or was skipped because the walk had already spent the call's wall-clock deadline. `totalCountIfKnown` is the transitive total under the same rule, or `null` for the same declared unknowns. Neither is ever smaller than `shownCount`; when the measurement proves the set complete they equal it",
      "`file` — an optional defining-file hint for a name several stored symbols carry. For a member name (a constructor, or a member the graph cannot root) it resolves the walk through the MEMBER'S OWNING DECLARATION at that file and the result says so in `resolution`. For a traversable name the walk roots where the graph engine resolves the name, and the hint is a REFUSAL input: it either identifies that copy or the answer is a named error, never a silent relabel to another copy",
      "Freshness: a per-dependent `stale` flag (`true`/`false`, or `null` when the file is not in the index at all) and a summary `freshness` envelope; `rootStale` declares the root's own file separately, since a stale root with fresh dependents is still a stale answer. Stale files inside the answer are repaired within budget and the walk is re-run, declared in `autoRefresh`; `refresh=false` opts out",
      "Loud declared errors instead of fabricated empty sets: an unknown symbol, an ambiguous member name with no usable hint, a hint that does not identify the symbol, an empty `relationshipTypes` list, and the option refusals the shared validator raises are all named errors with `isError` set"
    ],
    "errors": [
      "Missing symbol",
      "Symbol not found in the index — a declared error, never an empty impact set that would read as \"nothing depends on this\"",
      "The requested NAME is an ambiguous MEMBER name (a constructor or a kind outside the graph's root types) and no usable `file` hint was given. The error lists the candidate copies with file and line (bounded to 8, plus a count of the rest) and names the `file` option as the remediation",
      "A `file` hint that does not identify the symbol — an unknown path, or a path naming a different copy than the symbol the walk would root at — is refused with a named error instead of being ignored or answered about another copy",
      "`relationshipTypes` given as an empty list: refused rather than silently re-read as the engine's default kind set (an empty rule matches nothing, and the engine would substitute its default)",
      "The root resolves to a non-traversable kind AND is not the symbol that was asked for — a gravity pick, a containment match, or a re-root through an owner. The graph whitelist exists so a request is never answered about a DIFFERENT symbol, and that is the only case left where it applies",
      "An option this tool does not accept, or a value of the wrong type, is rejected by the shared tool validator with the accepted options named"
    ],
    "limitations": [
      "Static impact analysis cannot establish runtime behavior: it reads stored relationship rows, not executed calls",
      "The depth cap is an EXPANSION cap. Direct dependents are `depth: 0`, the deepest reported dependent is `maxDepth - 1` (4), and the completeness measurement shares that cap — so a declared total is the total under the declared depth, and a chain deeper than the cap keeps a declared `caller-depth-cap-reached` truncation rather than claiming a bounded set is the whole truth",
      "The engine's row bounds are not truncations of the DEPENDENT SET: a per-query call-site limit, a per-traversal caller budget and a total-edge cap drop ROWS. When the measurement proves the returned set complete, those bounds stay visible in `traversal.engineTruncated` / `engineTruncationReason` and `truncated` stays false — the set is whole even though the engine stopped emitting rows",
      "When the completeness measurement cannot finish — 50 000 scanned rows, 2 000 expansions, its own circuit breaker, or the call deadline — `totalCountIfKnown` and `directCount` are BOTH `null` (a declared unknown), `countVerification` says whether it timed out or was skipped for the deadline, `reproducible: false` is published, and the truncation reason names it. The clock is the one bound that is a property of the machine rather than the index, so it is always declared rather than inferred",
      "The walk is bounded in WALL TIME by a declared deadline (`budget.walkTimeCeilingMs`): the graph engine applies no clock of its own, so this tool asks for one, and a walk that reaches it is a SAMPLE — declared with `truncated`, a truncation reason naming `walk-time-budget-exhausted`, the engine's returned/uncapped counts in `traversal`, and `reproducible: false`. It is the honest response to a hub whose answer would otherwise run past the tool's 5 s budget, not a hidden cut",
      "Latency depends on the index's planner state as well as on its size. Two index shapes were measured and fixed: the owner-range index made the walk's owner-cascade lookup cheap, and the counting walk's level query is now a FLAT target-id list rather than `IN(subquery over ids OR owner ranges)` — the old form could not use the target index and took 4 349 ms for ONE level-1 batch where the flat form returns the same rows in 4.1 ms. With both fixes plus the declared deadlines, a real hub (`getRawInstance`, the case that breached 5 s) answers in p50 2 424–2 805 ms / p95 2 450–3 148 ms across two baseline-protocol series (3 measured runs after one warm-up) and p95 3 029 ms over eight warm runs — measured byte-read-only, index files byte-identical after. The fixture tiers are the regression baselines (see Performance)",
      "Owner-cascade attribution applies: dependents through class-member relationships are attributed to the owner class. The cascade RANGE is a strict SUPERSET of the owner relation — it never loses a dependent the owner relation has, but it folds in siblings of a member: ripgrep `RegexMatcher` answered 21 dependents of which 7 were `range-folded` and 0 were real members. `cascade.rangeFolded` counts those rows, so the over-count is visible instead of silent",
      "A `file` hint cannot select a DIFFERENT copy of a traversable name: the graph engine roots by name (gravity-ordered), and the hint can only confirm that copy or refuse. Member names are the case the hint resolves, through their owning declaration",
      "`relationshipTypes` is not validated against the index's stored-kind vocabulary: a misspelled kind is measured as an empty set with `truncated: false`, and `rule.relationshipTypes` echoes the misspelling so the mistake is auditable rather than disguised as \"no dependents\"",
      "Reflects the index as of the last index run; the freshness envelope and the per-dependent `stale` flags state how far that is from the files on disk"
    ],
    "safety": "Read-only. It does not modify source files or index data. Staleness repair, when it runs, reindexes changed files through the shared bounded auto-refresh budget and never rewrites source.",
    "relations": "This is the bounded-impact specialist; `bb_analyze` mode `impact` aggregates the same canonical walk with file-level risk — the numbers are identical by gate.",
    "staleness": "Freshness modes (registered as freshnessModes): impact. Staleness surfaces as: per-dependent stale flag (three states: true/false, or null when the file is not in the index at all), the root's own rootStale, and a freshness envelope ({ fresh, stale, missing, staleRatio, mode, remediation }). Stale files inside the answer are repaired within budget and the walk is re-run, declared in autoRefresh; refresh=false opts out. When something is stale/missing, the remediation names the registered reindex interfaces: project scope → reads auto-refresh stale files within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only); file scope → reads auto-refresh this file within budget when enabled — disable with BB_NO_AUTO_REFRESH=1 or refresh=false; manual repair: run: bb index \"<file>\" (or the bb_index tool with that file path). Nothing is stale → silence (no remediation text). Detection uses a mtime+size fast path with a content-hash fallback: an edit that leaves both size and mtime unchanged is reported fresh without hashing (same trade-off as git's index stat-cache; accepted, documented in src/brain/freshness.ts).",
  },
  {
    "name": "bb_cross_language",
    "category": "graph",
    "summary": "Stored cross-language pairs, each naming both ends, with member rows reported separately as the member's, absence declared as a property of the store, and declared bounds and truncation.",
    "description": "Cross-language facts for one symbol from stored brain_relationship rows only (is_cross_language = 1), per-pair with bridge mechanism and evidence tier. Every fact names both ends — the copy of the requested name it came from and the other symbol's name, file, language and line — plus the stored row id. A name is many symbols (the index holds one per file/name/line), so facts are the union over every copy; `copies` names them and `ambiguous` says so. SEPARATELY, `memberFacts` holds the rows on the copies' MEMBERS: each fact's `self` is the MEMBER the stored row names, `owner` is the copy of the asked name it was attributed through, and `pair` is exactly `self.language → other.language` (null when the two are equal or unknown, and then the row is counted in `unpairableRowCount` rather than given a pair). Member rows are the MEMBER's edges, never absorbed into the symbol's — `ownFactCount`, `memberFactCount` and `silentItselfButNotItsMembers` tell the two apart. Absence is a property of the store: it is declared only when neither the copies nor their direct members hold a stored row. A row that exists but cannot name a language pair is NOT absence — it is counted in `unpairableRowCount` and named in `pairlessRowNote`, while `storedRowCount` still reports it. Rows on descendants at depth 2 or deeper are counted in `deeperDescendantRowCount` (both directions) and deliberately not cascaded. Counts name what they count: `factCount` facts in this answer, `pairCount` DISTINCT language pairs, `signatureCount` distinct (pair, direction, bridge, tier); `memberCount` is the distinct members that contributed BEFORE the limit while `memberFactCount` is what was shown, and `ownFactsTruncated`/`memberFactsTruncated` say which section a limit cut. The answer is bounded by `limit` (default 200, max 1000) with `truncated` and `totalCountIfKnown` declared, and the copy list has its own declared cap. This tool never infers, guesses, or aspires. Same source and laws as the editor's cross-language hover section.",
    "mutability": "read",
    "requiresIndex": true,
    "modes": [
      "cross-language"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "symbol",
        "type": "string",
        "required": true,
        "description": "symbol name to fetch cross-language facts for (`target`/`symbolName`/`query` are accepted as aliases)"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "max facts to return (default 200, max 1000); truncation is declared, never silent. Refused below 1 or above 1000 rather than clamped"
      }
    ],
    "defaults": {
      "limit": 200
    },
    "examples": [
      {
        "symbol": "Warehouse"
      },
      {
        "symbol": "Iterate"
      },
      {
        "symbol": "invoke",
        "limit": 50
      }
    ],
    "returns": [
      "One fact per stored cross-language row about the name. `facts` holds the rows on the copies themselves; `memberFacts` holds the rows on their MEMBERS. Every fact names both ends — `self` (symbol, file, language, line) and `other` — plus the stored `rowId`, direction, bridge, evidence tier and confidence. **The fact-shape invariant:** `self` is the endpoint the STORED ROW NAMES (the copy for `match: \"exact\"`, the member for `match: \"owner-cascade\"`), so `pair` is always exactly `self.language → other.language` and any consumer can re-derive it. A member fact also carries `owner` — the copy of the asked name it was attributed through — and `matchedMember`/`matchedMemberId`, which are the member end and its stored id (a mirror of `self`, kept so either name reads the same)",
      "`copies`: every indexed symbol carrying the name, with file, language, line and cross-row count, plus `ambiguous` and `ambiguityNote`. `limit` governs FACTS; the copy list has its own cap — `copiesCap`, with `copiesTruncated` and a `copiesNote` when it bites. `copyCount` is always the TRUE total from its own query, never the length of a capped array, so `ambiguous` cannot be silenced by the cap",
      "Counts name what they count: `factCount` is the number of facts in this answer; `pairCount` is the number of DISTINCT language pairs in it (`\"java → kotlin\"` is one pair however many rows carry it); `signatureCount` is the number of distinct (pair, direction, bridge, tier) signatures; `totalCountIfKnown` is the number of facts that exist before the limit. `ownFactCount` and `memberFactCount` are the facts shown per section, and `ownFactsTruncated` / `memberFactsTruncated` say which section the budget cut. `memberCount` is the distinct members that contributed a member fact BEFORE the limit, so it can exceed `memberFactCount`",
      "Declared absence is a property of the STORE, not of the emitted facts: `declaredAbsent` is true only when neither the copies nor their direct members hold a stored cross-language row, and `absenceNote` says so — scoped to the project, because that is what the row queries searched. A row that exists but cannot name a language pair is NOT absence: it is counted in `unpairableRowCount`, the empty fact set is explained in `pairlessRowNote`, and `storedRowCount` still reports it",
      "`deeperDescendantRowCount` counts stored cross-language rows on descendants at depth 2 or deeper, BOTH directions, and does not cascade them into the facts (a descendant's edges are the descendant's). When the owner itself is silent but such rows exist, the absence note names the count instead of claiming the index holds nothing",
      "Declared truncation: `truncated`, `truncationReason` and `totalCountIfKnown` when the `limit` bounded the facts. `collapsedRowCount` counts a row matched from both directions and emitted once; a row that is counted there is never emitted twice"
    ],
    "errors": [
      "Missing or blank symbol (refused, not defaulted)",
      "Symbol not found in the index — a declared error, not an empty set",
      "limit outside the declared 1..1000 range, a fractional limit, or a non-number limit — refused, never clamped silently"
    ],
    "limitations": [
      "THE MEMBER CASCADE IS ONE LEVEL DEEP. A member's rows are reported as the member's, with the owner named; a grandchild's rows are counted in `deeperDescendantRowCount` and deliberately not emitted as the owner's or the member's. Ask about the descendant directly to see them",
      "Stored rows only. Nothing here infers an edge, a bridge mechanism or a tier. Every fact traces to a `brain_relationship` row with `is_cross_language = 1`, filtered by the ROW's own project id in this tool and in the editor's cross-language hover section, so a row minted for another project cannot appear as a fact about this one",
      "The absence note is scoped to ONE PROJECT: the same name indexed in another project may hold rows for it, and `absenceNote` says which store it searched rather than claiming anything about the whole index",
      "`bridge` is stored data, not an inference about communication. On indexed corpora almost every row carries the indexer's name-resolution placeholder, so a bridge value names how the row was minted, not a verified interop mechanism. A row with no stored mechanism renders a fixed `unnamed bridge` text rather than an invented one",
      "A name held by many symbols is answered as the UNION over all of them; every fact names the copy it came from, so an agent can narrow, but the tool never chooses one copy on the agent's behalf and does not resolve which copy a human means",
      "Rows that cannot name a pair are counted, not dropped: an endpoint whose file has no detected language, or two endpoint languages that are equal, produces no fact and increments `unpairableRowCount`. No shipped corpus reaches that state today, so it is verified by seeding the state rather than assumed — and a row that exists but cannot name a pair is reported as `pairlessRowNote`, never as absence",
      "`memberCount` describes the whole answer, while `memberFactCount` describes what the limit showed. When the two differ, `memberFactsTruncated` is true and `truncationReason` names the budget",
      "Tier classification is a stored-vs-derived contract: when the indexer stored `metadata.evidenceClass` the stored class is rendered; otherwise the derived rule in `src/lsp/evidence_tier.ts` is used. `confidence` is the stored row confidence and is rendered beside the tier, never instead of it"
    ],
    "safety": "Read-only. It does not modify source files or index data.",
    "relations": "For same-language callers/callees use `bb_graph`; this tool reports stored cross-language pairs and bridges (declared absent when none).",
    "staleness": "This tool does not report per-file index staleness and does not auto-refresh. Output reflects the index as of the last index run; when files changed after indexing, refresh first: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only).",
  },
  {
    "name": "bb_annotate",
    "category": "annotations",
    "summary": "Agent note with enforced provenance, stored where the human reads.",
    "description": "Attach an agent-authored annotation to a symbol in the shared index. Provenance is enforced: `author_class` is hardcoded 'agent' for tool writes (a tool call cannot write a 'human' note), and the row records the caller's self-declared `toolIdentity` plus timestamps. Re-annotating the same symbol+path updates the note in place and reports the note it replaced — one note per author per location is enforced by a unique index over (project, symbol, author, path). The symbol is not checked against the index; the reply MEASURES whether an editor surface can show the note and says so in `surfacing`. `editor` is the JOINT truth the hover and graph badge use: the name (or qualified name) must be indexed AND declared in the resolved file, so a name indexed only in another file is reported `editor: false` with the reason rather than promised. `path` resolves to the index's own spelling, so `src/a.ts`, `./src/a.ts` and the absolute path are the same note. Declared bounds: body 2000 chars, toolIdentity 200 chars, symbol 500 chars, path 1024 chars — refusals, never truncation. Annotations are opinions layered on evidence, never index facts. On a project with no index, the first write creates that project's annotation store and `surfacing.editor` is false. To change source code use bb_edit; to read notes back use bb_annotations.",
    "mutability": "write",
    "requiresIndex": false,
    "modes": [
      "annotate"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "body",
        "type": "string",
        "required": true,
        "description": "annotation text, max 2000 chars counted in code points (an astral glyph is one character); empty or whitespace-only is refused"
      },
      {
        "name": "symbol",
        "type": "string",
        "required": true,
        "description": "symbol name to annotate, max 500 chars (`target`/`query` are accepted as aliases); it is not required to exist in the index — reachability is measured and reported"
      },
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "optional file path to scope the note to one file's copy of the symbol, max 1024 chars; resolved to the index's own spelling (`brain_file.relative_path`), so `src/a.ts`, `./src/a.ts` and the absolute path all reach the same note"
      },
      {
        "name": "toolIdentity",
        "type": "string",
        "required": false,
        "description": "optional name of the calling agent/tool, max 200 chars (recorded verbatim; line breaks and control characters are refused)"
      }
    ],
    "defaults": {},
    "examples": [
      {
        "symbol": "handleRequest",
        "body": "Legacy auth path — scheduled for removal in Q3."
      }
    ],
    "returns": [
      "The stored annotation row with its enforced provenance (`author_class` is always `agent` for tool writes) and the caller's self-declared `toolIdentity`, recorded verbatim with `time_created`/`time_updated`",
      "`replaced` — present only when this location already held a different note: the previous author class, tool identity, body and timestamps, so the second writer can merge instead of clobbering. The previous note does not survive in the store",
      "`surfacing` — a MEASUREMENT against the index, not a promise: `editor` (bool, the JOINT truth — the name or qualified name must be indexed AND declared in the resolved file), `nameMatched`, `pathMatched`, `fileMatched` (`true`/`false` when a path was given, `null` for a name-level note), `matchedAs` (`name` and/or `qualifiedName`), `matchedNames`, and a `statement` saying what is and is not true. A name that is indexed only in a DIFFERENT file than the one the path resolves to is reported `editor: false` with that reason — the hover and graph badge select notes by the file under the cursor, so those two individually-true halves would render nowhere",
      "The path handling: `surfacing.pathNote` when a path was resolved to the index's own spelling, `surfacing.pathWarning` when no indexed file matches the given path (stored under that spelling, no editor surface will scope it to a file), and a name-level note statement when no path was given"
    ],
    "errors": [
      "Missing or blank symbol",
      "Symbol longer than the declared 500-char limit — refused, never truncated",
      "Empty or whitespace-only body (a refusal, not a silent no-op)",
      "Body longer than the declared 2000-char limit, counted in characters (an astral glyph is one character, not two UTF-16 units)",
      "Path longer than the declared 1024-char limit — refused, never truncated",
      "toolIdentity longer than the declared 200-char limit — refused, never truncated",
      "toolIdentity containing a control character or line break — a label is a name, not a document. Refused, because a line break in that field is exactly what once rendered as a SECOND provenance line that could claim to be a human note",
      "Unknown options (including `author_class`/`authorClass`) are rejected by name with the accepted option list — provenance is not a caller input"
    ],
    "limitations": [
      "Annotations are opinions layered on index evidence, never index truth",
      "Any symbol name is accepted. Reachability is reported, not enforced: a name no indexed symbol carries is stored and declared `surfacing.editor: false`",
      "The note is keyed on the name as given. A name that matches several indexed symbols is one name-level note shown wherever that name appears, unless `path` scopes it to a file",
      "`surfacing.editor` is the joint rule the editors apply: the symbol must be declared in the file the path resolves to (or the note must be name-level). A name match plus a path match for a different file is reported `editor: false`",
      "`path` is resolved to the index's own spelling (`brain_file.relative_path`), so `src/a.ts`, `./src/a.ts` and the absolute path are the SAME note. A path matching no indexed file is stored verbatim and declared",
      "`toolIdentity` is the caller's own label. It is recorded verbatim and never verified — `author_class` is the enforced field",
      "The editor renderer escapes EVERY interpolated field, not only the body: `author_class`, `tool_identity` and `body` all go through the escaper, and a line break in any of them is flattened to a space, so one stored row always renders as one line. Markup escaping alone is not enough — a newline is what turns one annotation into two in a markdown list",
      "One note is kept per author per location, so a second agent annotating the same symbol+path REPLACES the first note. The replacement is reported in `replaced` with the previous body, but the previous note does not survive in the store. Annotating a DIFFERENT path (or no path) keeps a separate note per location",
      "On a project that has never been indexed, the first write creates that project's annotation store; the reply still reports `surfacing.editor: false` because no symbol can be matched yet",
      "This tool does not report per-file index staleness and does not auto-refresh: output reflects the index as of the last index run"
    ],
    "safety": "Write-capable against the annotation store only. It never modifies source files. It opens the project index read-write the way every write door does, so the additive schema migrations may apply on the first call; index content outside brain_annotation is not written.",
    "relations": "To change source code use `bb_edit`; this tool stores provenance-enforced notes on symbols. Read them back with `bb_annotations`.",
    "staleness": "This tool does not report per-file index staleness and does not auto-refresh. Output reflects the index as of the last index run; when files changed after indexing, refresh first: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only).",
  },
  {
    "name": "bb_annotations",
    "category": "annotations",
    "summary": "Annotations with full provenance; declared absence; both name forms matched; path canonicalized.",
    "description": "Read annotations for a symbol, one file's copy of a symbol (optional `path`), or all annotations up to the declared limit, with full provenance on every row: author class, tool identity, and timestamps. Every answer declares its bound: `count` is the page size, `totalCountIfKnown` the true total, and `truncated`/`truncationReason` fire when the limit actually dropped rows — a short page is never mistaken for a complete one, and at the declared cap the reason names narrowing the filter instead of an impossible limit raise. A `symbol` matches notes written under either name form the index publishes — the symbol's simple name AND its qualified name — the same pair the editor hover matches, so a note written as `render` is found by `Widget.render` and the other way round. A `path` is resolved to the index's own spelling before filtering. A project with no store yet is a declared absence; this read creates nothing. To write a note use bb_annotate.",
    "mutability": "read",
    "requiresIndex": false,
    "modes": [
      "annotate"
    ],
    "plannedModes": [],
    "parameters": [
      {
        "name": "includeNameLevel",
        "type": "boolean",
        "required": false,
        "description": "with `path` and no `symbol`, also return name-level notes (written with no path), which apply wherever their name appears. Off by default, so a path filter answers the question as asked rather than mixing in the whole project. With a symbol present the flag has no effect: name-level notes about that symbol always apply"
      },
      {
        "name": "limit",
        "type": "number",
        "required": false,
        "description": "max rows returned (default 50, min 1, max 200); a truncated answer states the true total and a reason"
      },
      {
        "name": "path",
        "type": "string",
        "required": false,
        "description": "optional file path; resolved to the index's own spelling first, so `src/a.ts`, `./src/a.ts` and the absolute path are the same filter. A path without a symbol returns that file's own notes only — pass `includeNameLevel` for the project's name-level notes as well. Combined with a symbol, it returns that file's copy of the symbol plus name-level notes about that symbol. Omit to read every file for the symbol"
      },
      {
        "name": "symbol",
        "type": "string",
        "required": false,
        "description": "symbol name, simple name or qualified name; both forms resolve to the same notes. Omit to read the whole project. `target`/`query` are accepted as aliases"
      }
    ],
    "defaults": {
      "limit": 50
    },
    "examples": [
      {
        "symbol": "handleRequest",
        "path": "src/server.ts"
      },
      {
        "symbol": "Widget.render"
      },
      {
        "includeNameLevel": true,
        "path": "src/index.ts"
      }
    ],
    "returns": [
      "Typed annotations for a symbol, a file, or the whole project, with full provenance on every row (author class, tool identity, timestamps)",
      "`count` (the page size), `totalCountIfKnown` (the true number of matching annotations) and `truncated` with a `truncationReason` naming an action the caller can take — at the declared cap the reason asks for a narrower filter instead of a limit raise it cannot honour",
      "`includeNameLevel` echoes the accepted flag and `nameLevelIncluded` states the filter actually applied (a symbol request always includes name-level notes about that symbol)",
      "`symbolIndexed` says whether the requested spelling named an indexed symbol; a spelling the index does not publish falls back to the literal stored name, so a note written under an arbitrary name is still findable",
      "`storeAbsent` is true when the project has no annotation store yet: the answer is a declared absence and the read created nothing",
      "Declared-absent result when none exist — absence is never an error"
    ],
    "errors": [
      "limit outside the declared 1-200 range (0, negative, above 200, fractional, or not a number) is refused with the rule named",
      "an option the tool does not accept is refused with the accepted option set named, and a conflicting alias/canonical pair is refused rather than silently resolved"
    ],
    "limitations": [
      "Reads only stored annotations, and does not create, migrate or repair the store while reading; absence is declared, not inferred",
      "Without `path`, a symbol that lives in several files returns every file's notes together; pass `path` (or read each row's `symbol_path`) to separate them",
      "A `symbol` resolves to the simple name AND the qualified name of every symbol it names, the same pair the editor hover matches, so a note written under either form is found from either spelling. This is the editor's predicate, not a prose promise",
      "A `path` is resolved to the index's own spelling before filtering, so a reader passing `./src/a.ts` finds the note a writer stored as `src/a.ts`; a path the index does not know is used as given",
      "A `path` filter WITHOUT a `symbol` returns that file's own notes only and excludes the project's name-level notes by default; pass `includeNameLevel: true` for the broader set. With a `symbol` AND a `path`, name-level notes about THAT symbol are always included",
      "The registry declares one nominal action name for the store (`annotate`); the tool takes no `mode` option — every call is a read and a request carrying `mode` is refused as an unknown option"
    ],
    "safety": "Read-only, measured: the store is opened byte-read-only, so a read does not create a database for an unindexed project, does not recreate a missing annotation table in a legacy store, and does not move the write-ahead log. It does not modify source files, index data, or annotations.",
    "relations": "To write a note use `bb_annotate`; this tool reads stored annotations, declares absence, and opens the store without writing it.",
    "staleness": "This tool does not report per-file index staleness and does not auto-refresh. Output reflects the index as of the last index run; when files changed after indexing, refresh first: run: bb index --changed (or the bb_index tool with the project path — incremental, changed files only).",
  }
]

export type ToolFact = (typeof TOOL_FACTS)[number]
