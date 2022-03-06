<template>
    <div>
        <ul>
            <li v-for="(m, i, k) in modes" :key="k">
                <a @click="modeChange(m)">{{ m }}</a>
            </li>
        </ul>
        <button @click="openFrameModal(currentKeyFrame.position + 1)">Add Keyframe</button>
        <button @click="exporting = true">Export</button>
        <div 
            class="stage-container"
        >
            <svg>
                <path :d="d" fill="#000000" />
            </svg>
            <canvas ref="stage"></canvas>
        </div>
        <TimeLine 
            v-if="keyFrameManager.positionCount"
            :frame-count="keyFrameManager.positionCount"
        >
            <div 
                v-for="(frame, i) in keyFrameManager.frames"
                :key="`key-frame-${i}`"
                :slot="frame.position"
                
            >
                <a class="frame-marker" @click="setKeyFrame(frame)">{{frame.position}}</a>
                <a class="frame-editor" @click="openFrameModal(frame.position, i)">E</a>
                
            </div>
        </TimeLine>
        <AddPointModal 
            v-if="adding"
            :x="addPosition.x"
            :y="addPosition.y"
            :index="addIndex"
            @close="onPointModalClose" 
        />
        <FrameModal
            v-if="frameProps.adding"
            :frame="frameProps.frameToAdd"
            :index="frameProps.frameIndex"
            @close="frameProps.adding = false"
            @add-frame="addKeyFrame"
            @edit-frame="editKeyFrame"
        />
        <ExportModal v-if="exporting" @export-frames="onExport" @close="exporting = false" />
    </div>
</template>

<script>
import KeyFrameManager from '../classes/KeyFrameManager';
import { Modes, Types } from '../classes/ShapeEditor';
import AddPointModal from './AddPointModal.vue';
import FrameModal from './FrameModal.vue';
import ExportModal from './ExportModal.vue';
import TimeLine from './TimeLine.vue';
const modes = Modes;
const types = Types;
export default {
    components: {
        AddPointModal,
        FrameModal,
        ExportModal,
        TimeLine
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
            frameProps: {
                adding: false,
                frameToAdd: 2,
                frameIndex: -1
            },
            exporting: false
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
                console.log(e);
                const values = e.feilds.map(item => item.value);
                this.keyFrameManager.insertDirective(e.type, values, e.index >= 0 ? e.index : undefined);
                this.d = this.shape.render();
            }
            this.adding = false;
            this.addIndex = -1;
        },
        openFrameModal(frame, index){
            this.frameProps.frameToAdd = frame;
            this.frameProps.frameIndex = index !== undefined ? index : -1;
            this.frameProps.adding = true;
        },
        addKeyFrame(e){
            console.log(e);
            this.keyFrameManager.addKeyFrame(this.keyFrameManager.frames[0], e.frame);
        },
        editKeyFrame(e){
            this.keyFrameManager.frames[e.index].position = e.frame;
        },
        setKeyFrame(frame){
            this.currentKeyFrame = frame;
            this.editor.mapToDirectives(this.shape.directives);
        },
        onExport(e){
            console.log(this.keyFrameManager.exportFrames(e.name));
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