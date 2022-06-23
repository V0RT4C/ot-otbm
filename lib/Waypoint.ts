import { NODE_TYPE } from "../const.ts";
import { NodeWithPosition } from "./NodeWithPosition.ts";

import type { TreeTraverser } from "./bytes/TreeTraverser.ts";

export class Waypoint extends NodeWithPosition {
    public type = NODE_TYPE.OTBM_WAYPOINT;
    public name! : string;

    public set(nodeBuffer : TreeTraverser) {
        this.name = nodeBuffer.escapeReadString();
        this._x = nodeBuffer.escapeReadUint16LE();
        this._y = nodeBuffer.escapeReadUint16LE();
        this._z = nodeBuffer.escapeReadByte();
    }
}