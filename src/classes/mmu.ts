import {BootROMS} from "./bootroms"

export class MMU {
    private readonly m_BIOS;
    private readonly m_addrBus;
    private readonly m_rom;
    private readonly m_ram;
    private m_romSize: number;
    private m_ramSize: number;
    private m_cartridgeType: number;
    private m_mbcValue: number;
    private m_romBank: number;
    private m_ramBank: number;
    private m_mbc3RtcReg: number;
    private m_mbc3RtcLatch: number;
    public m_isRomLoaded: boolean;
    private m_isBIOSMapped: boolean;
    private m_isGBC: boolean;
    private m_ramEnabled: boolean;
    private m_mbc1BankMode: boolean;

    constructor(
        private readonly file: File,
    ){
        this.m_BIOS = new Uint8Array(0x0100).fill(0);
        this.m_addrBus = new Uint8Array(0x10000).fill(0);
        this.m_rom = new Uint8Array(0x800000).fill(0);
        this.m_ram = new Uint8Array(0x020000).fill(0);
        this.m_isRomLoaded = false;
        this.m_isBIOSMapped = true;
        this.m_isGBC = false; // TODO
        this.m_ramEnabled = false;
        this.m_mbc1BankMode = false;
        this.m_romSize = 0;
        this.m_ramSize = 0;
        this.m_cartridgeType = 0;
        this.m_mbcValue = 0;
        this.m_romBank = 1;
        this.m_ramBank = 0;
        this.m_mbc3RtcReg = 0;
        this.m_mbc3RtcLatch = 0;
        
        let reader = new FileReader();
        reader.onload = () => this.loadROM(<ArrayBuffer> reader.result);
        reader.readAsArrayBuffer(this.file);

        this.loadBIOS();
    }

    /**
     * Read from RAM at requested address
     * @param addr Address to RAM
     * @return value at requested address
     */
    public read(addr: number) : number{
        switch(addr >> 13){
            case 0:
                if(this.m_isBIOSMapped){
                    if(addr == 0x0100){
                        this.m_isBIOSMapped = false;
                    }
                    else if(this.m_isGBC){
                        if(addr < 0x0100){
                            return BootROMS.BIOS_CGB[addr]!;
                        }
                        else if(addr >= 0x0200 && addr < 0x0900){
                            return BootROMS.BIOS_CGB[addr - 0x0100]!;
                        }
                    }
                    else{
                        if(addr < 0x0100){
                            return BootROMS.BIOS_DMG[addr]!;
                        }
                    }
                }
            case 1: // 0x0000 -> 0x3FFF
                if(this.m_mbcValue == 1){
                    if(this.m_mbc1BankMode){
                        return this.m_rom[addr | ((this.m_romBank & ~0x1F) << 14)]!;
                    }
                }
                else{
                    return this.m_rom[addr]!;
                }
            case 2:
            case 3: // 0x4000 -> 0x7FFF
                return this.m_rom[(addr & 0x3FFF) | (this.m_romBank << 14)]!;
            case 4: // 0x8000 -> 0x9FFF
                return this.m_addrBus[addr]!;
            case 5: // 0xA000 -> 0xBFFF
                switch(this.m_mbcValue){
                    case 1:
                        return 0xFF;
                    case 2:
                        return 0xFF;
                    case 3:
                        switch(this.m_mbc3RtcReg){
                            case 0:
                                return this.m_ram[(this.m_ramBank << 13) | (addr & 0x1FFF)]!;
                            case 8:
                            case 9:
                            case 10:
                            case 11:
                            case 12:
                                return 0xFF;
                        }
                        return 0xFF;
                    case 5:
                        if(this.m_ramEnabled){
                            return this.m_ram[(this.m_ramBank << 13) | (addr & 0x1FFF)]!;
                        }
                }
                return 0xFF;
            case 6:
            case 7: // 0xC000 -> 0xFFFF
                return this.m_addrBus[addr]!;
            default:
                return 0xFF;
        }
    }

    public write(addr: number, val: number){
        switch(addr >> 13){
            case 0: // 0x0000->0x1fff
                switch(this.m_mbcValue){
                    case 1:
                    case 3:
                    case 5: // Enable RAM if low nibble is 0x0A, else disable
                        this.m_ramEnabled = (val & 0x0F) == 0x0A;
                        break;
                    case 2: // Enable/disable RAM if high address byte is even
                        if(((addr >> 8) & 0x01) == 0){
                            this.m_ramEnabled = (val & 0x0F) == 0x0A;
                        }
                        else{
                            val &= 0x0F;
                            if(val == 0){
                                val = 1;
                            }
                            this.m_romBank = val;
                        }
                        break;
                }
                break;
            case 1: // 0x2000 -> 0x3fff
                switch(this.m_mbcValue){
                    case 1: // Set ROM bank, or at least lower 5 bits
                        val &= 0x1F;
                        if(val == 0){
                            val = 1;
                        }
                        this.m_romBank &= ~0x1F;
                        this.m_romBank |= val;
                        break;
                    case 2: // Set ROM bank, but only if high address byte is odd
                        if(((addr >> 8) & 0x01) == 0){
                            this.m_ramEnabled = (val & 0x0F) == 0x0A;
                        }
                        else{
                            val &= 0x0F;
                            if(val == 0){
                                val = 1;
                            }
                            this.m_romBank = val;
                        }
                        break;
                    case 3: // Set ROM bank
                        val &= 0x7F;
                        if(val == 0){
                            val = 1;
                        }
                        this.m_romBank = val;
                        break;
                    case 5: // Set low 8 bits of ROM bank (allow 0)
                        if((addr & 0x1000) == 0){
                            this.m_romBank &= ~0xFF;
                            this.m_romBank |= val;
                        }
                        else{
                            this.m_romBank &= 0xFF;
                            this.m_romBank |= (val & 0x01) << 8;
                        }
                        break;
                }
                this.m_romBank %= this.m_romSize;
                break;
            case 2: // 0x4000 -> 0x5fff
                switch(this.m_mbcValue){
                    case 1:
                        break; //TODO
                    case 3: // Write RAM bank if <= 3 or enable RTC registers
                        if(val <= 0x03){
                            this.m_ramBank = val;
                            this.m_mbc3RtcReg = 0;
                        }
                        else if(val >= 0x08 && val <= 0x0C){
                            this.m_mbc3RtcReg = val;
                        }
                        break;
                    case 5: // Write RAM bank
                        this.m_ramBank = val & 0x0F;
                        break;
                }
                this.m_romBank %= this.m_romSize;
                this.m_ramBank %= Math.max(1, this.m_ramSize);
                break;
            case 3:
                switch(this.m_mbcValue){
                    case 1: // Set ROM/RAM mode
                        this.m_mbc1BankMode = (val & 0x01) != 0;
                        break;
                    case 3: // Latch RTC
                        if((this.m_mbc3RtcLatch & 0x01) == 0 && val == 0){
                            this.m_mbc3RtcLatch += 1;
                        }
                        else if((this.m_mbc3RtcLatch & 1) != 0 && val == 1){
                            this.m_mbc3RtcLatch = (this.m_mbc3RtcLatch + 1) & 0x03;
                        }
                        break;
                }
                break;
            case 4:
            case 5:
            case 6:
            case 7:
                if(addr == 0xFF46){ // DMA transfer
                    addr = val << 8;
                    for(let i = 0; i < 160; i++){
                        this.m_addrBus[0xFE00 + i] = this.m_addrBus[addr + i]!;
                    }
                }
                else{
                    this.m_addrBus[addr] = val;
                }
        }
    }

    private loadBIOS(){
        for(let i = 0; i < BootROMS.BIOS_DMG.length; i++){
            this.m_BIOS[i] = <number> BootROMS.BIOS_DMG[i];
        }
    }

    private loadROM(buffer: ArrayBuffer){
        const view = new Uint8Array(buffer);

        this.m_cartridgeType = <number> view[0x0147];
        this.m_romSize = <number> view[0x0148];
        this.m_ramSize = <number> view[0x0149];

        this.m_romSize = (1 << (this.m_romSize + 1));
        switch(this.m_ramSize){
            case 2:
                this.m_ramSize = 1;
                break;
            case 3:
                this.m_ramSize = 4;
                break;
            case 4:
                this.m_ramSize = 16;
                break;
            case 5:
                this.m_ramSize = 8;
                break;
            default:
                this.m_ramSize = 0;
                break;
        }

        console.log(this.m_cartridgeType);

        if(this.m_cartridgeType == 3){
            this.m_mbcValue = 1;
        }
        if(this.m_cartridgeType == 19){
            this.m_mbcValue = 3;
        }

        for(let i = 0; i < view.length; i++){
            this.m_rom[i] = <number> view[i];
        }

        this.m_isRomLoaded = true;
    }
}
