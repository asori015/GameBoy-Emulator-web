export class MMU {
    public m_addrBus: number[];

    constructor(){
        this.m_addrBus = [0xFFFF];
    }

    read(addr: number){
        return this.m_addrBus[addr & 0xFFFF];
    }

    write(addr: number, val: number){
        this.m_addrBus[addr & 0xFFFF] = val & 0xFF;
    }
}