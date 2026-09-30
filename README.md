# GameBoy-Emulator-web

A Game Boy (DMG) emulator that runs in the browser, written from scratch in
TypeScript. It emulates the CPU, GPU, memory bus, timers, and audio, renders to
an HTML canvas, and persists battery-backed save data to browser local storage.

🎮 **[Play it live](https://asori015.github.io/GameBoy-Emulator-web/)**

## Features

- Cycle-stepped CPU and PPU with canvas rendering
- All cartridge MBC modes supported
- Battery save data persisted to browser local storage
- Audio (work in progress)
- Load games from a local `.gb` file or one of the built-in title buttons

## Built with

- TypeScript
- Webpack (+ ts-loader) — bundles `src/` into a single `app.js`
- Vitest — runs the emulator headless against test ROMs

## Setup & build

Requires [Node.js](https://nodejs.org/) and npm.

```bash
npm install
npm run build
```

Then open the app. Because it loads remote ROMs over HTTP, serve the folder with
any static file server rather than opening `index.html` from disk:

```bash
npx serve .
```

## Usage

- Click any of the title buttons to load a built-in ROM, or
- Use the file picker to load your own `.gb` ROM from disk.

## Running tests

The test suite runs [Blargg's `cpu_instrs` test ROMs](https://github.com/retrio/gb-test-roms)
through the emulator in Node, with no browser. Each ROM reports its result over the
emulated serial port, and a test passes when the ROM prints "Passed".

The test ROMs should be placed in `test/roms/blargg/cpu_instrs/` then run:

```bash
npm test
```

Requires Node.js 18 or newer.
