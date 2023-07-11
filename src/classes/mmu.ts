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
    public m_isRomLoaded: boolean;
    private m_isBIOSMapped: boolean;
    private m_isGBC: boolean;

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
        this.m_romSize = 0;
        this.m_ramSize = 0;
        this.m_cartridgeType = 0;
        this.m_mbcValue = 0;
        
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
                    if(addr <= 0x0100){
                        if(addr == 0x100){
                            this.m_isBIOSMapped = false;
                        }
                        else{
                            return BootROMS.BIOS_DMG[addr]!;
                        }
                    }
                    else if(this.m_isGBC && addr >= 0x0200 && addr < 0x0900){
                        return BootROMS.BIOS_CGB[addr]!;
                    }
                }
                
                return this.m_rom[addr]!;
            case 1: // 0x0000 -> 0x3FFF
                this.m_mbcValue;
                return this.m_rom[addr]!;
            case 2:
                return this.m_rom[addr]!;
            case 3: // 0x4000 -> 0x9FFF
                return this.m_rom[addr]!;
            case 4:
                return this.m_addrBus[addr]!;
            case 5:
                return this.m_addrBus[addr]!;
            case 6:
                return this.m_addrBus[addr]!;
            case 7:
                return this.m_addrBus[addr]!;
            default:
                return 0xFF;
        }
        

        // this.m_isGBC;

        // if(this.m_isBIOSMapped){
        //     if(addr <= 0x100){
        //         if(addr == 0x100){
        //             this.m_isBIOSMapped = false;
        //         }
        //         else{
        //             return <number> this.m_BIOS[addr];
        //         }
        //     }
        //     return <number> this.m_addrBus[addr];
        // }
        // else{
        //     return <number> this.m_addrBus[addr];
        // }
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

        this.m_cartridgeType = <number> view[0x0147];
        this.m_romSize = <number> view[0x0148];
        this.m_ramSize = <number> view[0x0149];
        console.log(this.m_cartridgeType);
        console.log(this.m_romSize);
        console.log(this.m_ramSize);
        this.m_ram;


        for(let i = 0; i < view.length; i++){
            this.m_rom[i] = <number> view[i];
        }

        this.m_isRomLoaded = true;
    }
}
