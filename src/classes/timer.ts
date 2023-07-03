import {MMU} from "./mmu"

export class Timer {
    private readonly DIV = 0xFF04;
    private readonly TIMA = 0xFF05;
    private readonly TMA = 0xFF06;
    private readonly TAC = 0xFF07;
    private readonly IF = 0xFF0F;

    private readonly DIV_BIT = [7, 1, 3, 5];

    private fallingEdgeDelay = false;
    private pendingOverflow = false;

    constructor(
        private readonly m_mmu: MMU,
    ){
        this.fallingEdgeDelay = false;
        this.pendingOverflow = false;
    }

    public step(): void{
        if(this.pendingOverflow){
            this.m_mmu.write(this.TIMA, this.m_mmu.read(this.TMA));
            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x04);
            this.pendingOverflow = false;
        }

        // Increment DIV
        let div = (this.m_mmu.read(this.DIV) << 8) + this.m_mmu.read(this.DIV - 1);
        div += 1;
        this.m_mmu.write(this.DIV, div >> 8);
        this.m_mmu.write(this.DIV - 1, div);

        this.updateEdge(div);
    }

    private updateEdge(div: number){
        let temp1 = this.m_mmu.read(this.TAC);
        let temp2 = this.DIV_BIT[this.m_mmu.read(this.TAC) & 0x03];
        temp1; temp2;

        if((this.m_mmu.read(this.TAC) & 0x04) == 0x00){
            return;
        }

        let bit = (div & (0x04 << this.DIV_BIT[this.m_mmu.read(this.TAC) & 0x03]!)) != 0;
        if(this.fallingEdgeDelay && !bit){
            let tima = this.m_mmu.read(this.TIMA) + 1;
            this.m_mmu.write(this.TIMA, tima);
            if(tima > 0xFF){
                this.pendingOverflow = true;
            }
        }
        this.fallingEdgeDelay = bit;
    }
}
