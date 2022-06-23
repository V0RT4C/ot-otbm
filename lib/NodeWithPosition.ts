import { Node } from "./Node.ts";

import type { TreeTraverser } from "./bytes/TreeTraverser.ts";

export abstract class NodeWithPosition extends Node {
    protected _x! : number;
    protected _y! : number;
    protected _z! : number;

    public get x() : number {
        return this._x;
    }

    public get y() : number {
        return this._y;
    }

    public get z() : number {
        return this._z;
    }

    public set(nodeBuffer : TreeTraverser){
        this._x = nodeBuffer.escapeReadUint16LE();
        this._y = nodeBuffer.escapeReadUint16LE();
        this._z = nodeBuffer.escapeReadByte();
    }
}