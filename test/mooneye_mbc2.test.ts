import {mooneyeTests} from "./harness";

// Mooneye emulator-only tests for the MBC2 cartridge controller
mooneyeTests("Mooneye MBC2", [
    "bits_ramg.gb",
    "bits_romb.gb",
    "bits_unused.gb",
    "ram.gb",
    "rom_1Mb.gb",
    "rom_2Mb.gb",
    "rom_512kb.gb",
], [
], "emulator-only/mbc2", 20);
