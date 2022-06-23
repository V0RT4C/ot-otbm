import { NODE_TYPE } from "../const.ts";
import { Node } from "./Node.ts";

import type { TreeTraverser } from "./bytes/TreeTraverser.ts";

export class Item extends Node {
    public type = NODE_TYPE.OTBM_ITEM;
    public id! : number;

    public set(nodeBuffer: TreeTraverser){
        this.id = nodeBuffer.escapeReadUint16LE();
    }
}