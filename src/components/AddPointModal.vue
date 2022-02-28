<template>
    <ModalContent ref="modal">
        <select v-model="pointData.type" @change="setData">
            <option value="none">Select a type</option>
            <option v-for="(type, k, i) in types" :key="`type-${i}`" :value="type">
                {{ k }}
            </option>
        </select>
        <ul v-if="pointData.type">
            <li v-for="(feild, i) in pointData.feilds" :key="`field-${i}`">
                <label><span>{{feild.label}}</span><input v-model="pointData.feilds[i].value" :type="feild.type" /></label>
            </li>
        </ul>
        <button @click="okClicked">OK</button>
        <button @click="cancelClicked">Cancel</button>
    </ModalContent>
</template>

<script>
import { Types } from '../classes/ShapeEditor';
import ModalContent from './ModalContent.vue';
const types = Types;
export default {
    components: {
        ModalContent
    },
    props: {
        x: {
            type: Number,
            default: 0
        },
        y: {
            type: Number,
            default: 0
        },
        index: {
            type: Number,
            default: -1
        }
    },
    data(){
        return {
            types,    
            pointData: {
                type: 'none',
                index: this.index,
                feilds: [],
            }
        }
    },
    methods: {
        setData(){
            if(this.pointData.type !== 'none'){
                switch(this.pointData.type){
                    case Types.M:
                    case Types.L:
                    case Types.S:
                    case Types.C:{
                        this.pointData.feilds = [...new Array(this.getFieldCount()).keys()].map(item => {
                            const isEven = item === 0 || item % 2 === 0;
                            return {
                                label: isEven ? 'x' : 'y',
                                type: 'number',
                                value: isEven ? this.x : this.y
                            };
                        });
                        break;
                    }
                }
            }
            else{
                this.pointData.fields = [];
            }
            
        },
        getFieldCount(){
            let count = 0;
            switch(this.pointData.type){
                case Types.M:
                case Types.L:{
                    count = 2;
                    break;
                }
                case Types.S:{
                    count = 4;
                    break;
                }
                case Types.C:{
                    count = 6;
                    break;
                }
            }
            return count;
        },
        okClicked(){
            this.$emit('close', this.pointData);
        },
        cancelClicked(){
            this.$emit('close');
        }
    }
}
</script>

<style>

</style>