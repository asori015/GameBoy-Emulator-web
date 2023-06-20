import {MMU} from "./mmu"

export class GPU {
    private readonly VRAM_1 = 0x8000;
    private readonly VRAM_2 = 0x9000;
    private readonly TILE_MAP1 = 0x9800;
    private readonly TILE_MAP2 = 0x9C00;
    //private readonly OAM = 0xFE00;
    private readonly IF = 0xFF0F;

    // LCD Register
    private readonly LCDC = 0xFF40;
    private readonly STAT = 0xFF41;
    private readonly SCY = 0xFF42;
    private readonly SCX = 0xFF43;
    private readonly LY = 0xFF44;
    private readonly LYC = 0xFF45;
    //private readonly DMA = 0xFF46;
    private readonly BGP = 0xFF47;
    //private readonly OBP0 = 0xFF48;
    //private readonly OBP1 = 0xFF49;
    //private readonly WY = 0xFF4A;
    private readonly WX = 0xFF4B;

    private m_state;
    private m_clock;
    private m_windowLineCounter;
    private readonly colorValues = [0xFFFF, 0x56B5, 0x29AA, 0x0000];
    private m_bgDotVals;

    private readonly state = {
        Mode0: 0,
        Mode1: 1,
        Mode2: 2,
        Mode3: 3,
    }

    constructor(
        private readonly m_mmu: MMU,
        private readonly m_frame: number[]
    ){
        this.m_state = this.state.Mode2;
        this.m_clock = 0;
        this.m_windowLineCounter = 0;
        this.m_bgDotVals = new Array(160).fill(0);
    }

    public step(){
        // If LCD is on
        if((this.m_mmu.read(this.LCDC) & 0x80) > 0){
            switch(this.m_state){
                case this.state.Mode0: // H-Blank
                    if(this.m_clock >= 455){
                        if(this.m_mmu.read(this.LY) >= 143){
                            this.m_state = this.state.Mode1; // Transition into Mode 1
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x01);
                            this.m_mmu.write(this.LY, this.m_mmu.read(this.LY) + 1);
                            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x01);
                            if((this.m_mmu.read(this.STAT) & 0x10) > 0){ // Check if STAT interrupt enabled, request interrupt
                                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);  
                            }
                            this.m_windowLineCounter = 0;
                        }
                        else{
                            this.m_state = this.state.Mode2; // Transition into Mode 2
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x02);
                            this.m_mmu.write(this.LY, this.m_mmu.read(this.LY) + 1);
                            if((this.m_mmu.read(this.STAT) & 0x20) > 0){ // Check if STAT interrupt enabled, request interrupt
                                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02); 
                            }
                        }
                        this.m_clock = -1;
                    }
                    break;
                case this.state.Mode1: // V-Blank
                    if(this.m_clock >= 455){
                        this.m_mmu.write(this.LY, this.m_mmu.read(this.LY) + 1);
                        if(this.m_mmu.read(this.LY) == 0x9A){
                            this.m_state = this.state.Mode2; // Transition into Mode 2
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x02);
                            this.m_mmu.write(this.LY, 0);
                            if((this.m_mmu.read(this.STAT) & 0x20) > 0){ // Check if STAT interrupt enabled, request interrupt
                                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);  
                            }
                        }
                        this.m_clock = -1;
                    }
                    break;
                case this.state.Mode2: // OAM Scan
                    if(this.m_clock >= 79){
                        this.m_state = this.state.Mode3; // Transition into Mode 3
                        this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x03); // Set mode on STAT register
                    }
                    break;
                case this.state.Mode3: // Drawing Pixels
                    if(this.m_clock >= 251){
                        // Transition into H-Blank
                        this.m_state = this.state.Mode0; // Transition into Mode 0
                        this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                        if((this.m_mmu.read(this.STAT) & 0x80) > 0){ // Check if STAT interrupt enabled, request interrupt
                            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);  
                        }
                        this.renderLine();
                    }
                    break;
                default:
                    break;
            }

            if(this.m_mmu.read(this.LY) == this.m_mmu.read(this.LYC)){
                if((this.m_mmu.read(this.STAT) & 0x04) == 0){
                    if((this.m_mmu.read(this.STAT) & 0x40) > 0){
                        this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) & 0x02);
                    }
                    this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x04);
                }
            }
            else{
                this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFB);
            }

            this.m_clock += 1;
        }
    }

    private renderLine(): void{
        // clearLine();
        if((this.m_mmu.read(this.LCDC) & 0x01) > 0){
            this.renderBackgroundLine();
        }
        if((this.m_mmu.read(this.LCDC) & 0x20) > 0){
            this.renderWindowLine();
        }
        if((this.m_mmu.read(this.LCDC) & 0x02) > 0){
            this.renderObject();
        }
    }

    private renderBackgroundLine(): void{
        for(let i = 0; i < 160; i++){
            let x = (this.m_mmu.read(this.SCX) + i) % 256;
            let y = (this.m_mmu.read(this.SCY) + this.m_mmu.read(this.LY)) % 256;
            
            let tileIndex = (Math.floor(y / 8) * 32) + Math.floor(x / 8);
            let VRAM_Pointer = 0;
            
            if((this.m_mmu.read(this.LCDC) & 0x10) > 0){
                if((this.m_mmu.read(this.LCDC) & 0x08) > 0){
                    VRAM_Pointer = this.VRAM_1 + (this.m_mmu.read(this.TILE_MAP2 + tileIndex) * 16);
                }
                else{
                    VRAM_Pointer = this.VRAM_1 + (this.m_mmu.read(this.TILE_MAP1 + tileIndex) * 16);
                }
            }
            else{
                if((this.m_mmu.read(this.LCDC) & 0x08) > 0){
                    VRAM_Pointer = this.VRAM_2 + ((this.m_mmu.read(this.TILE_MAP2 + tileIndex) * 16) << 24 >> 24);
                }
                else{
                    VRAM_Pointer = this.VRAM_2 + ((this.m_mmu.read(this.TILE_MAP1 + tileIndex) * 16) << 24 >> 24);
                }
            }

            let lBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2));
            let hBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2) + 1);
            let mask = 0x80 >> (x % 8);
            let color = 0;

            if((hBits & mask) > 0){
                if((lBits & mask) > 0){
                    color = this.colorValues[(this.m_mmu.read(this.BGP) & 0xC0) >> 6]!;
                    this.m_bgDotVals[i] = 3;
                }
                else{
                    color = this.colorValues[(this.m_mmu.read(this.BGP) & 0x30) >> 4]!;
                    this.m_bgDotVals[i] = 2;
                }
            }
            else{
                if((lBits & mask) > 0){
                    color = this.colorValues[(this.m_mmu.read(this.BGP) & 0x0C) >> 2]!;
                    this.m_bgDotVals[i] = 1;
                }
                else{
                    color = this.colorValues[(this.m_mmu.read(this.BGP) & 0x03)]!;
                    this.m_bgDotVals[i] = 0;
                }
            }

            this.m_frame[(this.m_mmu.read(this.LY) * 160) + i] = color;
        }
    }

    private renderWindowLine(): void{
        if(this.m_mmu.read(this.WX) < 166){
            this.m_windowLineCounter += 1;
        }
    }

    private renderObject(): void{

    }

    // private clearLine(): void{

    // }
}
