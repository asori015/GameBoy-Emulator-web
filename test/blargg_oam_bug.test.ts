import {blarggMemoryTests} from "./harness";

// Blargg's tests for the DMG OAM corruption bug
blarggMemoryTests("Blargg oam_bug", [
    "1-lcd_sync.gb",
    "2-causes.gb",
    "3-non_causes.gb",
    "4-scanline_timing.gb",
    "5-timing_bug.gb",
    "6-timing_no_bug.gb",
    "7-timing_effect.gb",
    "8-instr_effect.gb",
], [
    // The OAM corruption bug isn't emulated, so only the tests checking it doesn't happen pass
    "1-lcd_sync.gb",
    "2-causes.gb",
    "4-scanline_timing.gb",
    "5-timing_bug.gb",
    "7-timing_effect.gb",
    "8-instr_effect.gb",
], "oam_bug");
