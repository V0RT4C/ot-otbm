import { Byt3s } from './Bytes.ts';
import { OTBMNode } from "./OTBMNode.ts";
import { OTBM_NODE_TYPE } from "../const.ts";


export class OTBMItem extends OTBMNode {
    protected _type = OTBM_NODE_TYPE.OTBM_ITEM;
    protected _id! : number;

    public get id() : number { return this._id; }
    public set id(value : number) { this._id = value; }

    public set(otbmBuffer: Byt3s){
        this.id = otbmBuffer.escapeReadUint16LE();
    }

    public asRawObject(getFullBranch = true) {
        const supValues = super.asRawObject(getFullBranch);
        return {
            id: this._id,
            ...supValues
        }
    }
}