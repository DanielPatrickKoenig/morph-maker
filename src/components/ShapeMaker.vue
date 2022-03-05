<template>
    <div>
        <ul>
            <li v-for="(m, i, k) in modes" :key="k">
                <a @click="modeChange(m)">{{ m }}</a>
            </li>
        </ul>
        <button @click="addKeyFrame">Add Keyframe</button>
        <ul>
            <li 
                v-for="(frame, i) in keyFrameManager.frames"
                :key="`frame-${i}`"
            >
                <a @click="setKeyFrame(frame)">{{i}}</a>
            </li>
        </ul>
        <div 
            class="stage-container"
        >
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
import KeyFrameManager from '../classes/KeyFrameManager';
import { Modes, Types } from '../classes/ShapeEditor';
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
            keyFrameManager: {},
            currentKeyFrame: {},
            modes,
            types,
            adding: false,
            addPosition: {
                x: 0,
                y: 0
            },
            addIndex: -1,
        };
    },
    computed: {
        shape () {
            return this.currentKeyFrame ? this.currentKeyFrame.shape : null;
        },
        editor () {
            return this.keyFrameManager.editor ? this.keyFrameManager.editor : null;
        }
    },
    methods: {
        onShapeUpdate(data){
            console.log(data);
            console.log(this.editor.directiveManifest);
            const targetDirective = this.editor.directiveManifest.find(item => item.directive.id === data.directive.id).directive;
            // console.log(targetDirective);
            targetDirective.updateValue(data.index * 2, data.position.x);
            targetDirective.updateValue((data.index * 2) + 1, data.position.y);
            this.d = this.shape.render();
            console.log(this.keyFrameManager.frames.map(item => item.shape.directives[0].id));
            // console.log(data);
        },
        onAddPoint(position){
            // console.log('point added clicked');
            this.addPosition = position;
            this.addIndex = position.index === undefined ? -1 : position.index ;
            this.adding = true;
        },
        modeChange(mode){
            this.editor.setMode(mode);
        },
        onPointModalClose(e){
            if(e){
                const values = e.feilds.map(item => item.value);
                this.keyFrameManager.insertDirective(e.type, values, e.index >= 0 ? e.index : undefined);
                this.d = this.shape.render();
            }
            this.adding = false;
            this.addIndex = -1;
        },
        addKeyFrame(){
            this.keyFrameManager.addKeyFrame(this.keyFrameManager.frames[0]);
        },
        setKeyFrame(frame){
            this.currentKeyFrame = frame;
            this.editor.mapToDirectives(this.shape.directives);
        }
    },
    mounted () {
        this.keyFrameManager = new KeyFrameManager(this.$refs.stage, this.onShapeUpdate, this.onAddPoint);
        this.currentKeyFrame = this.keyFrameManager.frames[0];
        this.d = this.shape.render();
    }
}
</script>

<style>

</style>