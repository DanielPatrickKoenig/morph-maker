export default class SVGShape{
    constructor({directives, attributes}){
        this.directives = directives;
        this.attributes = attributes;
    }
    addDirective(directive, index){
        if(index === undefined){
            this.directives.push(directive);
        }
        else {
            this.directives.splice(index, 0, directive);
        }
        
    }
    render(){
        return this.directives.map(item => item.process()).join('');
    }
}