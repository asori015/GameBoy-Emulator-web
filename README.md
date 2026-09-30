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

The test suite runs test ROMs through the emulator in Node, with no browser:

- [Blargg's test ROMs](https://github.com/retrio/gb-test-roms) (`cpu_instrs`, `instr_timing`,
  `mem_timing`) report their result over the emulated serial port, and pass when they print "Passed".
- [Mooneye's acceptance tests](https://github.com/Gekkio/mooneye-test-suite) report their result
  in the CPU registers.

The test ROMs should be placed in `test/roms/` as follows, then run `npm test`:

- `test/roms/blargg/cpu_instrs/` — the files from `cpu_instrs/individual/`
- `test/roms/blargg/instr_timing/` — `instr_timing.gb`
- `test/roms/blargg/mem_timing/` — the files from `mem_timing/individual/`
- `test/roms/mooneye/acceptance/` — the `acceptance/` folder from a Mooneye release

Tests that fail on the current emulator are listed as known failures and are expected to fail.
When a fix makes one pass, Vitest reports it so it can be removed from the list.

Requires Node.js 18 or newer.
