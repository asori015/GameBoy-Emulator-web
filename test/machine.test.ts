import {expect, it} from "vitest";
import {Machine} from "../src/classes/machine";
import {loadROM} from "./harness";

// Uses a test ROM's valid header so the boot ROM hands over, with the entry code replaced
it("getFrame returns while the LCD is off", () => {
    let rom = loadROM("blargg/cpu_instrs/01-special.gb");
    rom.set([0x00, 0xC3, 0x50, 0x01], 0x100); // NOP, JP 0x0150
    rom.set([0x3E, 0x00, 0xE0, 0x40, 0x06, 0x5A, 0x18, 0xFE], 0x150); // LD A,0; LDH (0x40),A; LD B,0x5A; JR -2
    let machine = new Machine(rom);

    for(let i = 0; i < 400; i++){
        machine.getFrame();
    }

    // B is only set after the LCD is turned off
    expect(machine.getRegisters()[0]).toBe(0x5A);
}, 60000);
