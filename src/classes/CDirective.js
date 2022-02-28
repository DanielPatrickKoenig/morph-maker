import BaseDirective from "./BaseDirective";

export default class SDirective extends BaseDirective{
    constructor(isAbsolute, _values){
        const values = _values ? _values : [0, 0, 0, 0, 0, 0];
        super('c', isAbsolute, values);
    }
}