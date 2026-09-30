import {mooneyeTests} from "./harness";

// Mooneye emulator-only tests for the MBC1 cartridge controller, bits_ramg needs about 12 emulated seconds
mooneyeTests("Mooneye MBC1", [
    "bits_bank1.gb",
    "bits_bank2.gb",
    "bits_mode.gb",
    "bits_ramg.gb",
    "multicart_rom_8Mb.gb",
    "ram_256kb.gb",
    "ram_64kb.gb",
    "rom_16Mb.gb",
    "rom_1Mb.gb",
    "rom_2Mb.gb",
    "rom_4Mb.gb",
    "rom_512kb.gb",
    "rom_8Mb.gb",
], [
    // These need the second bank register at 0x4000-0x5FFF, which isn't implemented for MBC1
    "bits_bank2.gb",
    "multicart_rom_8Mb.gb",
    "ram_256kb.gb",
    "rom_16Mb.gb",
    "rom_8Mb.gb",
], "emulator-only/mbc1", 20);
