import { Byt3s } from './Bytes.ts';
import { OTBMTile } from "./OTBMTile.ts";
import { OTBM_NODE_TYPE } from "../const.ts";


export class OTBMHouseTile extends OTBMTile {
    protected _type = OTBM_NODE_TYPE.OTBM_HOUSETILE;
    protected _houseId! : number;

    public get houseId() : number { return this._houseId; }
    public set houseId(value : number) { this._houseId = value; }

    public set(otbmBuffer : Byt3s) {
        this._x = otbmBuffer.escapeReadByte();
        this._y = otbmBuffer.escapeReadByte();
        this._houseId = otbmBuffer.escapeReadUint32LE();
    }

    public asRawObject(getFullBranch = true) {
        const supValues = super.asRawObject(getFullBranch);
        return {
            houseId: this._houseId,
            ...supValues,
        }
    }
}