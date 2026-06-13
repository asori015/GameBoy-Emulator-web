import {MMU} from "./mmu"

export class Audio {
    // private NR10 = () => {return this.m_mmu.read(0xFF10);}
    // private NR11 = () => {return this.m_mmu.read(0xFF11);}
    // private NR12 = () => {return this.m_mmu.read(0xFF12);}
    // private NR13 = () => {return this.m_mmu.read(0xFF13);}
    // private NR14 = () => {return this.m_mmu.read(0xFF14);}
    // private NR21 = () => {return this.m_mmu.read(0xFF16);}
    // private NR22 = () => {return this.m_mmu.read(0xFF17);}
    // private NR23 = () => {return this.m_mmu.read(0xFF18);}
    // private NR24 = () => {return this.m_mmu.read(0xFF19);}
    // private NR30 = () => {return this.m_mmu.read(0xFF1A);}
    // private NR31 = () => {return this.m_mmu.read(0xFF1B);}
    // private NR32 = () => {return this.m_mmu.read(0xFF1C);}
    // private NR33 = () => {return this.m_mmu.read(0xFF1D);}
    // private NR34 = () => {return this.m_mmu.read(0xFF1E);}
    // private NR41 = () => {return this.m_mmu.read(0xFF20);}
    // private NR42 = () => {return this.m_mmu.read(0xFF21);}
    // private NR43 = () => {return this.m_mmu.read(0xFF22);}
    // private NR44 = () => {return this.m_mmu.read(0xFF23);}
    // private NR50 = () => {return this.m_mmu.read(0xFF24);}
    // private NR51 = () => {return this.m_mmu.read(0xFF25);}
    // private NR52 = () => {return this.m_mmu.read(0xFF26);}
    private cycleCounter: number;
    private frequencyCounter1: number;
    private frequencyCounter2: number;
    private frequencyCounter3: number;
    private frequencyCounter4: number;

    constructor(
        private readonly m_mmu: MMU,
    ){
        this.cycleCounter = 0;
        this.frequencyCounter1 = 0;
        this.frequencyCounter2 = 0;
        this.frequencyCounter3 = 0;
        this.frequencyCounter4 = 0;
    }

    public step(): void{
        this.incrementTimer();
        
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

    private incrementTimer(){
        this.cycleCounter += 1;
        if(--this.frequencyCounter1 <= 0){
            this.frequencyCounter1 = 0x0800 - 0;

            if(this.frequencyCounter2 || this.frequencyCounter3 || this.frequencyCounter4 || this.m_mmu.read(0x0000)){
                // console.log('junk');
            }
        }


        /*
        while (cycles > 0) {
            cycleCounter++;
            cycles --;
            if (--frequencyCounter1 <= 0) {
                frequencyCounter1 = 2048 - frequencyDivisor1;
                waveCounter1 = (waveCounter1 + 1) & 7;
            }
            if (--frequencyCounter2 <= 0) {
                frequencyCounter2 = 2048 - frequencyDivisor2;
                waveCounter2 = (waveCounter2 + 1) & 7;
            }
            frequencyCounter3 -= 2;
            if (frequencyCounter3 <= 0) {
                frequencyCounter3 = 2048 - frequencyDivisor3;
                wavePtr = (wavePtr + 1) & 31;
            }
            if (--frequencyCounter4 <= 0) {
                frequencyCounter4 = (frequencyDivisor4 == 0 ? 8 : (frequencyDivisor4 << 4)) << frequencyShift4;
                int xor = (lfsr4 & 1) ^ ((lfsr4 >> 1) & 1);
                lfsr4 = (lfsr4 >> 1) | (xor << 14);
                if (lowBitWidth4) {
                    lfsr4 &= ~0x40;
                    lfsr4 |= xor << 6;
                }
            }
            if ((cycleCounter & 0xfff) == 0) {
                if (length1 > 0 && useLength1)
                    length1 --;
                if (length2 > 0 && useLength2)
                    length2 --;
                if (length3 > 0 && useLength3)
                    length3 --;
                if (length4 > 0 && useLength4)
                    length4 --;
                if ((cycleCounter & 0x1fff) == 0x1000 && sweepFrequency1 != 0) {
                    sweepCounter1++;
                    if (sweepCounter1 == sweepFrequency1) {
                        sweepCounter1 = 0;
                        int deltaFreq = (sweepAscending1 ? -1 : 1) * (frequencyDivisor1 >> sweepShift1);
                        int newFreq = frequencyDivisor1 + deltaFreq;
                        if (newFreq > 0x7ff) {
                            enable1 = false;
                        } else {
                            frequencyDivisor1 = newFreq;
                        }
                    }
                }
            }
            else if ((cycleCounter & 0x3fff) == 0x3fff) {
                if (envelopeSweep1 != 0) {
                    envelopeCounter1++;
                    if (envelopeCounter1 == envelopeSweep1) {
                        envelopeCounter1 = 0;
                        envelope1 += (envelopeAscending1 ? 1 : -1);
                        envelope1 = Math.min(0xf, Math.max(0, envelope1));
                    }
                }
                if (envelopeSweep2 != 0) {
                    envelopeCounter2++;
                    if (envelopeCounter2 == envelopeSweep2) {
                        envelopeCounter2 = 0;
                        envelope2 += (envelopeAscending2 ? 1 : -1);
                        envelope2 = Math.min(0xf, Math.max(0, envelope2));
                    }
                }
                if (envelopeSweep4 != 0) {
                    envelopeCounter4++;
                    if (envelopeCounter4 == envelopeSweep4) {
                        envelopeCounter4 = 0;
                        envelope4 += (envelopeAscending4 ? 1 : -1);
                        envelope4 = Math.min(0xf, Math.max(0, envelope4));
                    }
                }
            }
        }
        */
        ;
    }
}