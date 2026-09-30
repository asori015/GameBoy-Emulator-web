import {blarggMemoryTests} from "./harness";

// Blargg's memory access timing tests, second version
blarggMemoryTests("Blargg mem_timing-2", [
    "01-read_timing.gb",
    "02-write_timing.gb",
    "03-modify_timing.gb",
], [
    // These hang without reporting, like mem_timing
    "01-read_timing.gb",
    "02-write_timing.gb",
    "03-modify_timing.gb",
], "mem_timing-2");
