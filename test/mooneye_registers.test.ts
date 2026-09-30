import {mooneyeTests} from "./harness";

// Mooneye acceptance tests for register bits and the DMG state after the boot ROM
mooneyeTests("Mooneye registers", [
    "bits/mem_oam.gb",
    "bits/reg_f.gb",
    "bits/unused_hwio-GS.gb",
    "boot_div-dmgABCmgb.gb",
    "boot_hwio-dmgABCmgb.gb",
    "boot_regs-dmgABC.gb",
], [
    "boot_div-dmgABCmgb.gb",
    "boot_hwio-dmgABCmgb.gb",
]);
