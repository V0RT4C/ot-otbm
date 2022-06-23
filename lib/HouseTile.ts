import { NODE_TYPE } from "../const.ts";
import { Tile } from "./Tile.ts";

import type { TreeTraverser } from "./bytes/TreeTraverser.ts";

export class HouseTile extends Tile {
    public type = NODE_TYPE.OTBM_HOUSETILE;
    public id! : number;

    public set(nodeBuffer : TreeTraverser) {
        this._x = nodeBuffer.escapeReadByte();
        this._y = nodeBuffer.escapeReadByte();
        this.id = nodeBuffer.escapeReadUint32LE();
    }
}