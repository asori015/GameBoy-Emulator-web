import {BootROMS} from "./bootroms"

export class MMU {
    private readonly m_BIOS;
    private readonly m_addrBus;
    public m_isRomLoaded: boolean;
    private m_isBIOSMapped: boolean;

    constructor(
        private readonly file: File,
    ){
        this.m_BIOS = Array(0x0100).fill(0);
        this.m_addrBus = Array(0xFFFF).fill(0);
        this.m_isRomLoaded = false;
        this.m_isBIOSMapped = true;

        let reader = new FileReader();
        reader.onload = () => this.loadROM(<ArrayBuffer> reader.result);
        reader.readAsArrayBuffer(this.file);

        this.loadBIOS();
    }

    public read(addr: number) : number{
        if(this.m_isBIOSMapped){
            if(addr <= 0x100){
                if(addr == 0x100){
                    this.m_isBIOSMapped = false;
                }
                else{
                    return this.m_BIOS[addr];
                }
            }
            return this.m_addrBus[addr & 0xFFFF]!;
        }
        else{
            return this.m_addrBus[addr & 0xFFFF]!;
        }
    }

    public write(addr: number, val: number){
        this.m_addrBus[addr & 0xFFFF] = val & 0xFF;
    }

    private loadBIOS(){
        for(let i = 0; i < BootROMS.BIOS_DMG.length; i++){
            this.m_BIOS[i] = BootROMS.BIOS_DMG[i];
        }
    }

    private loadROM(buffer: ArrayBuffer){
        const view = new Uint8Array(buffer);

        for(let i = 0; i < view.length; i++){
            this.m_addrBus[i] = view[i];
        }

        this.m_isRomLoaded = true;
    }
}
