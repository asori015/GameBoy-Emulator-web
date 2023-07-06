import {MMU} from "./mmu"

export class Keyboard{
    public m_jState1: number;
    public m_jState2: number;

    private readonly P1 = 0xFF00;
    private readonly IF = 0xFF0F;

    constructor(
        private m_mmu: MMU,
    ){
        addEventListener("keydown", (event) => {
            this.getKeyDown(event);
        });

        addEventListener("keyup", (event) => {
            this.getKeyUp(event);
        });

        this.m_jState1 = 0xFF;
        this.m_jState2 = 0xFF;
    }

    public step(){
        if((this.m_mmu.read(this.P1) & 0x10) == 0){
            this.m_mmu.write(this.P1, (this.m_mmu.read(this.P1) & 0xF0) + (this.m_jState1 & 0x0F));
        }
        else{
            this.m_mmu.write(this.P1, (this.m_mmu.read(this.P1) & 0xF0) + (this.m_jState2 & 0x0F));
        }
    }

    private getKeyDown(event: KeyboardEvent){
        if(!event.repeat){
            if(event.code == "ArrowRight"){
                this.m_jState1 &= 0xFE;
            }
            else if(event.code == "ArrowLeft"){
                this.m_jState1 &= 0xFD;
            }
            else if(event.code == "ArrowUp"){
                this.m_jState1 &= 0xFB;
            }
            else if(event.code == "ArrowDown"){
                this.m_jState1 &= 0xF7;
            }
            else if(event.code == "KeyS"){
                this.m_jState2 &= 0xFE;
            }
            else if(event.code == "KeyA"){
                this.m_jState2 &= 0xFD;
            }
            else if(event.code == "ShiftRight"){
                this.m_jState2 &= 0xFB;
            }
            else if(event.code == "Enter"){
                this.m_jState2 &= 0xF7;
            }

            this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
        }
    }

    private getKeyUp(event: KeyboardEvent){
        if(event.code == "ArrowRight"){
            this.m_jState1 |= 0x01;
        }
        else if(event.code == "ArrowLeft"){
            this.m_jState1 |= 0x02;
        }
        else if(event.code == "ArrowUp"){
            this.m_jState1 |= 0x04;
        }
        else if(event.code == "ArrowDown"){
            this.m_jState1 |= 0x08;
        }
        else if(event.code == "KeyS"){
            this.m_jState2 |= 0x01;
        }
        else if(event.code == "KeyA"){
            this.m_jState2 |= 0x02;
        }
        else if(event.code == "ShiftRight"){
            this.m_jState2 |= 0x04;
        }
        else if(event.code == "Enter"){
            this.m_jState2 |= 0x08;
        }
    }
}
