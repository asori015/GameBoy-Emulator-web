import {blarggMemoryTests} from "./harness";

// Blargg's sound hardware tests, part 1: registers, length counters and sweep
blarggMemoryTests("Blargg dmg_sound 01-06", [
    "01-registers.gb",
    "02-len ctr.gb",
    "03-trigger.gb",
    "04-sweep.gb",
    "05-sweep details.gb",
    "06-overflow on trigger.gb",
], [
    // Audio isn't implemented yet
    "01-registers.gb",
    "02-len ctr.gb",
    "03-trigger.gb",
    "04-sweep.gb",
    "05-sweep details.gb",
    "06-overflow on trigger.gb",
], "dmg_sound");
