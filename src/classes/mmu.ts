export class MMU {
    public m_addrBus: number[];

    constructor(){
        this.m_addrBus = Array(0xFFFF).fill(0)
    }

    read(addr: number) : number{
        return this.m_addrBus[addr & 0xFFFF]!;
    }

    write(addr: number, val: number){
        this.m_addrBus[addr & 0xFFFF] = val & 0xFF;
    }
}
