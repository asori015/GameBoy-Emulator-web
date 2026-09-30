import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {Machine} from "../src/classes/machine";

const romDir = join(__dirname, "roms");
const framesBetweenYields = 60;

// Emulated frames per second (DMG runs at ~59.7)
export const framesPerSecond = 60;

export interface SerialResult {
    output: string;
    frames: number;
    finished: boolean;
}

/**
 * Load a test ROM from test/roms
 * @param relativePath Path relative to test/roms
 * @return ROM contents
 */
export function loadROM(relativePath: string): Uint8Array{
    let path = join(romDir, relativePath);
    if(!existsSync(path)){
        throw new Error("Missing test ROM: " + path + "\nRun `npm run fetch-test-roms` first.");
    }
    return new Uint8Array(readFileSync(path));
}

/**
 * Run until the serial output reports "Passed" or "Failed", or maxFrames elapse
 * @param machine Machine with a test ROM loaded
 * @param maxFrames Frame limit before giving up
 * @return serial output, frames run, and whether a result was reported
 */
export async function runUntilSerialResult(machine: Machine, maxFrames: number): Promise<SerialResult>{
    for(let frame = 1; frame <= maxFrames; frame++){
        machine.getFrame();
        let output = machine.getSerialOutput();
        if(output.includes("Passed") || output.includes("Failed")){
            return {output, frames: frame, finished: true};
        }
        // Yield so the Vitest worker isn't blocked during long runs
        if(frame % framesBetweenYields == 0){
            await yieldToEventLoop();
        }
    }
    return {output: machine.getSerialOutput(), frames: maxFrames, finished: false};
}

function yieldToEventLoop(): Promise<void>{
    return new Promise((resolve) => setImmediate(resolve));
}
