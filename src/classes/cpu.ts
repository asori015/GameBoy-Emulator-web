import {MMU} from "./mmu"

export class CPU {
    private m_instructionMethods1 = [
        () => { // NOP
            return 4;
        },
        () => { // LD BC,d16
            this.m_registers[this.R.C] = this.m_mmu.read(++this.m_PC[0]);
            this.m_registers[this.R.B] = this.m_mmu.read(++this.m_PC[0]);
            return 12;
        },
        () => { // LD (BC),A
            this.m_mmu.write(this.getBC(), this.m_registers[this.R.A]!);
            return 8;
        },
        () => { // INC BC
            this.setBC(this.getBC() + 1);
            return 8;
        },
        () => { // INC B
            this.m_registers[this.R.B] += 1;
            this.setZ(this.m_registers[this.R.B] == 0x00);
            this.setH((this.m_registers[this.R.B]! & 0x0F) == 0x00);
            this.setN(false);
            return 4;
        },
        () => { // DEC B
            this.m_registers[this.R.B] -= 1;
            this.setZ(this.m_registers[this.R.B] == 0x00);
            this.setH((this.m_registers[this.R.B]! & 0x0F) == 0x0F);
            this.setN(true);
            return 4;
        },
        () => { // LD B,d8
            this.m_registers[this.R.B] = this.m_mmu.read(++this.m_PC[0]);
            return 8;
        },
        () => { // RLCA
            this.setC(this.m_registers[this.R.A]! >= 0b10000000);
            this.m_registers[this.R.A] = ((this.m_registers[this.R.A]! << 1) + Number(this.getC())) & 0xFF;
            this.setZ(false);
            this.setH(false);
            this.setN(false);
            return 4;
        },
        () => { // LD (a16),SP
            let addr = this.m_mmu.read(++this.m_PC[0]) + (this.m_mmu.read(++this.m_PC[0]) << 8);
            this.m_mmu.write(addr, this.m_SP[0]! & 0x00FF);
            this.m_mmu.write(addr + 1, (this.m_SP[0]! & 0xFF00) >> 8);
            return 20;
        },
        () => { // ADD HL,BC
            let rVal = this.getHL();
            this.setHL(this.getHL() + this.getBC());
            this.setN(false);
            this.setH((this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
            this.setC(this.getHL() < rVal);
            return 8;
        },
        () => { // LD A,(BC)
            this.m_registers[this.R.A] = this.m_mmu.read(this.getBC());
            return 8;
        },
        () => { // DEC BC
            this.setBC(this.getBC() - 1);
            return 8;
        },
        () => { // INC C
            this.m_registers[this.R.C] += 1;
            this.setZ(this.m_registers[this.R.C] == 0x00);
            this.setH((this.m_registers[this.R.C]! & 0x0F) == 0x00);
            this.setN(false);
            return 4;
        },
        () => { // DEC C
            this.m_registers[this.R.C] -= 1;
            this.setZ(this.m_registers[this.R.C] == 0x00);
            this.setH((this.m_registers[this.R.C]! & 0x0F) == 0x0F);
            this.setN(true);
            return 4;
        },
        () => { // LD C,d8
            this.m_registers[this.R.C] = this.m_mmu.read(++this.m_PC[0]);
            return 8;
        },
        () => { // RRCA
            this.setC((this.m_registers[this.R.A]! % 2) > 0);
            this.m_registers[this.R.A] = (this.m_registers[this.R.A]! >> 1) + (Number(this.getC()) << 7);
            this.setZ(false);
            this.setH(false);
            this.setN(false);
            return 4;
        },
        this.STOP,
        () => { // LD DE,d16
            this.m_registers[this.R.E] = this.m_mmu.read(++this.m_PC[0]);
            this.m_registers[this.R.D] = this.m_mmu.read(++this.m_PC[0]);
            return 12;
        },
        () => { // LD (DE),A
            this.m_mmu.write(this.getDE(), this.m_registers[this.R.A]!);
            return 8;
        },
        () => { // INC DE
            this.setDE(this.getDE() + 1);
            return 8;
        },
        () => { // INC D
            this.m_registers[this.R.D] += 1;
            this.setZ(this.m_registers[this.R.D]! == 0x00);
            this.setH((this.m_registers[this.R.D]! & 0x0F) == 0x00);
            this.setN(false);
            return 4;
        },
        () => { // DEC D
            this.m_registers[this.R.D] -= 1;
            this.setZ(this.m_registers[this.R.D] == 0x00);
            this.setH((this.m_registers[this.R.D]! & 0x0F) == 0x0F);
            this.setN(true);
            return 4;
        },
        () => { // LD D,d8
            this.m_registers[this.R.D] = this.m_mmu.read(++this.m_PC[0]);
            return 8;
        },
        this.RL,
        this.JR,
        () => { // ADD HL,DE
            let rVal = this.getHL();
            this.setHL(this.getHL() + this.getDE());
            this.setN(false);
            this.setH((this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
            this.setC(this.getHL() < rVal);
            return 8;
        },
        () => { // LD A,(DE)
            this.m_registers[this.R.A] = this.m_mmu.read(this.getDE());
            return 8;
        },
        () => { // DEC DE
            this.setDE(this.getDE() - 1);
            return 8;
        },
        () => { // INC E
            this.m_registers[this.R.E] += 1;
            this.setZ(this.m_registers[this.R.E] == 0x00);
            this.setH((this.m_registers[this.R.E]! & 0x0F) == 0x00);
            this.setN(false);
            return 4;
        },
        () => { // DEC E
            this.m_registers[this.R.E] -= 1;
            this.setZ(this.m_registers[this.R.E] == 0x00);
            this.setH((this.m_registers[this.R.E]! & 0x0F) == 0x0F);
            this.setN(true);
            return 4;
        },
        () => { // LD E,d8
            this.m_registers[this.R.E] = this.m_mmu.read(++this.m_PC[0]);
            return 8;
        },
        this.RR,
        this.JR,
        () => { // LD HL,d16
            this.m_registers[this.R.L] = this.m_mmu.read(++this.m_PC[0]);
            this.m_registers[this.R.H] = this.m_mmu.read(++this.m_PC[0]);
            return 12;
        },
        () => { // LD (HL+),A
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.A]!);
            this.setHL(this.getHL() + 1);
            return 8;
        },
        () => { // INC HL
            this.setHL(this.getHL() + 1);
            return 8;
        },
        () => { // INC H
            this.m_registers[this.R.H] += 1;
            this.setZ(this.m_registers[this.R.H] == 0x00);
            this.setH((this.m_registers[this.R.H]! & 0x0F) == 0x00);
            this.setN(false);
            return 4;
        },
        () => { // DEC H
            this.m_registers[this.R.H] -= 1;
            this.setZ(this.m_registers[this.R.H] == 0x00);
            this.setH((this.m_registers[this.R.H]! & 0x0F) == 0x0F);
            this.setN(true);
            return 4;
        },
        () => { // LD H,d8
            this.m_registers[this.R.H] = this.m_mmu.read(++this.m_PC[0]);
            return 8;
        },
        this.DAA,
        this.JR,
        () => { // ADD HL,HL
            let rVal = this.getHL();
            this.setHL(this.getHL() + this.getHL());
            this.setN(false);
            this.setH((this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
            this.setC(this.getHL() < rVal);
            return 8;
        },
        () => { // LD A,(HL+)
            this.m_registers[this.R.A] = this.m_mmu.read(this.getHL());
            this.setHL(this.getHL() + 1);
            return 8;
        },
        () => { // DEC HL
            this.setHL(this.getHL() - 1);
            return 8;
        },
        () => { // INC L
            this.m_registers[this.R.L] += 1;
            this.setZ(this.m_registers[this.R.L] == 0x00);
            this.setH((this.m_registers[this.R.L]! & 0x0F) == 0x00);
            this.setN(false);
            return 4;
        },
        () => { // DEC L
            this.m_registers[this.R.L] -= 1;
            this.setZ(this.m_registers[this.R.L] == 0x00);
            this.setH((this.m_registers[this.R.L]! & 0x0F) == 0x0F);
            this.setN(true);
            return 4;
        },
        () => { // LD L,d8
            this.m_registers[this.R.L] = this.m_mmu.read(++this.m_PC[0]);
            return 8;
        },
        () => { // CPL
            this.m_registers[this.R.A] = 0xFF - this.m_registers[this.R.A]!;
            this.setN(true);
            this.setH(true);
            return 4;
        },
        this.JR,
        () => { // LD SP,d16
            this.m_SP[0] = this.m_mmu.read(++this.m_PC[0]) + (this.m_mmu.read(++this.m_PC[0]) << 8);
            return 12;
        },
        () => { // LD (HL-),A
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.A]!);
            this.setHL(this.getHL() - 1);
            return 8;
        },
        () => { // INC SP
            this.m_SP[0] += 1;
            return 8;
        },
        () => { // INC (HL)
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) + 1);
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.setH((this.m_mmu.read(this.getHL()) & 0x0F) == 0x00);
            this.setN(false);
            return 12;
        },
        () => { // DEC (HL)
            this.m_mmu.write(this.getHL(), this.m_mmu.read(this.getHL()) - 1);
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.setH((this.m_mmu.read(this.getHL()) & 0x0F) == 0x0F);
            this.setN(true);
            return 12;
        },
        () => { // LD (HL),d8
            this.m_mmu.write(this.getHL(), this.m_mmu.read(++this.m_PC[0]));
            return 8;
        },
        () => { // SCF
            this.setN(false);
            this.setH(false);
            this.setC(true);
            return 4;
        },
        this.JR,
        () => { // ADD HL,SP
            let rVal = this.getHL();
            this.setHL(this.getHL() + this.m_SP[0]!);
            this.setN(false);
            this.setH((this.getHL() & 0x0FFF) < (rVal & 0x0FFF));
            this.setC(this.getHL() < rVal);
            return 8;
        },
        () => { // LD A,(HL-)
            this.m_registers[this.R.A] = this.m_mmu.read(this.getHL());
            this.setHL(this.getHL() - 1);
            return 8;
        },
        () => { // DEC SP
            this.m_SP[0] -= 1;
            return 8;
        },
        () => { // INC A
            this.m_registers[this.R.A] += 1;
            this.setZ(this.m_registers[this.R.A] == 0x00);
            this.setH((this.m_registers[this.R.A]! & 0x0F) == 0x00);
            this.setN(false);
            return 4;
        },
        () => { // DEC A
            this.m_registers[this.R.A] -= 1;
            this.setZ(this.m_registers[this.R.A] == 0x00);
            this.setH((this.m_registers[this.R.A]! & 0x0F) == 0x0F);
            this.setN(true);
            return 4;
        },
        () => { // LD A,d8
            this.m_registers[this.R.A] = this.m_mmu.read(++this.m_PC[0]);
            return 8;
        },
        () => { // CCF
            this.setN(false);
            this.setH(false);
            this.setC(!this.getC());
            return 4;
        },
        () => { // LD B,B
            this.m_registers[this.R.B] = this.m_registers[this.R.B]!;
            return 4;
        },
        () => { // LD B,C
            this.m_registers[this.R.B] = this.m_registers[this.R.C]!;
            return 4;
        },
        () => { // LD B,D
            this.m_registers[this.R.B] = this.m_registers[this.R.D]!;
            return 4;
        },
        () => { // LD B,E
            this.m_registers[this.R.B] = this.m_registers[this.R.E]!;
            return 4;
        },
        () => { // LD B,H
            this.m_registers[this.R.B] = this.m_registers[this.R.H]!;
            return 4;
        },
        () => { // LD B,L
            this.m_registers[this.R.B] = this.m_registers[this.R.L]!;
            return 4;
        },
        () => { // LD B,(HL)
            this.m_registers[this.R.B] = this.m_mmu.read(this.getHL());
            return 8;
        },
        () => { // LD B,A
            this.m_registers[this.R.B] = this.m_registers[this.R.A]!;
            return 4;
        },
        () => { // LD C,B
            this.m_registers[this.R.C] = this.m_registers[this.R.B]!;
            return 4;
        },
        () => { // LD C,C
            this.m_registers[this.R.C] = this.m_registers[this.R.C]!;
            return 4;
        },
        () => { // LD C,D
            this.m_registers[this.R.C] = this.m_registers[this.R.D]!;
            return 4;
        },
        () => { // LD C,E
            this.m_registers[this.R.C] = this.m_registers[this.R.E]!;
            return 4;
        },
        () => { // LD C,H
            this.m_registers[this.R.C] = this.m_registers[this.R.H]!;
            return 4;
        },
        () => { // LD C,L
            this.m_registers[this.R.C] = this.m_registers[this.R.L]!;
            return 4;
        },
        () => { // LD C,(HL)
            this.m_registers[this.R.C] = this.m_mmu.read(this.getHL());
            return 8;
        },
        () => { // LD C,A
            this.m_registers[this.R.C] = this.m_registers[this.R.A]!;
            return 4;
        },
        () => { // LD D,B
            this.m_registers[this.R.D] = this.m_registers[this.R.B]!;
            return 4;
        },
        () => { // LD D,C
            this.m_registers[this.R.D] = this.m_registers[this.R.C]!;
            return 4;
        },
        () => { // LD D,D
            this.m_registers[this.R.D] = this.m_registers[this.R.D]!;
            return 4;
        },
        () => { // LD D,E
            this.m_registers[this.R.D] = this.m_registers[this.R.E]!;
            return 4;
        },
        () => { // LD D,H
            this.m_registers[this.R.D] = this.m_registers[this.R.H]!;
            return 4;
        },
        () => { // LD D,L
            this.m_registers[this.R.D] = this.m_registers[this.R.L]!;
            return 4;
        },
        () => { // LD D,(HL)
            this.m_registers[this.R.D] = this.m_mmu.read(this.getHL());
            return 8;
        },
        () => { // LD D,A
            this.m_registers[this.R.D] = this.m_registers[this.R.A]!;
            return 4;
        },
        () => { // LD E,B
            this.m_registers[this.R.E] = this.m_registers[this.R.B]!;
            return 4;
        },
        () => { // LD E,C
            this.m_registers[this.R.E] = this.m_registers[this.R.C]!;
            return 4;
        },
        () => { // LD E,D
            this.m_registers[this.R.E] = this.m_registers[this.R.D]!;
            return 4;
        },
        () => { // LD E,E
            this.m_registers[this.R.E] = this.m_registers[this.R.E]!;
            return 4;
        },
        () => { // LD E,H
            this.m_registers[this.R.E] = this.m_registers[this.R.H]!;
            return 4;
        },
        () => { // LD E,L
            this.m_registers[this.R.E] = this.m_registers[this.R.L]!;
            return 4;
        },
        () => { // LD E,(HL)
            this.m_registers[this.R.E] = this.m_mmu.read(this.getHL());
            return 8;
        },
        () => { // LD E,A
            this.m_registers[this.R.E] = this.m_registers[this.R.A]!;
            return 4;
        },
        () => { // LD H,B
            this.m_registers[this.R.H] = this.m_registers[this.R.B]!;
            return 4;
        },
        () => { // LD H,C
            this.m_registers[this.R.H] = this.m_registers[this.R.C]!;
            return 4;
        }, 
        () => { // LD H,D
            this.m_registers[this.R.H] = this.m_registers[this.R.D]!;
            return 4;
        },
        () => { // LD H,E
            this.m_registers[this.R.H] = this.m_registers[this.R.E]!;
            return 4;
        },
        () => { // LD H,H
            this.m_registers[this.R.H] = this.m_registers[this.R.H]!;
            return 4;
        },
        () => { // LD H,L
            this.m_registers[this.R.H] = this.m_registers[this.R.L]!
            return 4;
        },
        () => { // LD H,(HL)
            this.m_registers[this.R.H] = this.m_mmu.read(this.getHL());
            return 8;
        },
        () => { // LD H,A
            this.m_registers[this.R.H] = this.m_registers[this.R.A]!;
            return 4;
        },
        () => { // LD L,B
            this.m_registers[this.R.L] = this.m_registers[this.R.B]!;
            return 4;
        },
        () => { // LD L,C
            this.m_registers[this.R.L] = this.m_registers[this.R.C]!;
            return 4;
        },
        () => { // LD L,D
            this.m_registers[this.R.L] = this.m_registers[this.R.D]!;
            return 4;
        },
        () => { // LD L,E
            this.m_registers[this.R.L] = this.m_registers[this.R.E]!;
            return 4;
        },
        () => { // LD L,H
            this.m_registers[this.R.L] = this.m_registers[this.R.H]!;
            return 4;
        },
        () => { // LD L,L
            this.m_registers[this.R.L] = this.m_registers[this.R.L]!;
            return 4;
        },
        () => { // LD L,(HL)
            this.m_registers[this.R.L] = this.m_mmu.read(this.getHL());
            return 8;
        },
        () => { // LD L,A
            this.m_registers[this.R.L] = this.m_registers[this.R.A]!;
            return 4;
        },
        () => { // LD (HL),B
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.B]!);
            return 8;
        },
        () => { // LD (HL),C
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.C]!);
            return 8;
        },
        () => { // LD (HL),D
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.D]!);
            return 8;
        },
        () => { // LD (HL),E
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.E]!);
            return 8;
        },
        () => { // LD (HL),H
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.H]!);
            return 8;
        },
        () => { // LD (HL),L
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.L]!);
            return 8;
        },
        () => { // HALT
            this.m_isHalted = true;
            return 4;
        },
        () => { // LD (HL),A
            this.m_mmu.write(this.getHL(), this.m_registers[this.R.A]!);
            return 8;
        },
        () => { // LD A,B
            this.m_registers[this.R.A] = this.m_registers[this.R.B]!;
            return 4;
        },
        () => { // LD A,C
            this.m_registers[this.R.A] = this.m_registers[this.R.C]!;
            return 4;
        },
        () => { // LD A,D
            this.m_registers[this.R.A] = this.m_registers[this.R.D]!;
            return 4;
        },
        () => { // LD A,E
            this.m_registers[this.R.A] = this.m_registers[this.R.E]!;
            return 4;
        },
        () => { // LD A,H
            this.m_registers[this.R.A] = this.m_registers[this.R.H]!;
            return 4;
        },
        () => { // LD A,L
            this.m_registers[this.R.A] = this.m_registers[this.R.L]!;
            return 4;
        },
        () => { // LD A,(HL)
            this.m_registers[this.R.A] = this.m_mmu.read(this.getHL());
            return 8;
        },
        () => { // LD A,A
            this.m_registers[this.R.A] = this.m_registers[this.R.A]!;
            return 4;
        },
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
        () => { // POP BC
            this.m_registers[this.R.C] = this.m_mmu.read(this.m_SP[0]++);
            this.m_registers[this.R.B] = this.m_mmu.read(this.m_SP[0]++);
            return 12;
        },
        this.JP,
        this.JP,
        this.CALL,
        () => { // PUSH BC
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.B]!);
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.C]!);
            return 16;
        },
        this.ADD,
        this.RST,
        this.RET,
        this.RET,
        this.JP,
        () => { // PREFIX CB
            this.m_cbPrefix = true;
            let x = this.m_instructionMethods2[this.m_mmu.read(++this.m_PC[0])]!.call(this);
            this.m_cbPrefix = false;
            return x;
        },
        this.CALL,
        this.CALL,
        this.ADD,
        this.RST,
        this.RET,
        () => { // POP DE
            this.m_registers[this.R.E] = this.m_mmu.read(this.m_SP[0]++);
            this.m_registers[this.R.D] = this.m_mmu.read(this.m_SP[0]++);
            return 12;
        },
        this.JP,
        this.opcode00,
        this.CALL,
        () => { // PUSH DE
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.D]!);
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.E]!);
            return 16;
        },
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
        () => { // LD (a8),A
            this.m_mmu.write(0xFF00 +this.m_mmu.read(++this.m_PC[0]), this.m_registers[this.R.A]!);
            return 12;
        },
        () => { // POP HL
            this.m_registers[this.R.L] = this.m_mmu.read(this.m_SP[0]++);
            this.m_registers[this.R.H] = this.m_mmu.read(this.m_SP[0]++);
            return 12;
        },
        () => { // LD (C),A
            this.m_mmu.write(0xFF00 + this.m_registers[this.R.C]!, this.m_registers[this.R.A]!);
            return 8;
        },
        this.opcode00,
        this.opcode00,
        () => { // PUSH HL
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.H]!);
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.L]!);
            return 16;
        },
        this.AND,
        this.RST,
        () => { // ADD SP,r8
            let nVal = this.m_mmu.read(++this.m_PC[0]) << 24 >> 24;
            let rVal = this.m_SP[0]!;
            this.m_SP[0] += nVal;
            this.setZ(false);
            this.setN(false);
            this.setH(((this.m_SP[0]! ^ rVal ^ nVal) & 0x0010) == 0x0010);
            this.setC(((this.m_SP[0]! ^ rVal ^ nVal) & 0x0100) == 0x0100);
            return 16;
        },
        this.JP,
        () => { // LD (a16),A
            this.m_mmu.write(this.m_mmu.read(++this.m_PC[0]) + (this.m_mmu.read(++this.m_PC[0]) << 8), this.m_registers[this.R.A]!);
            return 16;
        },
        this.opcode00,
        this.opcode00,
        this.opcode00,
        this.XOR,
        this.RST,
        () => { // LD A,(a8)
            this.m_registers[this.R.A] = this.m_mmu.read(0xFF00 + this.m_mmu.read(++this.m_PC[0]));
            return 12;
        },
        () => { // POP AF
            this.m_registers[this.R.F] = this.m_mmu.read(this.m_SP[0]++) & 0xF0;
            this.m_registers[this.R.A] = this.m_mmu.read(this.m_SP[0]++);
            return 12;
        },
        () => { // LD A,(C)
            this.m_registers[this.R.A] = this.m_mmu.read(0xFF00 + this.m_registers[this.R.C]!);
            return 8;
        },
        () => { // DI
            this.IME = false;
            return 4;
        },
        this.opcode00,
        () => { // PUSH AF
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.A]!);
            this.m_mmu.write(--this.m_SP[0], this.m_registers[this.R.F]!);
            return 16;
        },
        this.OR,
        this.RST,
        () => { // LD HL,SP+r8
            let val = (this.m_mmu.read(++this.m_PC[0]) << 24 >> 24);
            this.setHL(this.m_SP[0]! + val);
            this.setZ(false);
            this.setN(false);
            this.setH(((this.m_SP[0]! ^ this.getHL() ^ val) & 0x0010) == 0x0010);
            this.setC(((this.m_SP[0]! ^ this.getHL() ^ val) & 0x0100) == 0x0100);
            return 12;
        },
        () => { // LD SP,HL
            this.m_SP[0] = this.getHL();
            return 8;
        },
        () => { // LD A,(a16)
            this.m_registers[this.R.A] = this.m_mmu.read(this.m_mmu.read(++this.m_PC[0]) + (this.m_mmu.read(++this.m_PC[0]) << 8));
            return 16;
        },
        () => { // EI
            this.IME = true;
            return 4;
        },
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

    public m_sysClock: number;
    public m_jstate1: number;
    public m_jstate2: number;
    public m_BIOSMapped: boolean;

    private m_PC;
    private m_SP;
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

    // private debug = false;
    
    constructor(
        private m_mmu: MMU
    ){
        this.m_jstate1 = 0;
        this.m_jstate2 = 0;
        this.m_BIOSMapped = true;

        this.m_PC = new Uint16Array([0]);
        this.m_SP = new Uint16Array([0]);
        this.m_clock = 0;
        this.m_sysClock = 0;
        this.m_registers = new Uint8Array(8);

        this.IME = false;
        this.m_cbPrefix = false;
        this.m_isHalted = false;
        this.m_fallingEdgeDelay = false;
    }

    public step(){
        if(!(this.m_mmu.read(this.P1) & 0x10)){
            this.m_mmu.write(this.P1, this.m_mmu.read(this.P1) | this.m_jstate1);
        }
        else{
            this.m_mmu.write(this.P1, this.m_mmu.read(this.P1) | this.m_jstate2);
        }

        if(this.m_sysClock == 0){
            this.getInput();
            this.m_sysClock = 1000;
        }
        else{
            this.m_sysClock -= 1;
        }
    
        this.updateTimer();
        this.checkForInterupts();
    
        if(!this.m_isHalted){
            if(this.m_clock == 0){
                this.execute(this.m_mmu.read(this.m_PC[0]!));
            }
            this.m_clock -= 1;
        }
    }

    private getInput(){
        if(false){ // Right key down event
            this.m_jstate1 &= 0xFE;
        }
        else{
            if(!(this.m_jstate1 & 0x01)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate1 |= 0x01;
        }
        if(false){ // Left key down event
            this.m_jstate1 &= 0xFD;
        }
        else{
            if(!(this.m_jstate1 & 0x02)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate1 |= 0x02;
        }
        if(false){ // Up key down event
            this.m_jstate1 &= 0xFB;
        }
        else{
            if(!(this.m_jstate1 & 0x04)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate1 |= 0x04;
        }
        if(false){ // Down key down event
            this.m_jstate1 &= 0xF7;
        }
        else{
            if(!(this.m_jstate1 & 0x08)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate1 |= 0x08;
        }
        if(false){ // S key down event
            this.m_jstate2 &= 0xFE;
        }
        else{
            if(!(this.m_jstate2 & 0x01)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate2 |= 0x01;
        }
        if(false){ // A key down event
            this.m_jstate2 &= 0xFD;
        }
        else{
            if(!(this.m_jstate2 & 0x02)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate2 |= 0x02;
        }
        if(false){ // RShift key down event
            this.m_jstate2 &= 0xFB;
        }
        else{
            if(!(this.m_jstate2 & 0x04)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate2 |= 0x04;
        }
        if(false){ // Enter key down event
            this.m_jstate2 &= 0xF7;
        }
        else{
            if(!(this.m_jstate2 & 0x08)){
                this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) | 0x10);
            }
            this.m_jstate2 |= 0x08;
        }
    }

    private updateTimer(){
        let div = (this.m_mmu.read(this.DIV) << 8) + this.m_mmu.read(this.DIV + 1);
        div += 1;
        if((this.m_mmu.read(this.TAC) & 0x04) > 0){
            let sum = this.m_mmu.read(this.TIMA);
            if((this.m_mmu.read(this.TAC) & 0x03) > 0){
                if((div & (0x0002 << ((this.m_mmu.read(this.TAC) & 0x03) * 2))) > 0){
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
                if((div & 0x0200) > 0){
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
        this.m_mmu.write(this.DIV, (div >> 8) & 0x00FF);
        this.m_mmu.write(this.DIV + 1, div & 0x00FF);
    }

    private checkForInterupts(){
        if(this.m_mmu.read(this.IF) > 0x00 && this.m_mmu.read(this.IE) > 0x00){ // Interupt Request flag
            let mask = 0x01;
            for(let i = 0; i < 5; i++){
                if((this.m_mmu.read(this.IF) & mask) && (this.m_mmu.read(this.IE) & mask)){
                    this.m_isHalted = false;

                    if(this.IME){
                        this.IME = false;
                        this.m_mmu.write(this.IF, this.m_mmu.read(this.IF) & (0xFF - mask));
                        this.m_mmu.write(--this.m_SP[0], this.m_PC[0]! >> 8);
                        this.m_mmu.write(--this.m_SP[0], this.m_PC[0]! & 0x00FF);
                        this.m_PC[0] = 0x0040 + (i * 8);
                        this.m_clock = 4;
                    }

                    break;
                }
                mask = mask << 1;
            }
        }
    }

    private execute(instruction: number){
        // if(this.counter > 0){
        //     this.debug = true;
        //     this.counter -= 1;
        // }
        // else{
        //     this.debug = false;
        // }

        // if(this.debug){
        //     console.log('PC: 0x' + this.m_PC[0]!.toString(16))
        //     console.log('inst: 0x' + instruction.toString(16))
        //     console.log("A:" + this.m_registers[this.R.A]!.toString(16) + " F:" + this.m_registers[this.R.F]!.toString(16))
        //     console.log("B:" + this.m_registers[this.R.B]!.toString(16) + " C:" + this.m_registers[this.R.C]!.toString(16))
        //     console.log("D:" + this.m_registers[this.R.D]!.toString(16) + " E:" + this.m_registers[this.R.E]!.toString(16))
        //     console.log("H:" + this.m_registers[this.R.H]!.toString(16) + " L:" + this.m_registers[this.R.L]!.toString(16))
        //     console.log('SP: 0x' + this.m_SP[0]!.toString(16));
        //     console.log('')
        //     //this.counter -= 1;
        // }

        this.m_clock = this.m_instructionMethods1[instruction]!.call(this);
        this.m_PC[0] += 1;
    }

    private JP(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x01){
            this.m_PC[0] = (this.getHL() - 1) & 0xFFFF;
            return 4;
        }
        else{
            let lVal = this.m_mmu.read(++this.m_PC[0]);
            let hVal = this.m_mmu.read(++this.m_PC[0]);

            if(reg2 == 0x02){
                switch(reg1){
                    case 0x00:
                        if(this.getZ()){return 12;}
                        break;
                    case 0x01:
                        if(!this.getZ()){return 12;}
                        break;
                    case 0x02:
                        if(this.getC()){return 12;}
                        break;
                    case 0x03:
                        if(!this.getC()){return 12;}
                        break;
                    default:
                        break;
                }
            }

            this.m_PC[0] = ((hVal << 8) + lVal - 1) & 0xFFFF;;
            return 16;
        }
    }

    private JR(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let reg1 = (instruction & 0b00111000) >> 3;
        let nVal = this.m_mmu.read(++this.m_PC[0])

        if(reg1 != 0x03){
            switch(reg1){
                case 0x04:
                    if(this.getZ()){return 8;}
                    break;
                case 0x05:
                    if(!this.getZ()){return 8;}
                    break;
                case 0x06:
                    if(this.getC()){return 8;}
                    break;
                case 0x07:
                    if(!this.getC()){return 8;}
                    break;
                default:
                    break;
            }
        }

        this.m_PC[0] += (nVal << 24 >> 24);
        return 12;
    }

    private ADD(): number{
        let rVal = this.m_registers[this.R.A]!;
        let nVal = 0;
        let carry = 0;
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let op = (instruction & 0b11000000) >> 6;
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        // Check if carry bit will be used
        if(reg1 == 0x01){
            carry = Number(this.getC());
        }

        // Get the value being used for the calculation with Register A
        if(op == 0x03){
            nVal = this.m_mmu.read(++this.m_PC[0]);
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
        return 4;
    }

    private SUB(): number{
        let rVal = this.m_registers[this.R.A]!;
        let nVal = 0;
        let carry = 0;
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let op = (instruction & 0b11000000) >> 6;
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(reg1 == 0x03){
            carry = Number(this.getC());
        }

        if(op == 0x03){
            nVal = this.m_mmu.read(++this.m_PC[0]);
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
        return 4;
    }

    private AND(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            this.m_registers[this.R.A] &= this.m_mmu.read(++this.m_PC[0]);
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
        return 4;
    }

    private XOR(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            this.m_registers[this.R.A] ^= this.m_mmu.read(++this.m_PC[0]);
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
        return 4;
    }

    private OR(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            this.m_registers[this.R.A] |= this.m_mmu.read(++this.m_PC[0]);
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
        return 4;
    }

    private CP(): number{
        let rVal = this.m_registers[this.R.A]!;
        let nVal = 0;
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let op = (instruction & 0b11000000) >> 6;
        let reg2 = instruction & 0b00000111;

        if(op == 0x03){
            nVal = this.m_mmu.read(++this.m_PC[0]);
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
        return 4;
    }

    private RLC(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
        return 8;
    }

    private RRC(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
            let rVal = <number> this.m_registers[reg2];

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
        return 4;
    }

    private RL(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
            let rVal = this.m_registers[reg2]!;

            this.m_registers[reg2] = ((rVal << 1) + Number(this.getC())) & 0xFF;
            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);

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
        return 8;
    }

    private RR(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
            let rVal = this.m_registers[reg2]!;

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
        return 8;
    }

    private SLA(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
            let rVal = this.m_registers[reg2]!;

            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);
            this.m_registers[reg2] = (rVal << 1) & 0xFF;

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    }

    private SRA(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);
            this.m_mmu.write(this.getHL(), (rVal >> 1) + (Number(this.getC()) << 7));            
            this.setC((rVal % 2) > 0);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2]!;

            // Calculate if Carry flag needs to be set
            this.setC(rVal >= 0b10000000);
            this.m_registers[reg2] = (rVal >> 1) + (Number(this.getC()) << 7);
            this.setC((rVal % 2) > 0);

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }

        // Set H and N flags to 0
        this.setH(false);
        this.setN(false);
        return 8;
    }

    private SWAP(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x06){
            let rVal = this.m_mmu.read(this.getHL());

            this.m_mmu.write(this.getHL(), (rVal << 4) + (rVal >> 4));

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_mmu.read(this.getHL()) == 0x00);
            this.m_clock = 16;
        }
        else{
            let rVal = this.m_registers[reg2]!;

            this.m_registers[reg2] = ((rVal << 4) + (rVal >> 4)) & 0xFF;

            // Calculate if Zero flag needs to be set
            this.setZ(this.m_registers[reg2] == 0);
            this.m_clock = 8;
        }

        // Set C, H and N flags to 0
        this.setC(false);
        this.setH(false);
        this.setN(false);
        return 8;
    }

    private SRL(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
            let rVal = this.m_registers[reg2]!;

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
        return 8;
    }

    private BIT(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
            this.setZ((this.m_registers[reg2]! & mask) == 0);
            this.m_clock = 8;
        }

        // Set H flag to 1, N flag to 0
        this.setH(true);
        this.setN(false);
        return 8;
    }

    private RES(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
        return 8;
    }

    private SET(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
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
        return 8;
    }

    private CALL(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        let lAddr = this.m_mmu.read(++this.m_PC[0]);
        let hAddr = this.m_mmu.read(++this.m_PC[0]);

        if(reg2 == 0x04){
            switch(reg1){
                case 0x00:
                    if(this.getZ()){return 12;}
                    break;
                case 0x01:
                    if(!this.getZ()){return 12;}
                    break;
                case 0x02:
                    if(this.getC()){return 12;}
                    break;
                case 0x03:
                    if(!this.getC()){return 12;}
                    break;
                default:
                    break;
            }
        }

        this.m_PC[0] += 1;
        this.m_mmu.write(--this.m_SP[0], (0xFF00 & this.m_PC[0]!) >> 8);
        this.m_mmu.write(--this.m_SP[0], 0x00FF & this.m_PC[0]!);
        this.m_PC[0] = (hAddr << 8) + lAddr - 1;
        return 24;
    }

    private RET(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let reg1 = (instruction & 0b00111000) >> 3;
        let reg2 = instruction & 0b00000111;

        if(reg2 == 0x00){
            this.m_clock = 8;
            switch(reg1){
                case 0x00:
                    if(this.getZ()){return 8;}
                    break;
                case 0x01:
                    if(!this.getZ()){return 8;}
                    break;
                case 0x02:
                    if(this.getC()){return 8;}
                    break;
                case 0x03:
                    if(!this.getC()){return 8;}
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

        let lAddr = this.m_mmu.read(this.m_SP[0]++);
        let hAddr = this.m_mmu.read(this.m_SP[0]++);
        this.m_PC[0] = (hAddr << 8) + lAddr - 1;
        return 16;
    }

    private RST(): number{
        let instruction = this.m_mmu.read(this.m_PC[0]!);
        let reg1 = (instruction & 0b00111000) >> 3;

        this.m_PC[0] += 1;
        this.m_mmu.write(--this.m_SP[0], (0xFF00 & this.m_PC[0]!) >> 8);
        this.m_mmu.write(--this.m_SP[0], 0x00FF & this.m_PC[0]!);
        this.m_PC[0] = (reg1 * 8) - 1;

        return 16;
    }

    private DAA(): number{
        if(!this.getN()){
            if(this.getC() || this.m_registers[this.R.A]! > 0x99){
                this.m_registers[this.R.A] = (this.m_registers[this.R.A]! + 0x60) & 0xFF;
                this.setC(true);
            }
            if(this.getH() || (this.m_registers[this.R.A]! & 0x0F) > 0x09){
                this.m_registers[this.R.A] = (this.m_registers[this.R.A]! + 0x06) & 0xFF;
            }
        }
        else if(this.getC()){
            if(this.getH()){
                this.m_registers[this.R.A] = (this.m_registers[this.R.A]! + 0x9A) & 0xFF;
            }
            else{
                this.m_registers[this.R.A] = (this.m_registers[this.R.A]! + 0xA0) & 0xFF;
            }
        }
        else if(this.getH()){
            this.m_registers[this.R.A] = (this.m_registers[this.R.A]! + 0xFA) & 0xFF;
        }

        // Calculate if Zero flag needs to be set
        this.setZ(this.m_registers[this.R.A] == 0);
        // Set Half-Carry flag to 0
        this.setH(false);
    
        return 4;
    }

    private STOP(): number{
        return 4;
    }

    // NOP
    private opcode00(): number{
        return 4;
    }

    // private getAF(){
    //     return (this.m_registers[this.R.A]!) << 8 + this.m_registers[this.R.F]!;
    // }

    private getBC(){
        return (this.m_registers[this.R.B]! << 8) + this.m_registers[this.R.C]!;
    }

    private getDE(){
        return (this.m_registers[this.R.D]! << 8) + this.m_registers[this.R.E]!;
    }

    private getHL(){
        return (this.m_registers[this.R.H]! << 8) + this.m_registers[this.R.L]!;
    }

    // private setAF(value: number): void{
    //     let hVal = (value >> 8) & 0x00FF;
    //     let lVal = value & 0x00F0;
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
