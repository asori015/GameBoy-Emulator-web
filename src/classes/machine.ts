import {CPU} from "./cpu"
import {GPU} from "./gpu"
import {MMU} from "./mmu"
import { Timer } from "./timer";
import { Keyboard } from "./keyboard";

export class Machine {
    private m_cpu: CPU;
    private m_mmu: MMU;
    private m_gpu: GPU;
    private m_timer: Timer;
    private m_keyboard: Keyboard;
    private m_inVBLANK: boolean;
    private m_frame;

    constructor(
        readonly m_file: File,
    ){
        this.m_frame = new Array(160 * 144).fill(0);

        this.m_mmu = new MMU(m_file);
        this.m_cpu = new CPU(this.m_mmu);
        this.m_gpu = new GPU(this.m_mmu, this.m_frame);
        this.m_timer = new Timer(this.m_mmu);
        this.m_keyboard = new Keyboard(this.m_mmu);

        this.m_inVBLANK = false;

        this.m_keyboard;
    }

    getFrame() {
        while(!this.m_mmu.m_isRomLoaded){
            return this.m_frame;
        }

        while(this.m_mmu.read(0xFF44) >= 0x90 && this.m_inVBLANK){
            this.m_cpu.step();
            this.m_gpu.step();
            this.m_timer.step();
            this.m_keyboard.step();
        }

        this.m_inVBLANK = false;

        while(this.m_mmu.read(0xFF44) < 0x90 && !this.m_inVBLANK){
            this.m_cpu.step();
            this.m_gpu.step();
            this.m_timer.step();
            this.m_keyboard.step();
        }

        this.m_inVBLANK = true;
        console.log(this.m_mmu.read(0xFF00));
        console.log(this.m_keyboard.m_jState1);
        console.log(this.m_keyboard.m_jState2);

        return this.m_frame;
    }
}
