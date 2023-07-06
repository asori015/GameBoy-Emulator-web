import {MMU} from "./mmu"

export class Keyboard{
    constructor(
        private m_mmu: MMU,
    ){
        addEventListener("keydown", (event) => {
            this.getKeyDown(event);
        });

        addEventListener("keyup", (event) => {
            this.getKeyUp(event);
        });

        this.m_mmu;
    }

    private getKeyDown(event: KeyboardEvent){
        if(!event.repeat){
            console.log('Keydown' + event.code);
        }
    }

    private getKeyUp(event: KeyboardEvent){
        console.log('Keyup' + event.code);
    }
}
