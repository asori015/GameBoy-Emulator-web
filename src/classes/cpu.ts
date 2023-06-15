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
        this.JP,
        this.opcode00,
        this.opcode00,
        this.DEC_16_BIT,
        this.INC,
        this.DEC,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.INC,
        this.DEC,
        this.opcode00,
        this.opcode00,
        this.JR,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.INC,
        this.DEC,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.INC,
        this.DEC,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.INC,
        this.DEC,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.INC,
        this.DEC,
        this.opcode00,
        this.opcode00,
        this.JR,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.INC,
        this.DEC,
        this.opcode00,
        this.opcode00,
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
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.opcode00,
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
    private m_registers;

    private IME: boolean;
    private m_cbPrefix: boolean;
    private m_isHalted: boolean;
    private m_falligEdgeDelay: boolean;

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
        this.m_falligEdgeDelay = false;

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
            // console.log(this.m_clock);
            console.log(this.m_mmu);
            console.log(this.m_mmu.read(this.m_PC));
            console.log(this.m_registers);
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

    private JP(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = instruction & 0b00111000;
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
        let nVal = this.m_mmu.read(++this.m_PC)
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = instruction & 0b00111000;

        if(reg1 != 0x03){
            this.m_clock = 8;
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

        this.m_PC += nVal;
        this.m_clock = 12;
    }

    private ADD():void{
        let rVal = this.m_registers[this.R.A]!;
        let nVal = 0;
        let carry = 0;
        let instruction = this.m_mmu.read(this.m_PC);
        let op = instruction & 0b11000000;
        let reg1 = instruction & 0b00111000;
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
        let op = instruction & 0b11000000;
        let reg1 = instruction & 0b00111000;
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
        let op = instruction & 0b11000000;
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
        let op = instruction & 0b11000000;
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
                this.m_registers[this.R.A] ^= this.m_registers[reg2]!;
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
        let op = instruction & 0b11000000;
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
        let op = instruction & 0b11000000;
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
        let reg1 = instruction & 0b00111000;
    
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
        let reg1 = instruction & 0b00111000;
    
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

    private INC_16_BIT(): void{
        let instruction = this.m_mmu.read(this.m_PC);
        let reg1 = instruction & 0b00111000;

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
        let reg1 = instruction & 0b00111000;

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
        return (this.m_registers[this.R.B]!) << 8 + this.m_registers[this.R.C]!;
    }

    private getDE(){
        return (this.m_registers[this.R.D]!) << 8 + this.m_registers[this.R.E]!;
    }

    private getHL(){
        return (this.m_registers[this.R.E]!) << 8 + this.m_registers[this.R.L]!;
    }

    // private setAF(value: number): void{
    //     let hVal = (value >> 8) & 0x00FF;
    //     let lVal = value & 0x00FF;
    //     this.m_registers[this.R.A] = hVal;
    //     this.m_registers[this.R.F] = lVal;
    // }

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

    // private getH(){
    //     return (this.m_registers[this.R.F]! & 0b00100000) > 0;
    // }

    // private getN(){
    //     return (this.m_registers[this.R.F]! & 0b01000000) > 0;
    // }

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
