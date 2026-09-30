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

- [Blargg's test ROMs](https://github.com/retrio/gb-test-roms) pass when they report "Passed" or
  result code 0. `cpu_instrs`, `instr_timing` and `mem_timing` report over the emulated serial port,
  `oam_bug`, `mem_timing-2` and `dmg_sound` report in cartridge RAM at `$A000`, and `halt_bug` only prints to the
  screen, which is read back as text from the background tile map.
- [Mooneye's acceptance tests](https://github.com/Gekkio/mooneye-test-suite) report their result
  in the CPU registers.
- [dmg-acid2](https://github.com/mattcurrie/dmg-acid2) draws a test image, which is compared against
  its reference screenshot. When it doesn't match, the actual screen is written to `test/output/`.

The test ROMs should be placed in `test/roms/` as follows, then run `npm test`:

- `test/roms/blargg/cpu_instrs/` — the files from `cpu_instrs/individual/`
- `test/roms/blargg/instr_timing/` — `instr_timing.gb`
- `test/roms/blargg/mem_timing/` — the files from `mem_timing/individual/`
- `test/roms/blargg/mem_timing-2/` — the files from `mem_timing-2/rom_singles/`
- `test/roms/blargg/oam_bug/` — the files from `oam_bug/rom_singles/`
- `test/roms/blargg/dmg_sound/` — the files from `dmg_sound/rom_singles/`
- `test/roms/blargg/halt_bug/` — `halt_bug.gb`
- `test/roms/mooneye/acceptance/` and `test/roms/mooneye/emulator-only/` — those folders from a Mooneye release
- `test/roms/dmg-acid2/` — `dmg-acid2.gb` from the dmg-acid2 release and `img/reference-dmg.png`
  from the dmg-acid2 repo

Tests that fail on the current emulator are listed as known failures and are expected to fail.
When a fix makes one pass, Vitest reports it so it can be removed from the list.

Requires Node.js 18 or newer.
