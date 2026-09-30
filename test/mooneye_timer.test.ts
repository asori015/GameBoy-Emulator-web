import {mooneyeTests} from "./harness";

// Mooneye acceptance tests for DIV and the timer
mooneyeTests("Mooneye timer", [
    "div_timing.gb",
    "timer/div_write.gb",
    "timer/rapid_toggle.gb",
    "timer/tim00.gb",
    "timer/tim00_div_trigger.gb",
    "timer/tim01.gb",
    "timer/tim01_div_trigger.gb",
    "timer/tim10.gb",
    "timer/tim10_div_trigger.gb",
    "timer/tim11.gb",
    "timer/tim11_div_trigger.gb",
    "timer/tima_reload.gb",
    "timer/tima_write_reloading.gb",
    "timer/tma_write_reloading.gb",
], [
    "div_timing.gb",
    "timer/rapid_toggle.gb",
    "timer/tim00.gb",
    "timer/tim00_div_trigger.gb",
    "timer/tim01_div_trigger.gb",
    "timer/tim10.gb",
    "timer/tim10_div_trigger.gb",
    "timer/tim11.gb",
    "timer/tim11_div_trigger.gb",
    "timer/tima_reload.gb",
    "timer/tima_write_reloading.gb",
    "timer/tma_write_reloading.gb",
]);
