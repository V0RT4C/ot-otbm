import { Byt3s } from './Bytes.ts';
import { OTBMNodeWithPosition } from "./OTBMNodeWithPosition.ts";
import { OTBM_NODE_TYPE } from "../const.ts";


export class OTBMTown extends OTBMNodeWithPosition {
    protected _type = OTBM_NODE_TYPE.OTBM_TOWN;
    protected _townId! : number;
    protected _name!: string;

    public get townId() : number { return this._townId; }
    public set townId(value : number) { this._townId = value; }
    public get name() : string { return this._name; }
    public set name(value : string) { this._name = value; }

    public set(otbmBuffer : Byt3s){
        this._townId = otbmBuffer.escapeReadUint32LE();
        this._name = otbmBuffer.escapeReadString();
        this._x = otbmBuffer.escapeReadUint16LE();
        this._y = otbmBuffer.escapeReadUint16LE();
        this._z = otbmBuffer.escapeReadByte();
    }

    public asRawObject(getFullBranch = true) {
        const supValues = super.asRawObject(getFullBranch);
        return {
            name: this._name,
            z: this._z,
            ...supValues
        }
    }
}