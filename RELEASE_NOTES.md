# NodusAI v0.1

NodusAI v0.1 is the first branded product release built on the Langflow runtime.

## Highlights

- NodusAI landing page with separate Build with AI, template, and blank-workflow paths.
- NodusAI Assistant integration and AI prompt starters.
- Workflow health checks and Fix with AI handoff.
- Automatic workflow naming for AI-created workflows.
- Duplicate & Open, server-backed My Templates, workflow snapshots and snapshot history.
- Structured workflow notes with Markdown export.
- Server-persisted NodusAI notes and snapshots without a database migration.
- NodusAI branding across the frontend, runtime messages, API surfaces, Docker metadata, and error/loading states.

## Compatibility

NodusAI intentionally retains compatibility-sensitive Langflow identifiers such as Python package names, CLI names, database/runtime internals, and `LANGFLOW_*` environment variables. Required upstream MIT attribution is retained.

## Release validation

Run:

```bash
bash scripts/nodusai-release-cleanup.sh
bash scripts/nodusai-release-check.sh
```

The release checker validates tracked secrets/artifacts, Python syntax, JSON, TypeScript types, the production frontend build, and the embedded backend frontend bundle.
