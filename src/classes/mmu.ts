import {BootROMS} from "./bootroms"

export class MMU {
    private readonly m_addrBus;

    // private readonly cartridge = [0xce, 0xed, 0x66, 0x66, 0xcc, 0x0d, 0x00, 0x0b, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0c, 0x00, 0x0d, 0x00, 0x08, 0x11, 0x1f, 0x88, 0x89, 0x00, 0x0e, 0xdc, 0xcc, 0x6e, 0xe6, 0xdd, 0xdd, 0xd9, 0x99, 0xbb, 0xbb, 0x67, 0x63, 0x6e, 0x0e, 0xec, 0xcc, 0xdd, 0xdc, 0x99, 0x9f, 0xbb, 0xb9, 0x33, 0x3e]

    constructor(
        private readonly file: File,
    ){
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

        

        // for(let i = 0; i < this.cartridge.length; i++){
        //     this.m_addrBus[i + 0x104] = this.cartridge[i]
        // }

        let x = new FileReader();
        x.readAsBinaryString(this.file);

        while(x.readyState != x.DONE){}

        console.log(x.result);
    }
}
