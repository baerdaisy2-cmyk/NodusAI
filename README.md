# NodusAI

NodusAI is a visual platform for building, connecting, testing, and deploying AI agents and intelligent workflows. It combines a node-based workflow canvas with model providers, tools, RAG/knowledge components, MCP, APIs, and an integrated AI assistant.

> **Open-source foundation:** NodusAI is based on the [Langflow](https://github.com/langflow-ai/langflow) open-source project and retains the upstream MIT license and notices. Internal Python package names, API compatibility identifiers, and `LANGFLOW_*` environment variables are intentionally preserved where changing them would break compatibility.

## What NodusAI adds

- NodusAI visual identity, browser/PWA branding, login and loading surfaces
- A dedicated landing page at `/`
- **Build with AI** workflow creation that opens the integrated NodusAI Assistant
- **Start from Template** and blank-workflow paths
- NodusAI GitHub and Discord contact surfaces
- Rebranded Assistant, chat, settings and user-facing product copy
- Compatibility with the underlying Langflow workflow engine and ecosystem

## Development

Requirements follow the upstream project: Python 3.10–3.14, `uv`, Node.js 20.19+ and npm.

Run the backend in one terminal:

```bash
make backend
```

Run the frontend in a second terminal:

```bash
make frontend
```

Then open:

- NodusAI UI: `http://localhost:3000/`
- Backend: `http://localhost:7860/`

For a production-style local run, the upstream source workflow remains available through the project Makefile.

## Repository

NodusAI repository: https://github.com/baerdaisy2-cmyk/NodusAI

## License and attribution

This repository contains software derived from Langflow and remains subject to the MIT License included in [`LICENSE`](./LICENSE). Copyright and permission notices from the upstream project are retained as required by that license.

NodusAI branding and modifications are separate from the upstream Langflow project. References to upstream Langflow documentation may remain where they are the authoritative technical reference for inherited functionality.
