import BaseDirective from "./BaseDirective";

export default class ZDirective extends BaseDirective{
    constructor(isAbsolute){
        super('z', isAbsolute);
    }
}