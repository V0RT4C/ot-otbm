import { Byt3s } from './Bytes.ts';
import { OTBMNodeWithPosition } from "./OTBMNodeWithPosition.ts";
import type { OTBMTileArea } from "./OTBMTileArea.ts";
import { OTBM_NODE_TYPE } from "../const.ts";

export class OTBMTile extends OTBMNodeWithPosition {
    protected _type = OTBM_NODE_TYPE.OTBM_TILE;

    public get realX() : number {
        if (this._parent){
            return (this._parent as OTBMTileArea).x + this._x;
        }
        else {
            return -1;
        }
    }

    public get realY() : number {
        if (this._parent){
            return (this._parent as OTBMTileArea).y + this._y;
        }
        else {
            return -1;
        }
    }

    public get z() : number {
        if (this._parent){
            return (this._parent as OTBMTileArea).z;
        }
        else {
            return -1;
        }
    }

    public set(otbmBuffer : Byt3s){
        this._x = otbmBuffer.escapeReadByte();
        this._y = otbmBuffer.escapeReadByte();
    }

    public asRawObject(getFullBranch = true) {
        const supValues = super.asRawObject(getFullBranch);
        return {
            realX: this.realX,
            realY: this.realY,
            z: this.z,
            ...supValues,
        }
    }
}