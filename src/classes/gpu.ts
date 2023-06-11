import {MMU} from "./mmu"

export class GPU {

    constructor(
        private m_mmu: MMU,
        private m_frame: number[]
    ){
        this.m_mmu;
        this.m_frame
    }

    step(){

    }
}