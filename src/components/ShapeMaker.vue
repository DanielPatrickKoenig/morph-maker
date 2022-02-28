<template>
    <div>
        <ul>
            <li v-for="(m, i, k) in modes" :key="k">
                <a @click="modeChange(m)">{{ m }}</a>
            </li>
        </ul>
        <div class="stage-container">
            <svg>
                <path :d="d" fill="#000000" />
            </svg>
            <canvas ref="stage"></canvas>
        </div>
        <AddPointModal 
            v-if="adding"
            :x="addPosition.x"
            :y="addPosition.y"
            :index="addIndex"
            @close="onPointModalClose" 
        />
    </div>
</template>

<script>
import SVGShape from '../classes/SVGShape';
import MDirective from '../classes/MDirective';
import LDirective from '../classes/LDirective';
import SDirective from '../classes/SDirective';
import CDirective from '../classes/SDirective';
import ZDirective from '../classes/ZDirective';
import ShapeEditor, { Modes, Types } from '../classes/ShapeEditor';
import AddPointModal from './AddPointModal.vue';
const modes = Modes;
const types = Types;
export default {
    components: {
        AddPointModal
    },
    data(){
        return {
            d: '',
            shape: {},
            editor: {},
            modes,
            types,
            adding: false,
            addPosition: {
                x: 0,
                y: 0
            },
            addIndex: -1
        };
    },
    created(){
        // const directives = [
        //     new MDirective(true, [20, 18]),
        //     new SDirective(true, [30, 22 ,50, 18]),
        //     new SDirective(true, [50, 41, 58, 72]),
        //     new LDirective(true, [30, 68]),
        //     new ZDirective(true)
        // ];
        this.shape = new SVGShape({directives: []});
        this.d = this.shape.render();
        
        
    },
    methods: {
        onShapeUpdate(data){
            console.log(data);
            const targetDirective = this.editor.directiveManifest.find(item => item.directive.id === data.directive.id).directive;
            console.log(targetDirective);
            targetDirective.updateValue(data.index * 2, data.position.x);
            targetDirective.updateValue((data.index * 2) + 1, data.position.y);
            this.d = this.shape.render();
            // console.log(data);
        },
        onAddPoint(position){
            console.log('point added clicked');
            this.addPosition = position;
            this.adding = true;
        },
        modeChange(mode){
            this.editor.setMode(mode);
        },
        onPointModalClose(e){
            if(e){
                const values = e.feilds.map(item => item.value);
                let directive = null;
                switch(e.type){
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
                const index = e.index >= 0 ? e.index : undefined;
                this.editor.addDirective(directive, index);
                this.shape.addDirective(directive, index);
                this.d = this.shape.render();
            }
            this.adding = false;
            this.addIndex = -1;
        }
    },
    mounted () {
        this.editor = new ShapeEditor(this.$refs.stage);
        this.editor.setUpdateHandler(this.onShapeUpdate);
        this.editor.setAddHandler(this.onAddPoint);
        this.shape.directives.forEach(item => {
            this.editor.addDirective(item);
        })
    }
}
</script>

<style>

</style>