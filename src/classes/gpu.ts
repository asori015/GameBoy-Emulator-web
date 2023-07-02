import {MMU} from "./mmu"

export class GPU {
    private readonly VRAM_1 = 0x8000;
    private readonly VRAM_2 = 0x9000;
    private readonly TILE_MAP1 = 0x9800;
    private readonly TILE_MAP2 = 0x9C00;
    private readonly OAM = 0xFE00;
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
    private readonly OBP0 = 0xFF48;
    private readonly OBP1 = 0xFF49;
    private readonly WY = 0xFF4A;
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
                        this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02);
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
        if((this.m_mmu.read(this.LCDC) & 0x20) > 1000){
            let wx = this.m_mmu.read(this.WX);
            let wy = this.m_mmu.read(this.WY);
            if(wx >= 0 && wx <= 166 && wy >=0 && wy <= 143){
                this.renderWindowLine();
            }
        }
        if((this.m_mmu.read(this.LCDC) & 0x02) > 0){
            this.renderObjectLine();
        }
    }

    private renderBackgroundLine(): void{
        let backgroundTileVRAM = (this.m_mmu.read(this.LCDC) & 0x10) > 0x00 ? this.VRAM_1 : this.VRAM_2;
        let backgroundTileMap = (this.m_mmu.read(this.LCDC) & 0x08) > 0x00 ? this.TILE_MAP2 : this.TILE_MAP1;
        let y = (this.m_mmu.read(this.SCY) + this.m_mmu.read(this.LY)) & 0xFF;

        for(let i = 0; i <= 20; i++){
            let x = (this.m_mmu.read(this.SCX) + (i << 3)) & 0xFF;
            
            let tileIndex = ((y >> 3) * 32) + (x >> 3);
            let tileVal = this.m_mmu.read(backgroundTileMap + tileIndex);
            if((this.m_mmu.read(this.LCDC) & 0x10) == 0x00){
                tileVal = (tileVal << 24) >> 24;
            }

            let VRAM_Pointer = backgroundTileVRAM + (tileVal * 16);

            let lBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2));
            let hBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2) + 1);

            for(let j = 7; j >= 0; j--){
                let screenX = j - (this.m_mmu.read(this.SCX) & 0x07) + (i << 3);
                if (screenX < 0) {
                    break;
                }
                let palid = ((hBits & 0x01) << 1) | (lBits & 0x01);
                lBits = lBits >> 1;
                hBits = hBits >> 1;
                if (screenX >= 160) {
                    continue;
                }
                let color = this.colorValues[(this.m_mmu.read(this.BGP) & (0x03 << (palid * 2))) >> (palid * 2)]!;
                this.m_bgDotVals[(i << 3) + j] = palid;

                this.m_frame[(this.m_mmu.read(this.LY) * 160) + screenX] = color;
            }
        }
    }

    private renderWindowLine(): void{
        let windowTileMap = (this.m_mmu.read(this.LCDC) & 0x40) > 0x00 ? this.TILE_MAP2 : this.TILE_MAP1;
        let y = this.m_windowLineCounter - this.m_mmu.read(this.WY);

        if(y < 0){
            return;
        }

        for(let i = 0; i < 21; i++){
            let addr = windowTileMap + ((y >> 3) * 32) + i;
            if(addr >= 0xA000){
                continue;
            }
            // let tileNum = this.m_mmu.read(addr);
        }

        if(this.m_mmu.read(this.LY) >= this.m_mmu.read(this.WY)){
            for(let i = this.m_mmu.read(this.WX) - 7; i < 160; i++){
                let x = i + 7 - this.m_mmu.read(this.WX);
                let y = this.m_windowLineCounter;

                let tileIndex = (Math.floor(y / 8) * 32) + Math.floor(x / 8);
                let VRAM_Pointer = 0;
                
                if((this.m_mmu.read(this.WX) & 0x40) > 0x00){
                    VRAM_Pointer = this.VRAM_1 + (this.m_mmu.read(windowTileMap + tileIndex) * 16);
                }
                else{
                    VRAM_Pointer = this.VRAM_1 + (this.m_mmu.read(windowTileMap + tileIndex) * 16);
                }

                let lBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2));
                let hBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2) + 1);
                let mask = 0x80 >> (x % 8);
                let color = 0;

                if((hBits & mask) > 0x00){
                    if((lBits & mask) > 0x00){
                        color = this.colorValues[(this.m_mmu.read(this.BGP) & 0xC0) >> 6]!;
                        this.m_bgDotVals[i] = 3;
                    }
                    else{
                        color = this.colorValues[(this.m_mmu.read(this.BGP) & 0x30) >> 4]!;
                        this.m_bgDotVals[i] = 2;
                    }
                }
                else{
                    if((lBits & mask) > 0x00){
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
            if(this.m_mmu.read(this.WX) <= 166){
                this.m_windowLineCounter += 1;
            }
        }
    }

    private renderObjectLine(): void{
        let yCount = 0;
        for(let i = 0; i < 40; i++){
            let x = this.m_mmu.read(this.OAM + (i * 4) + 1) - 8;
            let y = this.m_mmu.read(this.OAM + (i * 4)) - this.m_mmu.read(this.LY);
            let attributes = this.m_mmu.read(this.OAM + (i * 4) + 3);
            let VRAM_Pointer = 0;

            if((this.m_mmu.read(this.LCDC) & 0x04) > 0x00){
                if(y < 1 || y > 16){
                    continue;
                }
                if(y < 9){
                    if(attributes & 0x40){
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) & 0xFE) * 16);
                    }
                    else{
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) | 0x01) * 16);
                    }
                }
                else{
                    if(attributes & 0x40){
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) | 0x01) * 16);
                    }
                    else{
                        VRAM_Pointer = this.VRAM_1 + ((this.m_mmu.read(this.OAM + (i * 4) + 2) & 0xFE) * 16);
                    }
                }
            }
            else{
                if(y < 9 || y > 16){
                    continue;
                }
                VRAM_Pointer = this.VRAM_1 + (this.m_mmu.read(this.OAM + (i * 4) + 2) * 16);
            }

            if(attributes & 0x40){
                y -= 1;
            }
            else{
                y = 16 - y;
            }

            let lBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2));
            let hBits = this.m_mmu.read(VRAM_Pointer + ((y % 8) * 2) + 1);
            let mask = 0;

            if((attributes & 0x20) > 0x00){
                mask = 0x01;
            }
            else{
                mask = 0x80;
            }

            for(let j = 0; j < 8; j++){
                if(x >= 0 || x < 160){
                    let color = 0;
                    let pallete = 0;

                    if(attributes & 0x10){
                        pallete = this.OBP1;
                    }
                    else{
                        pallete = this.OBP0;
                    }

                    if(hBits & mask){
                        if(lBits & mask){
                            color = this.colorValues[(this.m_mmu.read(pallete) & 0xC0) >> 6]!;
                        }
                        else{
                            color = this.colorValues[(this.m_mmu.read(pallete) & 0x30) >> 4]!;
                        }
                    }
                    else{
                        if(lBits & mask){
                            color = this.colorValues[(this.m_mmu.read(pallete) & 0x0C) >> 2]!;
                        }
                        else{
                            if(attributes & 0x20){
                                mask = mask << 1;
                            }
                            else{
                                mask = mask >> 1;
                            }
                            x += 1;
                            continue;
                        }
                    }
                    if((attributes & 0x80) > 0x00){
                        if(this.m_bgDotVals[x] == 0){
                            this.m_frame[(this.m_mmu.read(this.LY) * 160) + x] = color;
                        }
                    }
                    else{
                        this.m_frame[(this.m_mmu.read(this.LY) * 160) + x] = color;
                    }
                }

                if((attributes & 0x20) > 0x00){
                    mask = mask << 1;
                }
                else{
                    mask = mask >> 1;
                }

                x += 1;
            }

            yCount += 1;
            if(yCount == 10){
                break;
            }
        }
    }

    // private clearLine(): void{

    // }
}
