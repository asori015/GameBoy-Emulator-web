import {blarggMemoryTests} from "./harness";

// Blargg's memory access timing tests, second version
blarggMemoryTests("Blargg mem_timing-2", [
    "01-read_timing.gb",
    "02-write_timing.gb",
    "03-modify_timing.gb",
], [
    // Memory reads and writes happen at the wrong cycle within an instruction
    "01-read_timing.gb",
    "02-write_timing.gb",
    "03-modify_timing.gb",
], "mem_timing-2");
