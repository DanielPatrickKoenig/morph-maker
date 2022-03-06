import {createUniqueID} from '../utils/Utilities';
export default class BaseDirective{
    constructor(name, isAbsolute, values){
        this.name = isAbsolute ? name.toUpperCase() : name.toLowerCase();
        this.values = values ? values : [];
        this.id = createUniqueID();
    }
    setId(id){
        this.id = id;
    }
    updateValue(index, value){
        this.values[index] = value;
    }
    process(){
        return `${this.name} ${this.values.join(' ')}`
    }
    copy(directive){
        this.name = directive.name;
        this.values = directive.values.map(item => Number(item));
    }
}