import {existsSync, mkdirSync, readFileSync, writeFileSync} from "node:fs";
import {join} from "node:path";
import {PNG} from "pngjs";
import {describe, expect, it} from "vitest";
import {Machine} from "../src/classes/machine";

const romDir = join(__dirname, "roms");
const outputDir = join(__dirname, "output");
const framesBetweenYields = 60;
const screenWidth = 160;
const screenHeight = 144;

// Frame buffer colors for shades 0-3, matching colorValues in gpu.ts
const shadeColors = [0xFFFF, 0x56B5, 0x29AA, 0x0000];

// Emulated frames per second (DMG runs at ~59.7)
export const framesPerSecond = 60;

export interface TextResult {
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
export function runUntilSerialResult(machine: Machine, maxFrames: number): Promise<TextResult>{
    return runUntilTextResult(machine, maxFrames, () => machine.getSerialOutput());
}

/**
 * Run until text on screen reports "Passed" or "Failed", or maxFrames elapse
 * @param machine Machine with a test ROM loaded
 * @param maxFrames Frame limit before giving up
 * @return screen text, frames run, and whether a result was reported
 */
export function runUntilScreenResult(machine: Machine, maxFrames: number): Promise<TextResult>{
    return runUntilTextResult(machine, maxFrames, () => readScreenText(machine));
}

/**
 * Read the background tile map as text, for tests whose font uses tile numbers equal to ASCII codes
 * @param machine Machine with a test ROM loaded
 * @return the 32 tile map rows as lines, starting from the top of the screen
 */
export function readScreenText(machine: Machine): string{
    let map = (machine.readMemory(0xFF40) & 0x08) > 0x00 ? 0x9C00 : 0x9800;
    let firstRow = machine.readMemory(0xFF42) >> 3;
    let lines = [];
    for(let i = 0; i < 32; i++){
        let row = (firstRow + i) % 32;
        let line = "";
        for(let col = 0; col < 32; col++){
            let tile = machine.readMemory(map + (row * 32) + col);
            line += (tile >= 0x20 && tile < 0x7F) ? String.fromCharCode(tile) : " ";
        }
        lines.push(line.replace(/\s+$/, ""));
    }
    return lines.join("\n").replace(/\s+$/, "");
}

async function runUntilTextResult(machine: Machine, maxFrames: number, readText: () => string): Promise<TextResult>{
    for(let frame = 1; frame <= maxFrames; frame++){
        machine.getFrame();
        let output = readText();
        if(output.includes("Passed") || output.includes("Failed")){
            return {output, frames: frame, finished: true};
        }
        // Yield so the Vitest worker isn't blocked during long runs
        if(frame % framesBetweenYields == 0){
            await yieldToEventLoop();
        }
    }
    return {output: readText(), frames: maxFrames, finished: false};
}

export interface MemoryResult {
    passed: boolean;
    finished: boolean;
    frames: number;
    code: number;
    output: string;
}

/**
 * Run until a Blargg test reports its result in cartridge RAM at $A000, or maxFrames elapse
 * @param machine Machine with a test ROM loaded
 * @param maxFrames Frame limit before giving up
 * @return whether it passed, whether it reported a result, frames run, result code, and text output
 */
export async function runUntilMemoryResult(machine: Machine, maxFrames: number): Promise<MemoryResult>{
    for(let frame = 1; frame <= maxFrames; frame++){
        machine.getFrame();
        // $A001-$A003 hold a signature once the result data is valid, $A000 is 0x80 while running
        if(hasMemorySignature(machine) && machine.readMemory(0xA000) != 0x80){
            let code = machine.readMemory(0xA000);
            return {passed: code == 0, finished: true, frames: frame, code, output: readMemoryText(machine)};
        }
        if(frame % framesBetweenYields == 0){
            await yieldToEventLoop();
        }
    }
    let output = hasMemorySignature(machine) ? readMemoryText(machine) : "";
    return {passed: false, finished: false, frames: maxFrames, code: machine.readMemory(0xA000), output};
}

function hasMemorySignature(machine: Machine): boolean{
    return machine.readMemory(0xA001) == 0xDE && machine.readMemory(0xA002) == 0xB0 && machine.readMemory(0xA003) == 0x61;
}

// Text output is a zero-terminated string starting at $A004
function readMemoryText(machine: Machine): string{
    let text = "";
    for(let addr = 0xA004; addr < 0xC000; addr++){
        let value = machine.readMemory(addr);
        if(value == 0){
            break;
        }
        text += String.fromCharCode(value);
    }
    return text;
}

/**
 * Define one test per Blargg ROM that reports through cartridge RAM, running known failures with it.fails
 * @param name Test group name
 * @param roms ROM file names in test/roms/blargg/<folder>
 * @param knownFailures ROMs that fail on the current emulator
 * @param folder Folder in test/roms/blargg
 * @param seconds Emulated seconds to wait for a result
 */
export function blarggMemoryTests(name: string, roms: string[], knownFailures: string[], folder: string, seconds: number = 20){
    for(let rom of knownFailures){
        if(!roms.includes(rom)){
            throw new Error("Known failure isn't in the ROM list: " + rom);
        }
    }

    let maxFrames = seconds * framesPerSecond;

    describe(name, () => {
        for(let rom of roms){
            let test = knownFailures.includes(rom) ? it.fails : it;
            test(rom, async () => {
                let machine = new Machine(loadROM("blargg/" + folder + "/" + rom));
                let result = await runUntilMemoryResult(machine, maxFrames);

                expect(result.finished, "No result after " + result.frames + " frames, output so far:\n" + result.output).toBe(true);
                expect(result.passed, "Result code " + result.code + ", output:\n" + result.output).toBe(true);
            }, 120000);
        }
    });
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
 * Define one test per Mooneye ROM, running known failures with it.fails
 * @param name Test group name
 * @param roms ROM paths relative to test/roms/mooneye/<folder>
 * @param knownFailures ROMs that fail on the current emulator
 * @param folder Mooneye suite folder, e.g. acceptance or emulator-only/mbc1
 * @param seconds Emulated seconds to wait for a result
 */
export function mooneyeTests(name: string, roms: string[], knownFailures: string[], folder: string = "acceptance", seconds: number = 10){
    for(let rom of knownFailures){
        if(!roms.includes(rom)){
            throw new Error("Known failure isn't in the ROM list: " + rom);
        }
    }

    let maxFrames = seconds * framesPerSecond;

    describe(name, () => {
        for(let rom of roms){
            let test = knownFailures.includes(rom) ? it.fails : it;
            test(rom, async () => {
                let machine = new Machine(loadROM("mooneye/" + folder + "/" + rom));
                let result = await runUntilRegisterResult(machine, maxFrames);

                expect(result.finished, "No result after " + result.frames + " frames, registers: " + formatRegisters(result.registers)).toBe(true);
                expect(result.passed, "Failed, registers: " + formatRegisters(result.registers)).toBe(true);
            }, 120000);
        }
    });
}

export interface ScreenResult {
    matched: boolean;
    frames: number;
    mismatches: number;
    shades: Uint8Array;
}

/**
 * Convert a frame buffer to shades 0-3 (0 = white, 3 = black)
 * @param frame Frame buffer from Machine.getFrame()
 * @return one shade per pixel
 */
export function frameToShades(frame: Uint16Array): Uint8Array{
    let shades = new Uint8Array(frame.length);
    for(let i = 0; i < frame.length; i++){
        let shade = shadeColors.indexOf(frame[i]!);
        if(shade == -1){
            throw new Error("Frame buffer color 0x" + frame[i]!.toString(16) + " isn't one of the DMG shades");
        }
        shades[i] = shade;
    }
    return shades;
}

/**
 * Load a grayscale reference screenshot from test/roms
 * @param relativePath Path relative to test/roms
 * @return one shade per pixel
 */
export function loadReference(relativePath: string): Uint8Array{
    let path = join(romDir, relativePath);
    if(!existsSync(path)){
        throw new Error("Missing reference image: " + path);
    }
    let png = PNG.sync.read(readFileSync(path));
    if(png.width != screenWidth || png.height != screenHeight){
        throw new Error("Reference image is " + png.width + "x" + png.height + ", expected " + screenWidth + "x" + screenHeight);
    }

    // pngjs decodes to 8-bit RGBA; the four DMG grays are 255, 170, 85, 0
    let shades = new Uint8Array(screenWidth * screenHeight);
    for(let i = 0; i < shades.length; i++){
        let gray = png.data[i * 4]!;
        if(gray % 85 != 0 || png.data[(i * 4) + 1] != gray || png.data[(i * 4) + 2] != gray){
            throw new Error("Reference image pixel " + i + " isn't one of the four DMG grays");
        }
        shades[i] = 3 - (gray / 85);
    }
    return shades;
}

/**
 * Write shades to test/output as a grayscale PNG
 * @param name File name without the .png extension
 * @param shades One shade per pixel
 * @return path of the written file
 */
export function writeScreen(name: string, shades: Uint8Array): string{
    let png = new PNG({width: screenWidth, height: screenHeight});
    for(let i = 0; i < shades.length; i++){
        let gray = (3 - shades[i]!) * 85;
        png.data[i * 4] = gray;
        png.data[(i * 4) + 1] = gray;
        png.data[(i * 4) + 2] = gray;
        png.data[(i * 4) + 3] = 255;
    }
    mkdirSync(outputDir, {recursive: true});
    let path = join(outputDir, name + ".png");
    writeFileSync(path, PNG.sync.write(png));
    return path;
}

/**
 * Run until the screen matches the expected shades, or maxFrames elapse
 * @param machine Machine with a test ROM loaded
 * @param expected Expected shades from loadReference()
 * @param maxFrames Frame limit before giving up
 * @return whether it matched, frames run, mismatched pixel count, and the last screen
 */
export async function runUntilScreenMatches(machine: Machine, expected: Uint8Array, maxFrames: number): Promise<ScreenResult>{
    let shades = new Uint8Array(expected.length);
    let mismatches = expected.length;
    for(let frame = 1; frame <= maxFrames; frame++){
        shades = frameToShades(machine.getFrame());
        mismatches = 0;
        for(let i = 0; i < expected.length; i++){
            if(shades[i] != expected[i]){
                mismatches += 1;
            }
        }
        if(mismatches == 0){
            return {matched: true, frames: frame, mismatches, shades};
        }
        if(frame % framesBetweenYields == 0){
            await yieldToEventLoop();
        }
    }
    return {matched: false, frames: maxFrames, mismatches, shades};
}

function yieldToEventLoop(): Promise<void>{
    return new Promise((resolve) => setImmediate(resolve));
}
