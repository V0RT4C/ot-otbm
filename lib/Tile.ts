import { NODE_TYPE } from "../const.ts";
import { NodeWithPosition } from "./NodeWithPosition.ts";

import type { TreeTraverser } from "./bytes/TreeTraverser.ts";
import type { TileArea } from "./TileArea.ts";

export class Tile extends NodeWithPosition {
    public type = NODE_TYPE.OTBM_TILE;

    public get relativeX() : number {
        return this._x;
    }

    public get relativeY() : number {
        return this._y;
    }

    public get realX() : number {
        if (this.parent){
            return (this.parent as TileArea).x + this._x;
        }
        else {
            return -1;
        }
    }

    public get realY() : number {
        if (this.parent){
            return (this.parent as TileArea).y + this._y;
        }
        else {
            return -1;
        }
    }

    public get z() : number {
        if (this.parent){
            return (this.parent as TileArea).z;
        }
        else {
            return -1;
        }
    }

    public set(nodeBuffer : TreeTraverser){
        this._x = nodeBuffer.escapeReadByte();
        this._y = nodeBuffer.escapeReadByte();
    }
}