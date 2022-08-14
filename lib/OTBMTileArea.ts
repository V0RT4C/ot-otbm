import { OTBMNodeWithPosition } from "./OTBMNodeWithPosition.ts";
import { OTBM_NODE_TYPE } from "../const.ts";

export class OTBMTileArea extends OTBMNodeWithPosition {
    protected _type = OTBM_NODE_TYPE.OTBM_TILE_AREA;

    public asRawObject(getFullBranch = true) {
        const supValues = super.asRawObject(getFullBranch);
        return {
            z: this._z,
            ...supValues
        }
    }
}