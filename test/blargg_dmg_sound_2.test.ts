import {blarggMemoryTests} from "./harness";

// Blargg's sound hardware tests, part 2: timing, power and wave RAM
blarggMemoryTests("Blargg dmg_sound 07-12", [
    "07-len sweep period sync.gb",
    "08-len ctr during power.gb",
    "09-wave read while on.gb",
    "10-wave trigger while on.gb",
    "11-regs after power.gb",
    "12-wave write while on.gb",
], [
    // Audio isn't implemented yet
    "07-len sweep period sync.gb",
    "08-len ctr during power.gb",
    "09-wave read while on.gb",
    "10-wave trigger while on.gb",
    "11-regs after power.gb",
    "12-wave write while on.gb",
], "dmg_sound");
