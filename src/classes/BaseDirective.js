export default class BaseDirective{
    constructor(name, isAbsolute, values){
        this.name = isAbsolute ? name.toUpperCase() : name.toLowerCase();
        this.values = values ? values : [];
        this.id = `${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}`;
    }
    updateValue(index, value){
        this.values[index] = value;
    }
    process(){
        return `${this.name} ${this.values.join(' ')}`
    }
}