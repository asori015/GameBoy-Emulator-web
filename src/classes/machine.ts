export class Machine {
    constructor(
        readonly name: string
    ){}

    format(){
        return '${this.name}';
    }

    getFrame() {
        

        // while (*mmu->addrBus(0xFF44) >= 0x90 && inVBLANK_) {
        //     cpu->step();
        //     gpu->step();
        // }
    
        // inVBLANK_ = false;
    
        // //addressBus_[0xFF40] = 0x91;
        // while (*mmu->addrBus(0xFF44) < 0x90 && !inVBLANK_) {
        //     cpu->step();
        //     gpu->step();
        // }
    
        // inVBLANK_ = true;
    
        // return frame_;
    }
}
