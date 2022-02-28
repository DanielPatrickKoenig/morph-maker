import BaseDirective from "./BaseDirective";

export default class LDirective extends BaseDirective{
    constructor(isAbsolute, _values){
        const values = _values ? _values : [0, 0];
        super('l', isAbsolute, values);
    }
}