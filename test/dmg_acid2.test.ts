import {expect, it} from "vitest";
import {Machine} from "../src/classes/machine";
import {framesPerSecond, loadReference, loadROM, runUntilScreenMatches, writeScreen} from "./harness";

// Frame limit (10 emulated seconds)
const maxFrames = 10 * framesPerSecond;

// Compares against img/reference-dmg.png from https://github.com/mattcurrie/dmg-acid2
it("dmg-acid2", async () => {
    let machine = new Machine(loadROM("dmg-acid2/dmg-acid2.gb"));
    let result = await runUntilScreenMatches(machine, loadReference("dmg-acid2/reference-dmg.png"), maxFrames);

    if(!result.matched){
        let path = writeScreen("dmg-acid2", result.shades);
        expect.fail(result.mismatches + " pixels differ from the reference after " + result.frames + " frames, screen written to " + path);
    }
}, 120000);
