export class Opcion {
    label: string;
    value: string;
    selected: boolean;

    constructor(value: string, label: string,selected: boolean){
        this.value = value;
        this.label = label;
        this.selected = selected;
    }
}
