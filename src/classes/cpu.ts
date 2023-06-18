import {MMU} from "./mmu"

export class CPU {
    private m_instructionMethods1 = [
        this.opcode00,
        this.opcode01,
        this.opcode02,
        this.INC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.RLC,
        this.LD_16_Bit,
        this.ADD_16_BIT,
        this.LD_8_Bit,
        this.DEC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.RRC,
        this.STOP,
        this.LD_16_Bit,
        this.LD_8_Bit,
        this.INC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.RL,
        this.JR,
        this.ADD_16_BIT,
        this.LD_8_Bit,
        this.DEC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.RR,
        this.JR,
        this.LD_16_Bit,
        this.LD_8_Bit,
        this.INC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.DAA,
        this.JR,
        this.ADD_16_BIT,
        this.LD_8_Bit,
        this.DEC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.CPL,
        this.JR,
        this.LD_16_Bit,
        this.LD_8_Bit,
        this.INC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.SCF,
        this.JR,
        this.ADD_16_BIT,
        this.LD_8_Bit,
        this.DEC_16_BIT,
        this.INC,
        this.DEC,
        this.LD_8_Bit,
        this.CCF,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.HALT,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.LD_R_to_R,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.ADD,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.SUB,
        this.AND,
        this.AND,
        this.AND,
        this.AND,
        this.AND,
        this.AND,
        this.AND,
        this.AND,
        this.XOR,
        this.XOR,
        this.XOR,
        this.XOR,
        this.XOR,
        this.XOR,
        this.XOR,
        this.XOR,
        this.OR,
        this.OR,
        this.OR,
        this.OR,
        this.OR,
        this.OR,
        this.OR,
        this.OR,
        this.CP,
        this.CP,
        this.CP,
        this.CP,
        this.CP,
        this.CP,
        this.CP,
        this.CP,
        this.RET,
        this.LD_16_Bit,
        this.JP,
        this.JP,
        this.CALL,
        this.LD_16_Bit,
        this.ADD,
        this.RST,
        this.RET,
        this.RET,
        this.JP,
        this.CBPrefix,
        this.CALL,
        this.CALL,
        this.ADD,
        this.RST,
        this.RET,
        this.LD_16_Bit,
        this.JP,
        this.opcode00,
        this.CALL,
        this.LD_16_Bit,
        this.SUB,
        this.RST,
        this.RET,
        this.RET,
        this.JP,
        this.opcode00,
        this.CALL,
        this.opcode00,
        this.SUB,
        this.RST,
        this.LD_8_Bit,
        this.LD_16_Bit,
        this.LD_8_Bit,
        this.opcode00,
        this.opcode00,
        this.LD_16_Bit,
        this.AND,
        this.RST,
        this.ADD_16_BIT,
        this.JP,
        this.LD_8_Bit,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.XOR,
        this.RST,
        this.LD_8_Bit,
        this.LD_16_Bit,
        this.LD_8_Bit,
        this.DI,
        this.opcode00,
        this.LD_16_Bit,
        this.OR,
        this.RST,
        this.LD_16_Bit,
        this.LD_16_Bit,
        this.LD_8_Bit,
        this.EI,
        this.opcode00,
        this.opcode00,
        this.CP,
        this.RST
    ]

    private m_instructionMethods2 = [
        this.RLC,
        this.RLC,
        this.RLC,
        this.RLC,
        this.RLC,
        this.RLC,
        this.RLC,
        this.RLC,
        this.RRC,
        this.RRC,
        this.RRC,
        this.RRC,
        this.RRC,
        this.RRC,
        this.RRC,
        this.RRC,
        this.RL,
        this.RL,
        this.RL,
        this.RL,
        this.RL,
        this.RL,
        this.RL,
        this.RL,
        this.RR,
        this.RR,
        this.RR,
        this.RR,
        this.RR,
        this.RR,
        this.RR,
        this.RR,
        this.SLA,
        this.SLA,
        this.SLA,
        this.SLA,
        this.SLA,
        this.SLA,
        this.SLA,
        this.SLA,
        this.SRA,
        this.SRA,
        this.SRA,
        this.SRA,
        this.SRA,
        this.SRA,
        this.SRA,
        this.SRA,
        this.SWAP,
        this.SWAP,
        this.SWAP,
        this.SWAP,
        this.SWAP,
        this.SWAP,
        this.SWAP,
        this.SWAP,
        this.SRL,
        this.SRL,
        this.SRL,
        this.SRL,
        this.SRL,
        this.SRL,
        this.SRL,
        this.SRL,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.BIT,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.RES,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET,
        this.SET
    ]

    // private m_instructionMethods2 = [
    //     this.LD_R_to_R
    // ]

    public m_jstate1: number;
    public m_jstate2: number;
    public m_BIOSMapped: boolean;

    public m_PC: number;
    private m_SP: number;
    private m_clock: number;
    private m_registers;

    private IME: boolean;
    private m_cbPrefix: boolean;
    private m_isHalted: boolean;
    private m_fallingEdgeDelay: boolean;

    private readonly P1 = 0xFF00;
    private readonly DIV = 0xFF03;
    private readonly TIMA = 0xFF05;
    private readonly TMA = 0xFF06;
    private readonly TAC = 0xFF07;
    private readonly IF = 0xFF0F;
    private readonly IE = 0xFFFF;

    private readonly R = {
        A: 7,
        B: 0,
        C: 1,
        D: 2,
        E: 3,
        F: 6,
        H: 4,
        L: 5
    }
    
    constructor(
        private m_mmu: MMU
    ){
        this.m_jstate1 = 0;
        this.m_jstate2 = 0;
        this.m_BIOSMapped = true;

        this.m_PC = 0;
        this.m_SP = 0;
        this.m_clock = 0;
        this.m_registers = new Array(8).fill(0);

        this.IME = false;
        this.m_cbPrefix = false;
        this.m_isHalted = false;
        this.m_fallingEdgeDelay = false;

        this.DIV;
        this.TIMA;
        this.TMA;
        this.TAC;
        this.IF;
        this.IE;
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
            //if(this.m_clock == 0){
                this.execute(this.m_mmu.read(this.m_PC));
            //}
            this.m_clock -= 1;
        }
    }

    private getInput(){
        ; //TODO
    }

    private execute(instruction: number){
        // if(this.m_PC == 0x80){
        //     console.log('PC: 0x' + this.m_PC.toString(16))
        //     console.log('inst: 0x' + instruction.toString(16))
        //     console.log("A:" + this.m_registers[this.R.A].toString(16) + " F:" + this.m_registers[this.R.F].toString(16))
        //     console.log("B:" + this.m_registers[this.R.B].toString(16) + " C:" + this.m_registers[this.R.C].toString(16))
        //     console.log("D:" + this.m_registers[this.R.D].toString(16) + " E:" + this.m_registers[this.R.E].toString(16))
        //     console.log("H:" + this.m_registers[this.R.H].toString(16) + " L:" + this.m_registers[this.R.L].toString(16))
        //     console.log('SP: 0x' + this.m_SP.toString(16));
        //     console.log('')
        // }
        
        if(this.m_PC == 0x0100){
            this.m_BIOSMapped = false;
        }

        this.m_instructionMethods1[instruction]!.call(this);
        this.m_PC += 1;

        this.IME;
        this.m_SP;
        this.m_cbPrefix;
    }

    // DIV needs to be implemented properly...
    private updateTimer(){
        this.m_mmu.write(this.DIV, this.m_mmu.read(this.DIV) + 1);
        if((this.m_mmu.read(this.TAC) & 0x04) > 0){
            let sum = this.m_mmu.read(this.TIMA);
            if((this.m_mmu.read(this.TAC) & 0x03) > 0){
                if((this.m_mmu.read(this.DIV) & (0x0002 << (((this.m_mmu.read(this.TAC) & 0x03) * 2)))) > 0){
                    this.m_fallingEdgeDelay = true;
                }
                else{
                    if(this.m_fallingEdgeDelay){
                        sum += 1;
                        this.m_fallingEdgeDelay = false;
                    }
                }
            }
            else{
                if((this.m_mmu.read(this.DIV) & 0x0200) > 0){
                    this.m_fallingEdgeDelay = true;
                }
                else{
                    if(this.m_fallingEdgeDelay){
                        sum += 1;
                        this.m_fallingEdgeDelay = false;
                    }
                }
            }

            if(sum > 0x00FF){
                this.m_mmu.write(this.TIMA, this.m_mmu.read(this.TMA));
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x04);
            }
            else{
                this.m_mmu.write(this.TIMA, sum & 0x00FF);
            }
        }
    }

    private checkForInterupts(){
        ; //TODO
    }

    private LD_R_to_R(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = (instruction & 0b00000111);

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

    private LD_8_Bit(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = (instruction & 0b00000111);

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
                        this.m_mmu.write(hl, this.m_registers[7]);
                        this.setHL(hl + 1);
                        this.m_clock = 8;
                        break;
                    case 0x05:
                        this.m_registers[7] = this.m_mmu.read(hl);
                        this.setHL(hl + 1);
                        this.m_clock = 8;
                        break;
                    case 0x06:
                        this.m_mmu.write(hl, this.m_registers[7]);
                        this.setHL(hl - 1);
                        this.m_clock = 8;
                        break;
                    case 0x07:
                        this.m_registers[7] = this.m_mmu.read(hl);
                        this.setHL(hl - 1);
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

    private LD_16_Bit(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            if(reg2 == 0x01){
                let lVal = 0;
                let hVal = 0;
                switch(reg1){
                    case 0x00:
                        lVal = this.m_mmu.read(this.m_SP++);
                        hVal = this.m_mmu.read(this.m_SP++);
                        this.setBC((hVal << 8) + lVal);
                        this.m_clock = 12;
                        break;
                    case 0x02:
                        lVal = this.m_mmu.read(this.m_SP++);
                        hVal = this.m_mmu.read(this.m_SP++);
                        this.setDE((hVal << 8) + lVal);
                        this.m_clock = 12;
                        break;
                    case 0x04:
                        lVal = this.m_mmu.read(this.m_SP++);
                        hVal = this.m_mmu.read(this.m_SP++);
                        this.setHL((hVal << 8) + lVal);
                        this.m_clock = 12;
                        break;
                    case 0x06:
                        lVal = this.m_mmu.read(this.m_SP++);
                        hVal = this.m_mmu.read(this.m_SP++);
                        this.setAF((hVal << 8) + lVal);
                        this.m_clock = 12;
                        break;
                    case 0x07:
                        this.m_SP = this.getHL();
                        this.m_clock = 8;
                        break;
                    default:
                        break;
                }
            }
            else{
                let val = 0;
                switch(reg1){
                    case 0x00:
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.B]);
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.C]);
                        this.m_clock = 16;
                        break;
                    case 0x02:
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.D]);
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.E]);
                        this.m_clock = 16;
                        break;
                    case 0x04:
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.H]);
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.L]);
                        this.m_clock = 16;
                        break;
                    case 0x06:
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.A]);
                        this.m_mmu.write(--this.m_SP, this.m_registers[this.R.F]);
                        this.m_clock = 16;
                        break;
                    case 0x07:
                        val = this.m_mmu.read(++this.m_PC);
                        this.setHL(this.m_SP + (val << 24 >> 24));

                        // Set Z flag to 0
                        this.setZ(false);
                        // Set N flag to 0
                        this.setN(false);
                        // Calculate if Half-Carry flag needs to be set
                        this.setH(((this.m_SP ^ this.getHL() ^ val) & 0x0010) == 0x0010);
                        // Calculate if Carry flag needs to be set
                        this.setC(((this.m_SP ^ this.getHL() ^ val) & 0x0100) == 0x0100);

                        this.m_clock = 12;
                        break;
                    default:
                        break;
                }
            }
        }
        else{
            let lVal = this.m_mmu.read(++this.m_PC);
            let hVal = this.m_mmu.read(++this.m_PC);
            let addr;
            switch(reg1){
                case 0x00:
                    this.setBC((hVal << 8) + lVal);
                    this.m_clock = 12;
                    break;
                case 0x01:
                    addr = (hVal << 8) + lVal;
                    this.m_mmu.write(addr, this.m_SP & 0x00FF);
                    this.m_mmu.write(addr + 1, this.m_SP & 0xFF00);
                    this.m_clock = 20;
                    break;
                case 0x02:
                    this.setDE((hVal << 8) + lVal);
                    this.m_clock = 12;
                    break;
                case 0x04:
                    this.setHL((hVal << 8) + lVal);
                    this.m_clock = 12;
                    break;
                case 0x06:
                    this.m_SP = (hVal << 8) + lVal;
                    this.m_clock = 12;
                    break;
                default:
                    break;
            }
        }
    }

    private JP(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x01){
            this.m_PC = this.getHL() - 1;
            this.m_clock = 4;
        }
        else{
            let lVal = this.m_mmu.read(++this.m_PC);
            let hVal = this.m_mmu.read(++this.m_PC);
            let addr = (hVal << 8) + lVal;
            this.m_clock = 12;

            if(reg2 == 0x02){
                switch(reg1){
                    case 0x00:
                        if(this.getZ()){return;}
                        break;
                    case 0x01:
                        if(!this.getZ()){return;}
                        break;
                    case 0x02:
                        if(this.getC()){return;}
                        break;
                    case 0x03:
                        if(!this.getC()){return;}
                        break;
                    default:
                        break;
                }
            }

            this.m_PC = addr - 1;
            this.m_clock = 16;
        }
    }

    private JR(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let nVal = this.m_mmu.read(++this.m_PC)
        this.m_clock = 8;

        if(reg1 != 0x03){
            switch(reg1){
                case 0x04:
                    if(this.getZ()){return;}
                    break;
                case 0x05:
                    if(!this.getZ()){return;}
                    break;
                case 0x06:
                    if(this.getC()){return;}
                    break;
                case 0x07:
                    if(!this.getC()){return;}
                    break;
            }
        }

        this.m_PC += (nVal << 24 >> 24);
        this.m_clock = 12;
    }

    private ADD():void{
        let rVal = this.m_registers[this.R.A]!;
        let nVal = 0;
        let carry = 0;
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        // Check if carry bit will be used
        if(reg1 == 0x01){
            carry = Number(this.getC());
        }

        // Get the value being used for the calculation with Register A
        if(op == 0x03){
            nVal = this.m_mmu.read(++this.m_PC);
            this.m_clock = 8;
        }
        else{
            if(reg2 == 0x06){
                nVal = this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else{
                nVal = this.m_registers[reg2]!;
                this.m_clock = 4;
            }
        }

        // Perform addition to A register
        this.m_registers[this.R.A] = (rVal + nVal + carry) & 0xFF;
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set N flag to 0
        this.setN(false);
        // Calculate if Half-Carry flag needs to be set
        this.setH(((rVal & 0x0F) + (nVal & 0x0F) + carry) > 0x0F);
        // Calculate if Full-Carry flag needs to be set
        this.setC((rVal + nVal + carry) > 0xFF);
    }

    private SUB(): void{
        let rVal = this.m_registers[this.R.A]!;
        let nVal = 0;
        let carry = 0;
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(reg1 == 0x03){
            carry = Number(this.getC());
        }

        if(op == 0x03){
            nVal = this.m_mmu.read(++this.m_PC);
            this.m_clock = 8;
        }
        else{
            if(reg2 == 0x06){
                nVal = this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else{
                nVal = this.m_registers[reg2]!;
                this.m_clock = 4;
            }
        }

        // Calculate if Half-Carry flag needs to be set
        this.setH((rVal & 0x0F) < (nVal & 0x0F) + carry);
        // Perform subtraction to A register
        this.m_registers[this.R.A] = (rVal - nVal - carry) & 0xFF;
        // Calculate if Full-Carry flag needs to be set
        this.setC(nVal + carry > rVal);
        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set N flag to 1
        this.setN(true);
    }

    private AND(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            this.m_registers[this.R.A] &= this.m_mmu.read(++this.m_PC);
            this.m_clock = 8;
        }
        else{
            if(reg2 == 0x06){
                this.m_registers[this.R.A] &= this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else{
                this.m_registers[this.R.A] &= this.m_registers[reg2]!;
                this.m_clock = 4;
            }
        }

        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set C and N flags to 0, H flag to 1
        this.setC(false);
        this.setH(true);
        this.setN(false);
    }

    private XOR(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            this.m_registers[this.R.A] ^= this.m_mmu.read(++this.m_PC);
            this.m_clock = 8;
        }
        else{
            if(reg2 == 0x06){
                this.m_registers[this.R.A] ^= this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else{
                this.m_registers[this.R.A] ^= this.m_registers[reg2];
                this.m_clock = 4;
            }
        }

        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set C, H, and N flags to 0
        this.setC(false);
        this.setH(false);
        this.setN(false);
    }

    private OR(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            this.m_registers[this.R.A] |= this.m_mmu.read(++this.m_PC);
            this.m_clock = 8;
        }
        else{
            if(reg2 == 0x06){
                this.m_registers[this.R.A] |= this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else{
                this.m_registers[this.R.A] |= this.m_registers[reg2]!;
                this.m_clock = 4;
            }
        }

        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set C, H, and N flags to 0
        this.setC(false);
        this.setH(false);
        this.setN(false);
    }

    private CP(): void{
        let rVal = this.m_registers[this.R.A]!;
        let nVal = 0;
        let instruction = this.m_mmu.read(this.m_PC);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            nVal = this.m_mmu.read(++this.m_PC);
            this.m_clock = 8;
        }
        else{
            if(reg2 == 0x06){
                nVal = this.m_mmu.read(this.getHL());
                this.m_clock = 8;
            }
            else{
                nVal = this.m_registers[reg2]!;
                this.m_clock = 4;
            }
        }

        // Calculate if Half-Carry flag needs to be set
        this.setH(((rVal - nVal) & 0x0F) > (rVal & 0x0F));
        // Calculate if Full-Carry flag needs to be set
        this.setC(nVal > rVal);
        // Calculate if Zero flag needs to be set
        this.setZ(nVal == rVal);
        // Set N flag to 1
        this.setN(true);
    }

    private INC(): void{
        let result = 0;
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
    
        if (reg1 == 0x06) {
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) + 1);
            result = this.m_mmu.read(this.getHL())
            this.m_clock = 12;
        }
        else {
            this.m_registers[reg1] = (this.m_registers[reg1]! + 1) & 0xFF;
            result = this.m_registers[reg1]!;
            this.m_clock = 4;
        }
    
        // Calculate if Zero flag needs to be set
        this.setZ(result == 0x00);
        // Calculate if Half-Carry flag needs to be set
        this.setH((result & 0x0F) == 0x00);
        // Set N flag to 0
        this.setN(false);
    }

    private DEC(): void{
        let result = 0;
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
    
        if (reg1 == 0x06) {
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) - 1);
            result = this.m_mmu.read(this.getHL())
            this.m_clock = 12;
        }
        else {
            this.m_registers[reg1] = (this.m_registers[reg1]! - 1) & 0xFF;
            result = this.m_registers[reg1]!;
            this.m_clock = 4;
        }
    
        // Calculate if Zero flag needs to be set
        this.setZ(result == 0x00);
        // Calculate if Half-Carry flag needs to be set
        this.setH((result & 0x0F) == 0x0F);
        // Set N flag to 1
        this.setN(true);
    }

    private ADD_16_BIT(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x00){
            let nVal = this.m_mmu.read(++this.m_PC);
            let rVal = this.m_SP;
            this.m_SP = (this.m_SP + (nVal << 24 >> 24)) & 0xFFFF;

            // Set Z flag to 0
            this.setZ(false);
            // Set N flag to 0
            this.setN(false);
            // Calculate if Half-Carry flag needs to be set
            this.setH(((this.m_SP ^ rVal ^ nVal) & 0x0010) == 0x0010);
            // Calculate if Carry flag needs to be set
            this.setC(((this.m_SP ^ rVal ^ nVal) & 0x0100) == 0x0100);

            this.m_clock = 16;
        }
        else{
            let rVal = this.getHL()
            switch(reg1){
                case 0x01:
                    this.setHL(this.getHL() + this.getBC());
                    break;
                case 0x03:
                    this.setHL(this.getHL() + this.getDE());
                    break;
                case 0x05:
                    this.setHL(this.getHL() + this.getHL());
                    break;
                case 0x07:
                    this.setHL(this.getHL() + this.m_SP);
                    break;
                default:
                    break;
            }

            // Set N flag to 0
            this.setN(false);
            // Calculate if Half-Carry flag needs to be set
            this.setH((this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
            // Calculate if Carry flag needs to be set
            this.setC(this.getHL() < rVal);
            
            this.m_clock = 8;
        }
    }

    private INC_16_BIT(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;

        switch(reg1){
            case 0x00:
                this.setBC(this.getBC() + 1);
                break;
            case 0x02:
                this.setDE(this.getDE() + 1);
                break;
            case 0x04:
                this.setHL(this.getHL() + 1);
                break;
            case 0x06:
                this.m_SP = (this.m_SP + 1) & 0xFFFF;
                break;
            default:
                break;
        }

        this.m_clock = 8;
    }

    private DEC_16_BIT(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;

        switch(reg1){
            case 0x00:
                this.setBC(this.getBC() - 1);
                break;
            case 0x02:
                this.setDE(this.getDE() - 1);
                break;
            case 0x04:
                this.setHL(this.getHL() - 1);
                break;
            case 0x06:
                this.m_SP = (this.m_SP - 1) & 0xFFFF;
                break;
            default:
                break;
        }

        this.m_clock = 8;
    }

    private CBPrefix(): void{
        this.m_cbPrefix = true;
        this.m_instructionMethods2[this.m_mmu.read(++this.m_PC)]!.call(this);
        this.m_cbPrefix = false;
    }

    private RLC(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);
            this.m_mmu.write(this.getHL(), ((rVal << 1) + Number(this.getC())) & 0xFF)

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2]!;

            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);
            this.m_registers[reg2] = ((rVal << 1) + Number(this.getC())) & 0xFF

            // Calculate if Zero flag needs to be set
            if(this.m_cbPrefix){
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8
            }
            else{
                this.setZ(false);
                this.m_clock = 4;
            }
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
    }

    private RRC(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            this.m_mmu.write(this.getHL(), (rVal >> 1) + (Number(this.getC()) << 7));

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2];

            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);
            this.m_registers[reg2] = (rVal >> 1) + (Number(this.getC()) << 7);

            // Calculate if Zero flag needs to be set
            if(this.m_cbPrefix){
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8;
            }
            else{
                this.setZ(false);
                this.m_clock = 4;
            }
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
    }

    private RL(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            this.m_mmu.write(this.getHL(), (rVal << 1) + Number(this.getC()));
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2];

            this.m_registers[reg2] = (rVal << 1) + Number(this.getC());
            // Calculate if Carry flag needs to be set
            this.setC(rVal > 0b10000000);

            // Calculate if Zero flag needs to be set
            if(this.m_cbPrefix){
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8;
            }
            else{
                this.setZ(false);
                this.m_clock = 4;
            }
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
    }

    private RR(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            this.m_mmu.write(this.getHL(), (rVal >> 1) + (Number(this.getC()) << 7));
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2];

            this.m_registers[reg2] = (rVal >> 1) + (Number(this.getC()) << 7);
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);

            // Calculate if Zero flag needs to be set
            if(this.m_cbPrefix){
                this.setZ(this.m_registers[reg2] == 0);
                this.m_clock = 8;
            }
            else{
                this.setZ(false);
                this.m_clock = 4;
            }
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
    }

    private SLA(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);
            this.m_mmu.write(this.getHL(), rVal << 1);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2];

            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);
            this.m_registers[reg2] = rVal << 1;

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
    }

    private SRA(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            this.m_mmu.write(this.getHL(), (rVal >> 1) + (Number(this.getC()) << 7));
            
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2];

            this.m_registers[reg2] = (rVal >> 1) + (Number(this.getC()) << 7);
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
    }

    private SWAP(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            this.m_mmu.write(this.getHL(), (rVal << 4) + (rVal >> 4));

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2];

            this.m_registers[reg2] = ((rVal << 4) + (rVal >> 4)) & 0xFF;

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }

        // Set C, H and N flags to 0
        this.setC(false);
        this.setH(false);
        this.setN(false);
    }

    private SRL(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());
            
            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);

            this.m_mmu.write(this.getHL(), (rVal >> 1));

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2];

            // Calculate if Carry flag needs to be set
            this.setC((rVal % 2) > 0);

            this.m_registers[reg2] = (rVal >> 1);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
    }

    private BIT(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;
        let mask = 0x01 << reg1;

        if(reg2 == 0x06){
            // Calculate if Zero flag needs to be set
            this.setZ((this.m_mmu.read(this.getHL()) & mask) == 0);
            this.m_clock = 12;
        }
        else{
            // Calculate if Zero flag needs to be set
            this.setZ((this.m_registers[reg2] & mask) == 0);
            this.m_clock = 8;
        }

        // Set H flag to 1, N flag to 0
        this.setH(true);
        this.setN(false);
    }

    private RES(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;
        let mask = (0x01 << reg1) ^ 0xFF;

        if(reg2 == 0x06){
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) & mask);
            this.m_clock = 16;
        }
        else{
            this.m_registers[reg2] &= (mask & 0xFF);
            this.m_clock = 8;
        }
    }

    private SET(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;
        let mask = 0x01 << reg1;

        if(reg2 == 0x06){
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) | mask);
            this.m_clock = 16;
        }
        else{
            this.m_registers[reg2] |= (mask & 0xFF);
            this.m_clock = 8;
        }
    }

    private CALL(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        let lAddr = this.m_mmu.read(++this.m_PC);
        let hAddr = this.m_mmu.read(++this.m_PC);
        this.m_clock = 12;

        if(reg2 == 0x04){
            switch(reg1){
                case 0x00:
                    if(this.getZ()){return;}
                    break;
                case 0x01:
                    if(!this.getZ()){return;}
                    break;
                case 0x02:
                    if(this.getC()){return;}
                    break;
                case 0x03:
                    if(!this.getC()){return;}
                    break;
                default:
                    break;
            }
        }

        this.m_PC += 1;
        this.m_mmu.write(--this.m_SP, (0xFF00 & this.m_PC) >> 8);
        this.m_mmu.write(--this.m_SP, 0x00FF & this.m_PC);
        this.m_PC = (hAddr << 8) + lAddr - 1;
        this.m_clock = 24;
    }

    private RET(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x00){
            this.m_clock = 8;
            switch(reg1){
                case 0x00:
                    if(this.getZ()){return;}
                    break;
                case 0x01:
                    if(!this.getZ()){return;}
                    break;
                case 0x02:
                    if(this.getC()){return;}
                    break;
                case 0x03:
                    if(!this.getC()){return;}
                    break;
                default:
                    break;
            }
            this.m_clock = 20;
        }
        else{
            if(reg1 == 0x03){
                this.IME = true;
            }
            this.m_clock = 16;
        }

        let lAddr = this.m_mmu.read(this.m_SP++);
        let hAddr = this.m_mmu.read(this.m_SP++);
        this.m_PC = (hAddr << 8) + lAddr - 1;
    }

    private RST(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = (instruction & 0b00111000) >> 3;

        this.m_PC += 1;
        this.m_mmu.write(--this.m_SP, (0xFF00 & this.m_PC) >> 8);
        this.m_mmu.write(--this.m_SP, 0x00FF & this.m_PC);
        this.m_PC = (reg1 * 8) - 1;

        this.m_clock = 16;
    }

    private DAA(): void{
        if(!this.getN()){
            if(this.getC() || this.m_registers[this.R.A] > 0x99){
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0x60) & 0xFF;
                this.setC(true);
            }
            if(this.getH() || (this.m_registers[this.R.A] & 0x0F) > 0x09){
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0x06) & 0xFF;
            }
        }
        else if(this.getC()){
            if(this.getH()){
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0x9A) & 0xFF;
            }
            else{
                this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0xA0) & 0xFF;
            }
        }
        else if(this.getH()){
            this.m_registers[this.R.A] = (this.m_registers[this.R.A] + 0xFA) & 0xFF;
        }

        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set Half-Carry flag to 0
        this.setH(false);
    
        this.m_clock = 4;
    }

    private CPL(): void{
        this.m_registers[this.R.A] = 0xFF - this.m_registers[this.R.A];

        // Set N flag to 1
        this.setN(true);
        // Set H flag to 1
        this.setH(true);

        this.m_clock = 4;
    }

    private SCF(): void{
        // Set N flag to 0
        this.setN(false);
        // Set H flag to 0
        this.setH(false);
        // Set C flag to 1
        this.setC(true);

        this.m_clock = 4;
    }

    private CCF(): void{
        // Set N flag to 0
        this.setN(false);
        // Set H flag to 0
        this.setH(false);
        // Set C flag to !C
        this.setC(!this.getC());

        this.m_clock = 4;
    }

    private DI(): void{
        this.IME = false;
        this.m_clock = 4;
    }

    private EI(): void{
        this.IME = true;
        this.m_clock = 4;
    }

    private HALT(): void{
        this.m_isHalted = true;
        this.m_clock = 4;
    }

    private STOP(): void{
        this.m_clock = 4;
    }

    // NOP
    private opcode00(): void{
        this.m_clock = 4;
    }

    // LD BC, d16
    private opcode01(): void{
        let lVal = this.m_mmu.read(++this.m_PC);
        let hVal = this.m_mmu.read(++this.m_PC);
        this.m_registers[this.R.B] = hVal;
        this.m_registers[this.R.C] = lVal;
        this.m_clock = 12;
    }

    // LD (BC), A
    private opcode02(): void{
        this.m_mmu.write(this.getBC(), this.m_registers[this.R.A]!);
        this.m_clock = 8;
    }

    // private getAF(){
    //     return (this.m_registers[this.R.A]!) << 8 + this.m_registers[this.R.F]!;
    // }

    private getBC(){
        return (this.m_registers[this.R.B] << 8) + this.m_registers[this.R.C];
    }

    private getDE(){
        return (this.m_registers[this.R.D] << 8) + this.m_registers[this.R.E];
    }

    private getHL(){
        return (this.m_registers[this.R.H] << 8) + this.m_registers[this.R.L];
    }

    private setAF(value: number): void{
        let hVal = (value >> 8) & 0x00FF;
        let lVal = value & 0x00FF;
        this.m_registers[this.R.A] = hVal;
        this.m_registers[this.R.F] = lVal;
    }

    private setBC(value: number): void{
        let hVal = (value >> 8) & 0x00FF;
        let lVal = value & 0x00FF;
        this.m_registers[this.R.B] = hVal;
        this.m_registers[this.R.C] = lVal;
    }

    private setDE(value: number): void{
        let hVal = (value >> 8) & 0x00FF;
        let lVal = value & 0x00FF;
        this.m_registers[this.R.D] = hVal;
        this.m_registers[this.R.E] = lVal;
    }

    private setHL(value: number): void{
        let hVal = (value >> 8) & 0x00FF;
        let lVal = value & 0x00FF;
        this.m_registers[this.R.H] = hVal;
        this.m_registers[this.R.L] = lVal;
    }

    private getC(){
        return (this.m_registers[this.R.F]! & 0b00010000) > 0;
    }

    private getH(){
        return (this.m_registers[this.R.F]! & 0b00100000) > 0;
    }

    private getN(){
        return (this.m_registers[this.R.F]! & 0b01000000) > 0;
    }

    private getZ(){
        return (this.m_registers[this.R.F]! & 0b10000000) > 0;
    }

    private setC(val: boolean){
        if(val){
            this.m_registers[this.R.F] |= 0b00010000;
        }
        else{
            this.m_registers[this.R.F] &= 0b11101111;
        }
    }

    private setH(val: boolean){
        if(val){
            this.m_registers[this.R.F] |= 0b00100000;
        }
        else{
            this.m_registers[this.R.F] &= 0b11011111;
        }
    }

    private setN(val: boolean){
        if(val){
            this.m_registers[this.R.F] |= 0b01000000;
        }
        else{
            this.m_registers[this.R.F] &= 0b10111111;
        }
    }

    private setZ(val: boolean){
        if(val){
            this.m_registers[this.R.F] |= 0b10000000;
        }
        else{
            this.m_registers[this.R.F] &= 0b01111111;
        }
    }
}
