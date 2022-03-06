import {PixiInstance, PixiAction, PixiDraw, PixiUtils} from '../utils/PixiManager.js'
import {createUniqueID} from '../utils/Utilities';
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
        this.lineProperties = { stroke: 0xdddddd, strokeWidth: 4, strokeOpacity: .75, fillOpacity: .0001 };
        this.insertLine = this.draw.line([{x: -10, y: -10}, {x: -20, y: -10}], this.lineProperties);
        this.instance.getApp().stage.addChild(this.insertLine);
        this.instance.getApp().stage.addChild(this.pointContainer);
        this.instance.getApp().stage.addChild(this.addButton);
        this.insertContainer = this.utils.sprite();
        this.instance.getApp().stage.addChild(this.insertContainer);
        this.action.click(this.addButton, (e) => {
            if(this.addHandler){
                this.addHandler({ x: e.x, y: e.y });
            }
        });
        this.setMode(Modes.EDIT);
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
    getDirectiveIndexByGroup(group){
        return this.directiveManifest
            .map((item, index) => {
                return { group: item.pointers[0].group, index }
            })
            .find(item => item.group === group).index;
    }
    addDirective(_directive, index){
        // const _index = index === undefined ? this.directiveManifest.length : index;
        const directive = _directive;
        const groupID = createUniqueID();
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
                pointer.group = groupID;
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
                            console.log(pointer.group);
                            this.updateHandler({ directive: this.directiveManifest[this.getDirectiveIndexByGroup(pointer.group)].directive, index, position: { x: e.x, y: e.y } });
                        }
                        this.arrangeInsertButtons();
                    }
                    
                });
                this.action.up(pointer, (e) => {
                    if(this.dragTarget === pointer){
                        if(this.updateHandler){
                            this.updateHandler({ directive: this.directiveManifest[this.getDirectiveIndexByGroup(pointer.group)].directive, index, position: { x: e.x, y: e.y } });
                        }
                        this.arrangeInsertButtons();
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
        if(this.getDirectivePositions().length > 1) {
            this.addInsertButton();
            this.arrangeInsertButtons();
        }
    }
    removeDirective(directive){
        const targetIndex = this.directiveManifest.map((item, index) => {
            return { index, id: item.id };
        }).find(item => item.id === directive.id).index;
        this.directiveManifest[targetIndex].pointers.forEach(item => {
            this.pointContainer.removeChild(item);
        });
        if(directive.name.toUpperCase() !== 'Z'){
            this.removeInsertButton();
        }
        this.directiveManifest.splice(targetIndex, 1);
    }
    addInsertButton(){
        const button = this.utils.sprite();
        const circle = this.draw.circle({ fill: 0xffffff, stroke: 0x000000, strokeWidth: 2, strokeOpacity: 1 });
        button.addChild(circle);
        this.action.click(button, (e) => {
            if(this.addHandler){
                this.addHandler({ x: e.x, y: e.y, index: button.name });
            }
        });
        this.insertContainer.addChild(button);
    }
    removeInsertButton(){
        if(this.insertContainer.children.length){
            this.insertContainer.removeChild(this.insertContainer.children[0]);
            this.arrangeInsertButtons();
        }
    }
    arrangeInsertButtons(){
        const positions = this.getDirectivePositions();
        this.insertContainer.children.forEach((item, index) => {
            item.name = index + 1;
            item.x = positions[index].x + ((positions[index + 1].x - positions[index].x) / 2);
            item.y = positions[index].y + ((positions[index + 1].y - positions[index].y) / 2)
        });
        this.insertLine = this.draw.line(positions, this.lineProperties, this.insertLine);

    }
    getDirectivePositions(){
        return this.directiveManifest
            .filter(item => item.directive.name.toUpperCase() !== 'Z')
            .map(item => {
                const pointer = item.pointers[item.pointers.length - 1]
                return { x: pointer.x, y: pointer.y };
            });
    }
    mapToDirectives(directives){
        // console.log(directives);
        const newManifest = directives.map((item, index) => {
            const pointers = this.directiveManifest[index].pointers;
            [...new Array(item.values.length / 2).keys()].forEach(_item => {
                console.log(pointers[_item]);
                if(pointers[_item]){
                    pointers[_item].x = item.values[_item * 2];
                    pointers[_item].y = item.values[(_item * 2) + 1];
                }
            });
            return { directive: item, pointers };
        });
        this.directiveManifest = newManifest;
        console.log(this.directiveManifest);
        this.arrangeInsertButtons();
        this.directiveManifest.forEach((item) => {
            item.pointers.forEach((_item, _index) => {
                this.updateHandler({ directive: item.directive, index: _index, position: {x: _item.x, y: _item.y} });
            });
        });
        
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