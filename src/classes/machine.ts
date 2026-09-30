import {CPU} from "./cpu"
import {GPU} from "./gpu"
import {MMU} from "./mmu"
import {Timer} from "./timer";
import {Keyboard} from "./keyboard";
import {Audio} from "./audio"

export class Machine {
    private m_cpu: CPU;
    private m_mmu: MMU;
    private m_gpu: GPU;
    private m_timer: Timer;
    private m_keyboard: Keyboard;
    private m_audio: Audio;
    private m_inVBLANK: boolean;
    private m_frame: Uint16Array;
    private frameCounter: number;
    private readonly cyclesPerFrame = 70224;

    constructor(
        readonly m_file: File | Uint8Array,
    ){
        this.m_frame = new Uint16Array(160 * 144);

        this.m_mmu = new MMU(m_file);
        this.m_cpu = new CPU(this.m_mmu);
        this.m_gpu = new GPU(this.m_mmu, this.m_frame);
        this.m_timer = new Timer(this.m_mmu);
        this.m_keyboard = new Keyboard(this.m_mmu);
        this.m_audio = new Audio(this.m_mmu);

        this.m_inVBLANK = false;
        this.frameCounter = 0;
    }

    getFrame() {
        while(!this.m_mmu.m_isRomLoaded){
            return this.m_frame;
        }

        let cycles = 0;
        while(this.m_mmu.read(0xFF44) >= 0x90 && this.m_inVBLANK && !this.frameTimedOut(cycles)){
            cycles += this.tick();
        }

        this.m_inVBLANK = false;

        while(this.m_mmu.read(0xFF44) < 0x90 && !this.m_inVBLANK && !this.frameTimedOut(cycles)){
            cycles += this.tick();
        }

        if(this.frameCounter >= 59){
            this.frameCounter = 0;
            //this.m_mmu.saveRAM();
        }
        else{
            this.frameCounter += 1;
        }

        this.m_inVBLANK = true;

        return this.m_frame;
    }

    getSerialOutput(): string{
        return this.m_mmu.getSerialOutput();
    }

    getRegisters(): Uint8Array{
        return this.m_cpu.getRegisters();
    }

    readMemory(addr: number): number{
        return this.m_mmu.read(addr);
    }

    // Run one instruction, then advance the other components by the cycles it used
    private tick(): number{
        let cycles = this.m_cpu.step();
        this.m_gpu.step(cycles);
        this.m_timer.step(cycles);
        this.m_keyboard.step();
        this.m_audio.step(cycles);
        return cycles;
    }

    // LY stops advancing while the LCD is off, so end the frame after a frame's worth of cycles
    private frameTimedOut(cycles: number): boolean{
        return cycles >= this.cyclesPerFrame && (this.m_mmu.read(0xFF40) & 0x80) == 0;
    }
}
