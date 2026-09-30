import {describe, expect, it} from "vitest";
import {Machine} from "../src/classes/machine";
import {framesPerSecond, loadROM, runUntilSerialResult} from "./harness";

// Blargg's instruction and memory access timing tests
const roms = [
    "instr_timing/instr_timing.gb",
    "mem_timing/01-read_timing.gb",
    "mem_timing/02-write_timing.gb",
    "mem_timing/03-modify_timing.gb",
];

// Tests that fail on the current emulator, run with it.fails until fixed
const knownFailures = new Set<string>([
    // Memory reads and writes happen at the wrong cycle within an instruction
    "mem_timing/01-read_timing.gb",
    "mem_timing/02-write_timing.gb",
    "mem_timing/03-modify_timing.gb",
]);

// Frame limit per ROM (10 emulated seconds)
const maxFrames = 10 * framesPerSecond;

describe("Blargg timing", () => {
    for(let rom of roms){
        let test = knownFailures.has(rom) ? it.fails : it;
        test(rom, async () => {
            let machine = new Machine(loadROM("blargg/" + rom));
            let result = await runUntilSerialResult(machine, maxFrames);

            expect(result.finished, "No result after " + result.frames + " frames, serial output:\n" + result.output).toBe(true);
            expect(result.output).toContain("Passed");
        }, 120000);
    }
});
