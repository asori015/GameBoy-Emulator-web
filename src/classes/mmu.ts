import {BootROMS} from "./bootroms"

export class MMU {
    private readonly m_addrBus;

    constructor(){
        this.m_addrBus = Array(0xFFFF).fill(0)

        this.loadBIOS();
    }

    public read(addr: number) : number{
        return this.m_addrBus[addr & 0xFFFF]!;
    }

    public write(addr: number, val: number){
        this.m_addrBus[addr & 0xFFFF] = val & 0xFF;
    }

    private loadBIOS(){
        for(let i = 0; i < BootROMS.BIOS_DMG.length; i++){
            this.m_addrBus[i] = BootROMS.BIOS_DMG[i];
        }
    }
}
