import { Byt3s } from './Bytes.ts';
import { OTBMNode } from "./OTBMNode.ts";

export abstract class OTBMNodeWithPosition extends OTBMNode {
    protected _x! : number;
    protected _y! : number;
    protected _z! : number;

    public get x() : number { return this._x; }
    public set x(value : number) { this._x = value; }
    public get y() : number { return this._y; }
    public set y(value : number) { this._y = value; }
    public get z() : number { return this._z; }
    public set z(value : number) { this._z = value; } 

    public set(otbmBuffer : Byt3s){
        this._x = otbmBuffer.escapeReadUint16LE();
        this._y = otbmBuffer.escapeReadUint16LE();
        this._z = otbmBuffer.escapeReadByte();
    }

    public asRawObject(getFullBranch = true) {
        const supValues = super.asRawObject(getFullBranch);
        return {
            x: this._x,
            y: this._y,
            ...supValues
        }
    }
}