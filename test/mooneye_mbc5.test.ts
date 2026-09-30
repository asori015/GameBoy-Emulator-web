import {mooneyeTests} from "./harness";

// Mooneye emulator-only tests for the MBC5 cartridge controller
mooneyeTests("Mooneye MBC5", [
    "rom_16Mb.gb",
    "rom_1Mb.gb",
    "rom_2Mb.gb",
    "rom_32Mb.gb",
    "rom_4Mb.gb",
    "rom_512kb.gb",
    "rom_64Mb.gb",
    "rom_8Mb.gb",
], [
    // MBC5 isn't mapped to a cartridge type yet
    "rom_16Mb.gb",
    "rom_1Mb.gb",
    "rom_2Mb.gb",
    "rom_32Mb.gb",
    "rom_4Mb.gb",
    "rom_512kb.gb",
    "rom_64Mb.gb",
    "rom_8Mb.gb",
], "emulator-only/mbc5", 20);
