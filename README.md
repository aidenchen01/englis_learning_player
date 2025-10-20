# English Learning Player

A MacOS-focused Electron application skeleton for a media player that supports common audio and video formats. This repository provides the project scaffolding, automated tests, and GitHub Actions workflow necessary to produce a `.dmg` artifact (version `0.0.1`) as a Hello World release.

## Getting Started

```bash
npm install
npm test
npm start
```

- `npm test` builds the project and executes all unit, integration, and end-to-end tests.
- `npm start` launches the Electron application using the compiled output.

## Packaging

To create a DMG locally, run:

```bash
npm run dist
```

The artifact will be generated in the `release/` directory.

## Continuous Integration

A GitHub Actions workflow (`.github/workflows/build-dmg.yml`) runs on each push to `main`, executing tests and producing a DMG artifact automatically after pull requests are merged.
