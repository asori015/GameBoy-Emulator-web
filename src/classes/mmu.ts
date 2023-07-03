import {BootROMS} from "./bootroms"

export class MMU {
    private readonly m_BIOS;
    private readonly m_addrBus;
    public m_isRomLoaded: boolean;
    private m_isBIOSMapped: boolean;
    private m_isGBC: boolean;

    constructor(
        private readonly file: File,
    ){
        this.m_BIOS = new Uint8Array(0x0100).fill(0);
        this.m_addrBus = new Uint8Array(0x10000).fill(0);
        this.m_isRomLoaded = false;
        this.m_isBIOSMapped = true;
        this.m_isGBC = false; // TODO
        

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
        // switch(addr >> 13){
        //     case 0:
        //         if(this.m_isBIOSMapped && addr < 0x0100){
        //             return this.m_BIOS[addr]!;
        //         }
        //         if(this.m_isBIOSMapped && this.m_isGBC && addr >= 0x0200 && addr < 0x0900){
        //             return this.m_BIOS[addr - 0x0100]!;
        //         }
        //     case 1: // 0x0000 -> 0x3FFF
                
        //     case 2:
        //     case 3: // 0x4000 -> 0x9FFF
        //         break;
        //     case 4:
        //         break;
        //     case 5:
        //         break;
        //     case 6:
        //         break;
        //     case 7:
        //         break;
        //     default:
        //         return 0xFF;
        // }
        this.m_isGBC;

        if(this.m_isBIOSMapped){
            if(addr <= 0x100){
                if(addr == 0x100){
                    this.m_isBIOSMapped = false;
                }
                else{
                    return <number> this.m_BIOS[addr];
                }
            }
            return <number> this.m_addrBus[addr];
        }
        else{
            return <number> this.m_addrBus[addr];
        }
    }

    public write(addr: number, val: number){
        if(addr >= 0x8000){
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

        for(let i = 0; i < view.length; i++){
            this.m_addrBus[i] = <number> view[i];
        }

        this.m_isRomLoaded = true;
    }
}
