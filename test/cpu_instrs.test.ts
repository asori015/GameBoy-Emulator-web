import {describe, expect, it} from "vitest";
import {Machine} from "../src/classes/machine";
import {framesPerSecond, loadROM, runUntilSerialResult} from "./harness";

// Blargg's cpu_instrs, one ROM per instruction group
const roms = [
    "01-special.gb",
    "02-interrupts.gb",
    "03-op sp,hl.gb",
    "04-op r,imm.gb",
    "05-op rp.gb",
    "06-ld r,r.gb",
    "07-jr,jp,call,ret,rst.gb",
    "08-misc instrs.gb",
    "09-op r,r.gb",
    "10-bit ops.gb",
    "11-op a,(hl).gb",
];

// Frame limit per ROM (60 emulated seconds)
const maxFrames = 60 * framesPerSecond;

describe("Blargg cpu_instrs", () => {
    it.each(roms)("%s", async (rom: string) => {
        let machine = new Machine(loadROM("blargg/cpu_instrs/" + rom));
        let result = await runUntilSerialResult(machine, maxFrames);

        expect(result.finished, "No result after " + result.frames + " frames, serial output:\n" + result.output).toBe(true);
        expect(result.output).toContain("Passed");
    }, 120000);
});
