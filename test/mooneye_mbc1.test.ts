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
    // MBC1M multicart cartridges wire the bank bits differently, which isn't emulated
    "multicart_rom_8Mb.gb",
], "emulator-only/mbc1", 20);
