import {PixiInstance, PixiAction, PixiDraw, PixiUtils} from '../utils/PixiManager.js'
export default class ShapeEditor{
    constructor(element, width, height, updateHandler, addHandler){
        this.width = width ? width : 1000;
        this.height = height ? height : 800;
        this.directiveManifest = [];
        this.instance = new PixiInstance(element, this.width, this.height, true);
        this.draw = new PixiDraw();
        this.action = new PixiAction();
        this.utils = new PixiUtils();
        this.dragTarget = null;
        this.updateHandler = updateHandler;
        this.addHandler = addHandler;
        this.pointContainer = this.utils.sprite();
        this.addButton = this.draw.rect({ width: this.width, height: this.height, fillOpacity: .1 });
        this.instance.getApp().stage.addChild(this.pointContainer);
        this.instance.getApp().stage.addChild(this.addButton);
        this.action.click(this.addButton, (e) => {
            if(this.addHandler){
                this.addHandler({ x: e.x, y: e.y });
            }
        })
        this.setMode(Modes.ADD);
    }
    setMode(mode){
        this.addButton.visible = mode === Modes.ADD;
    }
    setUpdateHandler(handler){
        this.updateHandler = handler;
    }
    setAddHandler(handler){
        this.addHandler = handler;
    }
    addDirective(directive, index){
        let pointers = [];
        if(directive.values.length > 1){
            pointers = [...new Array(directive.values.length / 2).keys()].map(item => {
                return {
                    x: directive.values[item * 2],
                    y: directive.values[(item * 2) + 1]
                }
            }).map((item, index) => {
                const outerCircle = this.draw.circle({radius: 8, fill: 0x000000});
                const innerCircle = this.draw.circle({radius: 5, fill: 0xFFFFFF});
                const pointer = this.utils.sprite();
                pointer.addChild(outerCircle);
                pointer.addChild(innerCircle);
                pointer.x = item.x;
                pointer.y = item.y;
                this.pointContainer.addChild(pointer);
                this.action.down(pointer, () => {
                    this.dragTarget = pointer;
                });
                this.action.move(pointer, (e) => {
                    if(this.dragTarget === pointer){
                        this.dragTarget.x = e.x;
                        this.dragTarget.y = e.y;
                        if(this.updateHandler){
                            this.updateHandler({ directive, index, position: { x: e.x, y: e.y } });
                        }
                    }
                    
                });
                this.action.up(pointer, (e) => {
                    if(this.dragTarget === pointer){
                        if(this.updateHandler){
                            this.updateHandler({ directive, index, position: { x: e.x, y: e.y } });
                        }
                    }
                    this.dragTarget = null;
                });
                return pointer;
            });
        }
        if(index === undefined){
            this.directiveManifest.push({ directive, pointers });
        }
        else {
            this.directiveManifest.splice(index, 0, { directive, pointers });
        }
    }
    removeDirective(directive){
        const targetIndex = this.directiveManifest.map((item, index) => {
            return { index, id: item.id };
        }).find(item => item.id === directive.id).index;
        this.directiveManifest[targetIndex].pointers.forEach(item => {
            this.pointContainer.removeChild(item);
        });
        this.directiveManifest.splice(targetIndex, 1);
    }
}
export const Modes = {
    ADD: 'add',
    EDIT: 'edit',
    MOVE: 'move'
};
export const Types = {
    M: 'm',
    L: 'l',
    S: 's',
    C: 'c',
    Z: 'z'
};