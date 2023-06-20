import {CPU} from "./cpu"
import {GPU} from "./gpu"
import {MMU} from "./mmu"

export class Machine {
    private m_cpu: CPU;
    private m_mmu: MMU;
    private m_gpu: GPU;
    private m_inVBLANK: boolean;
    private m_frame;

    constructor(
        readonly m_path: File,
    ){
        this.m_frame = new Array(160 * 144).fill(0);

        this.m_mmu = new MMU(m_path);
        this.m_cpu = new CPU(this.m_mmu);
        this.m_gpu = new GPU(this.m_mmu, this.m_frame);

        this.m_inVBLANK = false;
        this.m_cpu;
        this.m_gpu;
        this.m_inVBLANK;
    }

    getFrame() {
        while(this.m_mmu.read(0xFF44) >= 0x90 && this.m_inVBLANK){
            this.m_cpu.step();
            this.m_gpu.step();
        }

        this.m_inVBLANK = false;

        while(this.m_mmu.read(0xFF44) < 0x90 && !this.m_inVBLANK){
            this.m_cpu.step();
            this.m_gpu.step();
        }

        this.m_inVBLANK = true;

        return this.m_frame;
    }
}
