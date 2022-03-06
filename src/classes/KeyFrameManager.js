import KeyFrame from './KeyFrame';
import ShapeEditor, { Types } from '../classes/ShapeEditor';
import MDirective from './MDirective';
import LDirective from './LDirective';
import SDirective from './SDirective';
import CDirective from './CDirective';
import ZDirective from './ZDirective';
export default class KeyFrameManager{
    constructor(stage, updateHandler, addHandler){
        this.updateHandler = updateHandler;
        this.addHandler = addHandler;
        this.editor = new ShapeEditor(stage, 1000, 800, updateHandler, addHandler);
        this.frames = [new KeyFrame()];
        this.positionCount = 100;
        
    }
    addKeyFrame(copyFrom, position, index){
        const frameCopy = this.copy(copyFrom);
        frameCopy.position = position ? position : copyFrom.position + 1;
        if(index === undefined){
            this.frames.push(frameCopy);
        }
        else{
            this.frames.splice(index, 0, frameCopy);
        }
        
    }
    removeKeyFrame(index){
        this.frames.splice(index, 1);
    }
    setUpdateHandler(handler){
        this.updateHandler = handler;
    }
    setAddHandler(handler){
        this.addHandler = handler;
    }
    copy(from){
        const kf = new KeyFrame();
        from.shape.directives.forEach(item => {
            const values = item.values.map(item => Number(item.toString()));
            const directive = this.insertDirective(item.name, values, undefined, item.id);
            kf.insertDirective(directive);
        });
        return kf;
    }
    insertDirective(type, values, index, id){
        let directive = null;
        switch(type.toLowerCase()){
            case Types.M:{
                directive = new MDirective(true, values);
                break;
            }
            case Types.L:{
                directive = new LDirective(true, values);
                break;
            }
            case Types.S:{
                directive = new SDirective(true, values);
                break;
            }
            case Types.C:{
                directive = new CDirective(true, values);
                break;
            }
            case Types.Z:{
                directive = new ZDirective(true);
                break;
            }
        }
        // if(id){
        //     directive.id = id;
        // }
        //  
        if(!id){
            this.frames.forEach(item => item.insertDirective(directive, index));
            this.editor.addDirective(directive, index);
        }
        return directive;
    }
}