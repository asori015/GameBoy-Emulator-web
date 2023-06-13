import {MMU} from "./mmu"

export class CPU {
    private m_registers = [8].fill(0);

    private m_instructionMethods1 = [
        this.LD_R_to_R,
        this.LD_8_Bit
    ]

    // private m_instructionMethods2 = [
    //     this.LD_R_to_R
    // ]

    public m_jstate1: number;
    public m_jstate2: number;
    public m_BIOSMapped: boolean;

    private m_PC: number;
    private m_SP: number;
    private m_clock: number;

    private IME: boolean;
    private m_cbPrefix: boolean;
    private m_isHalted: boolean;
    private m_falligEdgeDelay: boolean;

    readonly P1 = 0xFF00;
    readonly DIV = 0xFF03;
    readonly TIMA = 0xFF05;
    readonly TMA = 0xFF06;
    readonly TAC = 0xFF07;
    readonly IF = 0xFF0F;
    readonly IE = 0xFFFF;
    
    constructor(
        private m_mmu: MMU
    ){
        this.m_jstate1 = 0;
        this.m_jstate2 = 0;
        this.m_BIOSMapped = true;

        this.m_PC = 0;
        this.m_SP = 0;
        this.m_clock = 0;

        this.IME = false;
        this.m_cbPrefix = false;
        this.m_isHalted = false;
        this.m_falligEdgeDelay = false;
    }

    public step(){
        if(!(this.m_mmu.read(this.P1) & 0x10)){
            this.m_mmu.write(this.P1, this.P1 | this.m_jstate1);
        }
        else{
            this.m_mmu.write(this.P1, this.P1 | this.m_jstate2);
        }

        if(this.m_clock == 0){
            this.getInput();
            this.m_clock = 1000;
        }
        else{
            this.m_clock -= 1;
        }
    
        this.updateTimer();
        this.checkForInterupts();
    
        if(!this.m_isHalted){
            console.log(this.m_clock);
            console.log(this.m_mmu);
            console.log(this.m_mmu.read(this.m_PC));
            if(this.m_clock == 0){
                this.execute(this.m_mmu.read(this.m_PC));
            }
            this.m_clock -= 1;
        }
    }

    private getInput(){
        ; //TODO
    }

    private execute(instruction: number){
        if(this.m_PC == 0x0100){
            this.m_BIOSMapped = false;
        }

        let opcode = (instruction & 0b11000000) >> 6;
        let register1 = (instruction & 0b00111000) >> 3;
        let register2 = (instruction & 0b00000111);
        this.m_instructionMethods1[instruction]!(opcode, register1, register2);
        this.m_PC += 1; 

        this.IME;
        this.m_SP;
        this.m_cbPrefix;
        this.m_falligEdgeDelay;
    }

    private updateTimer(){
        ; //TODO
    }

    private checkForInterupts(){
        ; //TODO
    }

    private LD_R_to_R(op: number, reg1: number, reg2: number): void{
        if(reg2 == 0x06){
            this.m_registers[reg1] = this.m_mmu.read(this.getHL());
            this.m_clock = 8;
        }
        else{
            if(reg1 == 0x06){
                this.m_mmu.write(this.getHL(), this.m_registers[reg2]!);
                this.m_clock = 8;
            }
            else{
                this.m_registers[reg1] = this.m_registers[reg2]!;
                this.m_clock = 4;
            }
        }
        op;
    }

    private LD_8_Bit(op: number, reg1: number, reg2: number): void{
        if(op == 0x03){
            let address = 0;
            if(reg2 == 0x00){
                switch(reg1){
                    case 0x04:
                        address = 0xFF00 + this.m_mmu.read(++this.m_PC);
                        if(address == 0xFF00){
                            this.m_mmu.write(address, this.m_registers[7]! & 0x30);
                        }
                        else{
                            this.m_mmu.write(address, this.m_registers[7]!);
                        }
                        this.m_clock = 12;
                        break;
                    case 0x06:
                        address = 0xFF00 + this.m_mmu.read(++this.m_PC);
                        this.m_registers[7] = this.m_mmu.read(address);
                        this.m_clock = 12;
                        break;
                    default:
                        break;
                }
            }
            else if(reg2 == 0x02){
                switch(reg1){
                    case 0x04:
                        address = 0xFF00 + this.m_registers[1]!;
                        this.m_mmu.write(address, this.m_registers[7]!);
                        this.m_clock = 8;
                        break;
                    case 0x05:
                        address = this.m_mmu.read(++this.m_PC) + (this.m_mmu.read(++this.m_PC) << 8);
                        this.m_mmu.write(address, this.m_registers[7]!);
                        this.m_clock = 16;
                        break;
                    case 0x06:
                        address = 0xFF00 + this.m_registers[1]!;
                        this.m_registers[7] = this.m_mmu.read(address);
                        this.m_clock = 8;
                        break;
                    case 0x07:
                        address = this.m_mmu.read(++this.m_PC) + (this.m_mmu.read(++this.m_PC) << 8);
                        this.m_registers[7] = this.m_mmu.read(address);
                        this.m_clock = 16;
                        break;
                    default:
                        break;
                }
            }
        }
        else{
            if(reg2 == 0x02){
                let hl = this.getHL();
                switch(reg1){
                    case 0x00:
                        this.m_mmu.write(this.getBC(), this.m_registers[7]!);
                        this.m_clock = 8;
                        break;
                    case 0x01:
                        this.m_registers[7] = this.m_mmu.read(this.getBC());
                        this.m_clock = 8;
                        break;
                    case 0x02:
                        this.m_mmu.write(this.getDE(), this.m_registers[7]!);
                        this.m_clock = 8;
                        break;
                    case 0x03:
                        this.m_registers[7] = this.m_mmu.read(this.getDE());
                        this.m_clock = 8;
                        break;
                    case 0x04:
                        this.m_mmu.write(hl, this.m_registers[7]!);
                        //setHL(hl + 1);
                        this.m_clock = 8;
                        break;
                    case 0x05:
                        this.m_registers[7] = this.m_mmu.read(hl);
                        //setHL(hl + 1);
                        this.m_clock = 8;
                        break;
                    case 0x06:
                        this.m_mmu.write(hl, this.m_registers[7]!);
                        //setHL(hl - 1);
                        this.m_clock = 8;
                        break;
                    case 0x07:
                        this.m_registers[7] = this.m_mmu.read(hl);
                        //setHL(hl - 1);
                        this.m_clock = 8;
                        break;
                    default:
                        break;
                }
            }
            else if(reg2 == 0x06){
                let val = this.m_mmu.read(++this.m_PC);
                if(reg1 == 0x06){
                    this.m_mmu.write(this.getHL(), val);
                    this.m_clock = 12
                }
                else{
                    this.m_registers[reg1] = val;
                    this.m_clock = 8;
                }
            }
        }
    }

    getAF(){
        return (this.m_registers[7]!) << 8 + this.m_registers[6]!;
    }

    private getBC(){
        return (this.m_registers[0]!) << 8 + this.m_registers[1]!;
    }

    private getDE(){
        return (this.m_registers[2]!) << 8 + this.m_registers[3]!;
    }

    private getHL(){
        return (this.m_registers[4]!) << 8 + this.m_registers[5]!;
    }
}