import {expect, it} from "vitest";
import {Machine} from "../src/classes/machine";
import {framesPerSecond, loadROM, runUntilScreenResult} from "./harness";

// Frame limit (20 emulated seconds)
const maxFrames = 20 * framesPerSecond;

// Blargg's HALT bug test, which only reports its result on screen
it("halt_bug", async () => {
    let machine = new Machine(loadROM("blargg/halt_bug/halt_bug.gb"));
    let result = await runUntilScreenResult(machine, maxFrames);

    expect(result.finished, "No result after " + result.frames + " frames, screen:\n" + result.output).toBe(true);
    expect(result.output).toContain("Passed");
}, 120000);
