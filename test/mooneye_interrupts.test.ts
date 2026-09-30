import {mooneyeTests} from "./harness";

// Mooneye acceptance tests for interrupts, EI/DI, and HALT
mooneyeTests("Mooneye interrupts", [
    "di_timing-GS.gb",
    "ei_sequence.gb",
    "ei_timing.gb",
    "halt_ime0_ei.gb",
    "halt_ime0_nointr_timing.gb",
    "halt_ime1_timing.gb",
    "halt_ime1_timing2-GS.gb",
    "if_ie_registers.gb",
    "intr_timing.gb",
    "rapid_di_ei.gb",
    "reti_intr_timing.gb",
    "interrupts/ie_push.gb",
], [
    "ei_sequence.gb",
    "ei_timing.gb",
    "halt_ime0_nointr_timing.gb",
    "halt_ime1_timing2-GS.gb",
    "if_ie_registers.gb",
    "intr_timing.gb",
    "rapid_di_ei.gb",
    "reti_intr_timing.gb",
    "interrupts/ie_push.gb",
]);
