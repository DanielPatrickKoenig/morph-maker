import SVGShape from './SVGShape';
export default class KeyFrame{
    constructor(){
        this.shape = new SVGShape({directives:[]});
    }
    insertDirective(directive, index){
        this.shape.addDirective(directive, index);
    }

}