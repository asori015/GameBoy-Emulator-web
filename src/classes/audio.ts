import {MMU} from "./mmu"

export class Audio {


    constructor(
        private readonly m_mmu: MMU,
    ){
        // this.fallingEdgeDelay = false;
        // this.pendingOverflow = false;
    }

    public step(): void{
        this.m_mmu;
        // if(this.pendingOverflow){
        //     this.m_mmu.write(this.TIMA, this.m_mmu.read(this.TMA));
        //     this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x04);
        //     this.pendingOverflow = false;
        // }

        // // Increment DIV
        // let div = (this.m_mmu.read(this.DIV) << 8) + this.m_mmu.read(this.DIV - 1);
        // div += 1;
        // this.m_mmu.write(this.DIV, div >> 8);
        // this.m_mmu.write(this.DIV - 1, div);

        // this.updateEdge(div);
    }
}