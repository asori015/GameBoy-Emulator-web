export class Machine {
    constructor(
        readonly name: string
    ){}

    format(){
        return '${this.name}';
    }
}
