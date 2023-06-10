export class Machine {
    constructor(name) {
        this.name = name;
    }
    format() {
        return '${this.name}';
    }
}
