import {MMU} from "./mmu"

export class CPU {
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
    
        // uint8_t opcode = (instruction & 0b11000000) >> 6;
        // uint8_t register1 = (instruction & 0b00111000) >> 3;
        // uint8_t register2 = (instruction & 0b00000111);
        // (this->*instructionMethods1_[instruction])(opcode, register1, register2);
        // if (debug_) { printf("Instruction: 0x%x\n", instruction); printRegs(); }
        // PC_ += 1;

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
            op;
        }
        else{
            reg1;
        }
    }

    private m_instructionMethods1 = [
        this.LD_R_to_R
    ]
}