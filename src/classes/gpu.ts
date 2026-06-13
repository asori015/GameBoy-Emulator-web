import {MMU} from "./mmu"

export class GPU {
    private readonly VRAM_1 = 0x8000;
    private readonly VRAM_2 = 0x9000;
    private readonly TILE_MAP1 = 0x9800;
    private readonly TILE_MAP2 = 0x9C00;
    private readonly OAM = 0xFE00;
    private readonly IF = 0xFF0F;

    // LCD Register
    private LCDC() {return this.m_mmu.read(0xFF40);}
    private readonly STAT = 0xFF41;
    private SCY() {return this.m_mmu.read(0xFF42);}
    private SCX() {return this.m_mmu.read(0xFF43);}
    private readonly LY = 0xFF44;
    private LYC() {return this.m_mmu.read(0xFF45);}
    //private readonly DMA = 0xFF46;
    private BGP() {return this.m_mmu.read(0xFF47);}
    private readonly OBP0 = 0xFF48;
    private readonly OBP1 = 0xFF49;
    private WY() {return this.m_mmu.read(0xFF4A);}
    private WX() {return this.m_mmu.read(0xFF4B);}

    private m_state;
    private m_clock;
    private m_windowLineCounter;
    private readonly colorValues = [0xFFFF, 0x56B5, 0x29AA, 0x0000];
    private m_bgDotVals: Uint8Array;

    private readonly state = {
        Mode0: 0,
        Mode1: 1,
        Mode2: 2,
        Mode3: 3,
    }

    constructor(
        private readonly m_mmu: MMU,
        private readonly m_frame: Uint16Array
    ){
        this.m_state = this.state.Mode2;
        this.m_clock = 0;
        this.m_windowLineCounter = 0;
        this.m_bgDotVals = new Uint8Array(160 * 144);
    }

    public step(){
        // If LCD is on
        if((this.LCDC() & 0x80) > 0){
            switch(this.m_state){
                case this.state.Mode0: // H-Blank
                    if(this.m_clock >= 455){
                        if(this.m_mmu.read(this.LY) >= 143){
                            this.m_state = this.state.Mode1; // Transition into Mode 1
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x01);
                            this.incrementLineCounters();
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
                            this.incrementLineCounters();
                            if((this.m_mmu.read(this.STAT) & 0x20) > 0){ // Check if STAT interrupt enabled, request interrupt
                                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x02); 
                            }
                        }
                        this.m_clock = -1;
                    }
                    break;
                case this.state.Mode1: // V-Blank
                    if(this.m_clock >= 455){
                        this.incrementLineCounters();
                        if(this.m_mmu.read(this.LY) == 0x9A){
                            this.m_state = this.state.Mode2; // Transition into Mode 2
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) & 0xFC); // Set mode on STAT register
                            this.m_mmu.write(this.STAT, this.m_mmu.read(this.STAT) | 0x02);
                            this.m_mmu.write(this.LY, 0);
                            this.m_windowLineCounter = 0;
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

            if(this.m_mmu.read(this.LY) == this.LYC()){
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
        if((this.LCDC() & 0x01) > 0){
            this.renderBackgroundLine();

            if((this.LCDC() & 0x20) > 0){
                this.renderWindowLine();
            }
        }
        if((this.LCDC() & 0x02) > 0){
            this.renderObjectLine();
        }
    }

    private renderBackgroundLine(): void{
        // LCD registers are stable for the whole scanline, so read them once.
        let lcdc = this.LCDC();
        let scx = this.SCX();
        let scy = this.SCY();
        let bgp = this.BGP();
        let ly = this.m_mmu.read(this.LY);
        let rowBase = ly * 160;

        let backgroundTileVRAM = (lcdc & 0x10) > 0x00 ? this.VRAM_1 : this.VRAM_2;
        let backgroundTileMap = (lcdc & 0x08) > 0x00 ? this.TILE_MAP2 : this.TILE_MAP1;
        let y = (scy + ly) & 0xFF;

        for(let i = 0; i <= 20; i++){
            let x = (scx + (i << 3)) & 0xFF;

            let tileIndex = ((y >> 3) * 32) + (x >> 3);
            let tileVal = this.m_mmu.read(backgroundTileMap + tileIndex);
            if((lcdc & 0x10) == 0x00){
                tileVal = (tileVal << 24) >> 24;
            }

            let VRAM_Pointer = backgroundTileVRAM + (tileVal * 16);

            let lBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2));
            let hBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2) + 1);

            for(let j = 7; j >= 0; j--){
                let screenX = j - (scx & 0x07) + (i << 3);
                if (screenX < 0) {
                    break;
                }

                let palid = ((hBits & 0x01) << 1) | (lBits & 0x01);
                lBits = lBits >> 1;
                hBits = hBits >> 1;
                if (screenX >= 160) {
                    continue;
                }

                let color = this.colorValues[(bgp & (0x03 << (palid * 2))) >> (palid * 2)]!;
                this.m_bgDotVals[rowBase + screenX] = palid;

                this.m_frame[rowBase + screenX] = color;
            }
        }
    }

    private renderWindowLine(): void{
        let wx = this.WX();
        let wy = this.WY();
        if(wx < 0 || wx > 166 || wy < 0 || wy > 143){
            return;
        }

        let lcdc = this.LCDC();
        let windowTileVRAM = (lcdc & 0x10) > 0x00 ? this.VRAM_1 : this.VRAM_2;
        let windowTileMap = (lcdc & 0x40) > 0x00 ? this.TILE_MAP2 : this.TILE_MAP1;
        let y = this.m_windowLineCounter - wy;

        if(y < 0){
            return;
        }

        // LCD registers are stable for the whole scanline, so read them once.
        let bgp = this.BGP();
        let rowBase = this.m_mmu.read(this.LY) * 160;

        for(let i = 0; i <= 20; i++){
            let tileIndex = ((y >> 3) * 32) + i;
            let tileMapAddr = windowTileMap + tileIndex;
            if(tileMapAddr >= 0xA000){
                continue;
            }

            let tileVal = this.m_mmu.read(tileMapAddr);
            if((lcdc & 0x10) == 0x00){
                tileVal = (tileVal << 24) >> 24;
            }
            let VRAM_Pointer = windowTileVRAM + (tileVal * 16);

            let lBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2));
            let hBits = this.m_mmu.read(VRAM_Pointer + ((y & 0x07) * 2) + 1);

            for(let j = 7; j >= 0; j--){
                let screenX = j - 7 + wx + (i << 3);

                let palid = ((hBits & 0x01) << 1) | (lBits & 0x01);
                lBits = lBits >> 1;
                hBits = hBits >> 1;
                if(screenX < 0 || screenX >= 160) {
                    continue;
                }

                let color = this.colorValues[(bgp & (0x03 << (palid * 2))) >> (palid * 2)]!;
                this.m_bgDotVals[rowBase + screenX] = palid;

                this.m_frame[rowBase + screenX] = color;
            }
        }
    }

    private renderObjectLine(): void{
        // LCD registers are stable for the whole scanline, so read them once.
        let lcdc = this.LCDC();
        let ly = this.m_mmu.read(this.LY);
        let rowBase = ly * 160;

        let yCount = 0;
        for(let i = 0; i < 40; i++){
            let x = this.m_mmu.read(this.OAM + (i * 4) + 1) - 8;
            let y = this.m_mmu.read(this.OAM + (i * 4)) - ly;
            let attributes = this.m_mmu.read(this.OAM + (i * 4) + 3);
            let VRAM_Pointer = 0;

            // Object palette is fixed per sprite; resolve it once here.
            let palData = this.m_mmu.read((attributes & 0x10) ? this.OBP1 : this.OBP0);

            if((lcdc & 0x04) > 0x00){
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
                if(x >= 0 && x < 160){
                    let color = 0;

                    if(hBits & mask){
                        if(lBits & mask){
                            color = this.colorValues[(palData & 0xC0) >> 6]!;
                        }
                        else{
                            color = this.colorValues[(palData & 0x30) >> 4]!;
                        }
                    }
                    else{
                        if(lBits & mask){
                            color = this.colorValues[(palData & 0x0C) >> 2]!;
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
                        if(this.m_bgDotVals[rowBase + x] == 0){
                            this.m_frame[rowBase + x] = color;
                        }
                    }
                    else{
                        this.m_frame[rowBase + x] = color;
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

    private incrementLineCounters(): void{
        this.m_mmu.write(this.LY, this.m_mmu.read(this.LY) + 1);
        let wx = this.WX();
        let wy = this.WY();
        if(wx >= 0 && wx <= 166 && wy >= 0 && wy <= 143){
            this.m_windowLineCounter += 1;
        }
    }

    // private clearLine(): void{

    // }
}
