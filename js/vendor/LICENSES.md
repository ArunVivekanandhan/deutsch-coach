# Third-party code in js/vendor/

## simli-client.bundle.js
Bundle (esbuild, IIFE → `window.SimliSDK`) of:
- **simli-client 3.0.2** — MIT License, © Simli (https://github.com/simliai/simli-client)
- **livekit-client 2.x** (dependency) — Apache License 2.0, © LiveKit, Inc.
- and their dependencies (licence comments are kept at the end of the bundle).

Rebuild: `npm install simli-client@3.0.2 esbuild` then bundle an entry that does
`import { SimliClient, generateSimliSessionToken, generateIceServers, LogLevel } from 'simli-client/dist/client.js'`
(the package's own `dist/index.js` requires `./Client` with a capital C, which fails on case-sensitive file systems)
and sets `window.SimliSDK = {...}`; `npx esbuild entry.js --bundle --minify --format=iife --target=es2020 --legal-comments=eof`.
Loaded on demand by js/call/avatar.js only when the photorealistic (Simli) tutor is selected.
