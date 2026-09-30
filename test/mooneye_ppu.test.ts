import {mooneyeTests} from "./harness";

// Mooneye acceptance tests for PPU timing and STAT interrupts
mooneyeTests("Mooneye PPU", [
    "ppu/hblank_ly_scx_timing-GS.gb",
    "ppu/intr_1_2_timing-GS.gb",
    "ppu/intr_2_0_timing.gb",
    "ppu/intr_2_mode0_timing.gb",
    "ppu/intr_2_mode0_timing_sprites.gb",
    "ppu/intr_2_mode3_timing.gb",
    "ppu/intr_2_oam_ok_timing.gb",
    "ppu/lcdon_timing-GS.gb",
    "ppu/lcdon_write_timing-GS.gb",
    "ppu/stat_irq_blocking.gb",
    "ppu/stat_lyc_onoff.gb",
    "ppu/vblank_stat_intr-GS.gb",
], [
    "ppu/hblank_ly_scx_timing-GS.gb",
    "ppu/intr_2_0_timing.gb",
    "ppu/intr_2_mode0_timing.gb",
    "ppu/intr_2_mode0_timing_sprites.gb",
    "ppu/intr_2_mode3_timing.gb",
    "ppu/intr_2_oam_ok_timing.gb",
    "ppu/lcdon_timing-GS.gb",
    "ppu/lcdon_write_timing-GS.gb",
    "ppu/stat_irq_blocking.gb",
    "ppu/stat_lyc_onoff.gb",
    "ppu/vblank_stat_intr-GS.gb",
]);
