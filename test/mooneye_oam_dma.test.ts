import {mooneyeTests} from "./harness";

// Mooneye acceptance tests for OAM DMA
mooneyeTests("Mooneye OAM DMA", [
    "oam_dma/basic.gb",
    "oam_dma/reg_read.gb",
    "oam_dma/sources-GS.gb",
    "oam_dma_restart.gb",
    "oam_dma_start.gb",
    "oam_dma_timing.gb",
], [
    "oam_dma/sources-GS.gb",
    "oam_dma_restart.gb",
    "oam_dma_start.gb",
    "oam_dma_timing.gb",
]);
