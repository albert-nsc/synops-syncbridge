# AGENTS.md

## Purpose
Help AI coding agents understand the repository structure, build commands, and ServiceNow-specific conventions used by this project.

## Project type
- ServiceNow Now SDK integration written in TypeScript.
- Root package scripts use `now-sdk` for build, deploy, transform, and type dependency generation.
- No existing docs or tests are present in the repository.

## Key files
- `package.json`: project scripts and dependencies.
- `now.config.json`: ServiceNow package scope and `tsconfig` path for server build.
- `src/fluent/example.now.ts`: defines the published REST API and connects routes to handler functions.
- `src/server/apiHandlers.ts`: core API request handlers for create/update/cancel service request flows.
- `src/server/tsconfig.json`: server compile settings and output path to `dist/server`.

## Build and execution
- Install dependencies: `npm install`
- Build: `npm run build`
- Deploy/install: `npm run deploy`
- Transform: `npm run transform`
- Generate dependency types: `npm run types`

## ServiceNow conventions
- Use `RestApi` from `@servicenow/sdk/core` to declare REST routes.
- Export functions like `createServiceRequest(request, response)` and attach them to route `script` values.
- Request body payload is accessed via `request.body?.data`.
- Use `response.setContentType('application/json')`, `response.setStatus(...)`, and `response.getStreamWriter().writeString(...)` for JSON responses.
- `GlideRecord` is available from `@servicenow/glide` for ServiceNow database queries.

## Agent guidance
- Prefer minimal, targeted updates: preserve the ServiceNow handler signatures and route definitions.
- Avoid refactoring runtime request/response handling unless fixing a bug or adding a new route.
- If modifying API shape, update both `src/fluent/example.now.ts` and the corresponding handler in `src/server/apiHandlers.ts`.
- There is no CI/test suite to infer project behavior; use the build command and runtime patterns from `now-sdk`.

## Notes
- Recommended VS Code extension: `servicenow.fluent-language-extension` (from `.vscode/extensions.json`).
