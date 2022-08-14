import { Byt3s } from './Bytes.ts';
import { OTBMNodeWithPosition } from "./OTBMNodeWithPosition.ts";
import { OTBM_NODE_TYPE } from "../const.ts";


export class OTBMWaypoint extends OTBMNodeWithPosition {
    protected _type = OTBM_NODE_TYPE.OTBM_WAYPOINT;
    protected _name! : string;

    public get name() : string { return this._name; }
    public set name(value : string) { this._name = value; }

    public set(otbmBuffer : Byt3s) {
        this._name = otbmBuffer.escapeReadString();
        this._x = otbmBuffer.escapeReadUint16LE();
        this._y = otbmBuffer.escapeReadUint16LE();
        this._z = otbmBuffer.escapeReadByte();
    }

    public asRawObject(getFullBranch = true) {
        const supValues = super.asRawObject(getFullBranch);
        return {
            name: this._name,
            ...supValues
        }
    }
}