import { NODE_TYPE } from "../const.ts";
import { Node } from "./Node.ts";

import type { TreeTraverser } from './bytes/TreeTraverser.ts';
import type { NODE_TYPE_E } from "../types.d.ts";

export class RootNode extends Node {
    public type: NODE_TYPE_E = NODE_TYPE.OTBM_MAP_HEADER;

    public version! : number;
    public width! : number;
    public height! : number;
    public itemMinorVersion! : number;
    public itemMajorVersion! : number;

    set(nodeBuffer : TreeTraverser) {
        this.version = nodeBuffer.escapeReadUint32LE();
        this.width = nodeBuffer.escapeReadUint16LE();
        this.height = nodeBuffer.escapeReadUint16LE();
        this.itemMinorVersion = nodeBuffer.escapeReadUint32LE();
        this.itemMajorVersion = nodeBuffer.escapeReadUint32LE();
    }
}