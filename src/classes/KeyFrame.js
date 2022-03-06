import SVGShape from './SVGShape';
export default class KeyFrame{
    constructor(position = 0){
        this.position = position;
        this.shape = new SVGShape({directives:[]});
    }
    insertDirective(directive, index){
        this.shape.addDirective(directive, index);
    }
}