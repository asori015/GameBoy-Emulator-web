import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
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
        throw new Error("Missing test ROM: " + path + "\nDownload Blargg's test ROMs from https://github.com/retrio/gb-test-roms");
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

export interface RegisterResult {
    passed: boolean;
    finished: boolean;
    frames: number;
    registers: Uint8Array;
}

/**
 * Run until the registers show Mooneye's pass or fail signature, or maxFrames elapse
 * @param machine Machine with a Mooneye test ROM loaded
 * @param maxFrames Frame limit before giving up
 * @return whether the test passed, whether it reported a result, frames run, and final registers
 */
export async function runUntilRegisterResult(machine: Machine, maxFrames: number): Promise<RegisterResult>{
    for(let frame = 1; frame <= maxFrames; frame++){
        machine.getFrame();
        let registers = machine.getRegisters();
        // B, C, D, E, H, L are indices 0-5
        let passed = registers[0] == 3 && registers[1] == 5 && registers[2] == 8 &&
            registers[3] == 13 && registers[4] == 21 && registers[5] == 34;
        let failed = registers.subarray(0, 6).every((value) => value == 0x42);
        if(passed || failed){
            return {passed, finished: true, frames: frame, registers};
        }
        if(frame % framesBetweenYields == 0){
            await yieldToEventLoop();
        }
    }
    return {passed: false, finished: false, frames: maxFrames, registers: machine.getRegisters()};
}

/**
 * Format B, C, D, E, H, L for failure messages
 * @param registers Registers from Machine.getRegisters()
 * @return register values as a string
 */
export function formatRegisters(registers: Uint8Array): string{
    let names = ["B", "C", "D", "E", "H", "L"];
    let parts = [];
    for(let i = 0; i < names.length; i++){
        parts.push(names[i] + "=" + registers[i]);
    }
    return parts.join(" ");
}

/**
 * Define one test per Mooneye acceptance ROM, running known failures with it.fails
 * @param name Test group name
 * @param roms ROM paths relative to test/roms/mooneye/acceptance
 * @param knownFailures ROMs that fail on the current emulator
 */
export function mooneyeTests(name: string, roms: string[], knownFailures: string[]){
    for(let rom of knownFailures){
        if(!roms.includes(rom)){
            throw new Error("Known failure isn't in the ROM list: " + rom);
        }
    }

    // Frame limit per ROM (10 emulated seconds)
    let maxFrames = 10 * framesPerSecond;

    describe(name, () => {
        for(let rom of roms){
            let test = knownFailures.includes(rom) ? it.fails : it;
            test(rom, async () => {
                let machine = new Machine(loadROM("mooneye/acceptance/" + rom));
                let result = await runUntilRegisterResult(machine, maxFrames);

                expect(result.finished, "No result after " + result.frames + " frames, registers: " + formatRegisters(result.registers)).toBe(true);
                expect(result.passed, "Failed, registers: " + formatRegisters(result.registers)).toBe(true);
            }, 120000);
        }
    });
}

function yieldToEventLoop(): Promise<void>{
    return new Promise((resolve) => setImmediate(resolve));
}
