import BaseDirective from "./BaseDirective";

export default class MDirective extends BaseDirective{
    constructor(isAbsolute, _values){
        const values = _values ? _values : [0, 0];
        super('m', isAbsolute, values);
    }
}