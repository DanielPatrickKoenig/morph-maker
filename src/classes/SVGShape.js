export default class SVGShape{
    constructor({directives, attributes}){
        this.directives = directives;
        this.attributes = attributes;
    }
    addDirective(directive, index){
        console.log(directive);
        if(index === undefined){
            this.directives.push(directive);
        }
        else {
            this.directives.splice(index, 0, directive);
        }
        
    }
    removeDirective(index){
        this.directives.splice(index, 1);
    }
    render(){
        // console.log(this.directives);
        return this.directives.map(item => item.process()).join('');
    }
}