import { Byt3s } from './Bytes.ts';
import { OTBMNode } from "./OTBMNode.ts";
import { OTBM_MAP_VERSION, OTBM_NODE_TYPE } from "../const.ts";


export class OTBMRootNode extends OTBMNode {
    protected _type: OTBM_NODE_TYPE = OTBM_NODE_TYPE.OTBM_MAP_HEADER;

    private _version! : number;
    private _width! : number;
    private _height! : number;
    private _itemMajorVersion! : number;
    private _itemMinorVersion! : number;

    public set version(value : number){
      if (value > OTBM_MAP_VERSION.MAP_OTBM_3){
        throw new Error(`Map version cannot be greater than ${OTBM_MAP_VERSION.MAP_OTBM_3}`);
      }

      this._version = value;
    }

    public get version() { return this._version; }
    public set width(value : number) { this._width = value; }
    public get width() : number { return this._width; }
    public set height(value : number) { this._height = value; }
    public get height() : number { return this._height; }
    public set itemMajorVersion(value : number) { this._itemMajorVersion = value; }
    public get itemMajorVersion() : number { return this._itemMajorVersion; }
    public set itemMinorVersion(value : number) { this._itemMinorVersion = value; }
    public get itemMinorVersion() { return this._itemMinorVersion; }

    set(nodeBuffer : Byt3s) {
        this.version = nodeBuffer.escapeReadUint32LE();
        this._width = nodeBuffer.escapeReadUint16LE();
        this._height = nodeBuffer.escapeReadUint16LE();
        this._itemMajorVersion = nodeBuffer.escapeReadUint32LE();
        this._itemMinorVersion = nodeBuffer.escapeReadUint32LE();
    }

    public asRawObject(getFullBranch = true){
        const supValues = super.asRawObject(getFullBranch);
        return {
          ...supValues,
          version: this.version,
          width: this._width,
          height: this._height,
          itemMajorVersion: this._itemMajorVersion,
          itemMinorVersion: this._itemMinorVersion,
        }
      }
}