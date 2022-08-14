import { Byt3s } from './Bytes.ts';
import { OTBM_ATTRIBUTE, OTBM_NODE_TYPE, OTBM_TILE_STATE, OTBM_NODE_SPECIAL_BYTE } from '../const.ts';
import { IOTBMNodeAttributes, IRawOTBMNode } from '../types.d.ts';

export abstract class OTBMNode {
    protected abstract _type : OTBM_NODE_TYPE;
    protected _attributes : IOTBMNodeAttributes = {};
    protected _parent : OTBMNode | null = null;
    protected _children : OTBMNode[] = [];
    protected _prevSibling : OTBMNode | null = null;
    protected _nextSibling : OTBMNode | null = null;

    public get type() : OTBM_NODE_TYPE { return this._type; }
    public set type(value : OTBM_NODE_TYPE) { this._type = value; }
    public get attributes() : IOTBMNodeAttributes { return this._attributes; }
    public set attributes(value : IOTBMNodeAttributes) { this._attributes = value; }
    public get parent() : OTBMNode | null { return this._parent; }
    public set parent(value : OTBMNode | null) { this._parent = value; }
    public get children() : OTBMNode[] { return this._children; }
    public get prevSibling() : OTBMNode | null { return this._prevSibling; }
    public set prevSibling(value : OTBMNode | null) { this._prevSibling = value; }
    public get nextSibling() : OTBMNode | null { return this._nextSibling; }
    public set nextSibling(value : OTBMNode | null) { this._nextSibling = value; }

    public get firstChild() : OTBMNode | null {
      return this._children[0] !== undefined ? this._children[0] : null;
    }

    public get lastChild() : OTBMNode | null {
      return this._children[this._children.length - 1] ? this._children[this._children.length - 1] : null;
    }

    public addChildOTBMNode(OTBMNode : OTBMNode){
      this._children.push(OTBMNode);
    }

    public removeChildOTBMNode(OTBMNode : OTBMNode) : boolean {
      let idx = -1;

      for (let i=0; i < this._children.length; i++){
        if (this._children[i] === OTBMNode){
          idx = i;
          this._children.splice(i, 1);
        }
      }

      return idx !== -1;
    }

    public setAttributes(otbmBuffer : Byt3s, OTBMNodeEndPos : number){

        while (otbmBuffer.position < OTBMNodeEndPos) {
          const byte = otbmBuffer.readByte();

          switch(byte){
            case OTBM_ATTRIBUTE.TEXT:
              if (otbmBuffer.peekByte() !== OTBM_NODE_SPECIAL_BYTE.START && otbmBuffer.peekByte() !== OTBM_NODE_SPECIAL_BYTE.END){
                this._attributes.text = otbmBuffer.escapeReadString();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.EXT_SPAWN_FILE:
              if ((otbmBuffer.position + otbmBuffer.escapePeekUint16LE()) <= OTBMNodeEndPos){
                this._attributes.spawnFile = otbmBuffer.escapeReadString();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.EXT_HOUSE_FILE:
              if ((otbmBuffer.position + otbmBuffer.escapePeekUint16LE()) <= OTBMNodeEndPos){
                this._attributes.houseFile = otbmBuffer.escapeReadString();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.HOUSEDOORID:
              if ((otbmBuffer.position + 1) <= OTBMNodeEndPos){
                this._attributes.houseDoorId = otbmBuffer.escapeReadByte();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            // Multiple descriptions can exist
            case OTBM_ATTRIBUTE.DESCRIPTION: {
                if (otbmBuffer.peekByte() !== OTBM_NODE_SPECIAL_BYTE.START && otbmBuffer.peekByte() !== OTBM_NODE_SPECIAL_BYTE.END){
                  this._attributes.description = this._attributes.description ? this._attributes.description : [];
                  this._attributes.description.push(otbmBuffer.escapeReadString());
                }else{
                  this._attributes.subType = byte;
                }
              }
            break;
      
            case OTBM_ATTRIBUTE.DESC:
              if ((otbmBuffer.position + otbmBuffer.escapePeekUint16LE()) <= OTBMNodeEndPos){
                this._attributes.desc = otbmBuffer.escapeReadString();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.DEPOT_ID:
              if ((otbmBuffer.position + 2) <= OTBMNodeEndPos){
                this._attributes.depotId = otbmBuffer.escapeReadUint16LE();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.TILE_FLAGS:{
                if ((otbmBuffer.position + 4) <= OTBMNodeEndPos){
                  const flagInt = otbmBuffer.escapeReadUint32LE();
                  this._attributes.tileFlags = {
                    protection: (flagInt & OTBM_TILE_STATE.TILESTATE_PROTECTIONZONE) === OTBM_TILE_STATE.TILESTATE_PROTECTIONZONE,
                    noPVP: (flagInt & OTBM_TILE_STATE.TILESTATE_NOPVP) === OTBM_TILE_STATE.TILESTATE_NOPVP,
                    noLogout: (flagInt & OTBM_TILE_STATE.TILESTATE_NOLOGOUT) === OTBM_TILE_STATE.TILESTATE_NOLOGOUT,
                    PVPZone: (flagInt & OTBM_TILE_STATE.TILESTATE_PVPZONE) === OTBM_TILE_STATE.TILESTATE_PVPZONE,
                    refresh: (flagInt & OTBM_TILE_STATE.TILESTATE_REFRESH) === OTBM_TILE_STATE.TILESTATE_REFRESH
                  }
                }else{
                  this._attributes.subType = byte;
                }
              }
              break;
      
            case OTBM_ATTRIBUTE.RUNE_CHARGES:
              if ((otbmBuffer.position + 1) <= OTBMNodeEndPos){
                this._attributes.runeCharges = otbmBuffer.escapeReadByte();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.COUNT:
              if ((otbmBuffer.position + 1) <= OTBMNodeEndPos){
                this._attributes.count = otbmBuffer.escapeReadByte();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.ITEM:
              if ((otbmBuffer.position + 2) <= OTBMNodeEndPos){
                this._attributes.tileId = otbmBuffer.escapeReadUint16LE();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.ACTION_ID:
              if ((otbmBuffer.position + 2) <= OTBMNodeEndPos){
                this._attributes.actionId = otbmBuffer.escapeReadUint16LE();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.UNIQUE_ID:
              if ((otbmBuffer.position + 2) <= OTBMNodeEndPos){
                this._attributes.uniqueId = otbmBuffer.escapeReadUint16LE();
              }else{
                this._attributes.subType = byte;
              }
              break;
      
            case OTBM_ATTRIBUTE.TELE_DEST:
              if ((otbmBuffer.position + 5) <= OTBMNodeEndPos){
                this._attributes.destination = {
                  "x": otbmBuffer.escapeReadUint16LE(),
                  "y": otbmBuffer.escapeReadUint16LE(),
                  "z": otbmBuffer.escapeReadByte()
                }
              }else{
                this._attributes.subType = byte;
              }
            break;
            case OTBM_ATTRIBUTE.CHARGES:
              if ((otbmBuffer.position + 2) <= OTBMNodeEndPos){
                this._attributes.charges = otbmBuffer.escapeReadUint16LE();
              }else{
                this._attributes.subType = byte;
              }
            break;
            case OTBM_ATTRIBUTE.ATTRIBUTE_MAP:
              console.log('Attribute map, not yet implemented.');
              otbmBuffer.position = OTBMNodeEndPos;
            break;
            default:
              this.attributes.subType = byte;
              // console.warn(otbmBuffer.position);
              // console.warn(`Property ${byte} is not supported yet.`);
            break;
          }      
        }
    }

    public isItem() : boolean {
      return this._type === OTBM_NODE_TYPE.OTBM_ITEM;
    }

    public getFullBranch(asRawObject = false){
      const children = [];

      if (this._children.length){
          for (const child of this._children){
            if (asRawObject){
              children.push(child.asRawObject());
            }else{
              children.push(child);
            }
          }
      }

      return children;
    }

    public asRawObject(getFullBranch = true) : IRawOTBMNode {
      return {
        type: this._type,
        attributes: this._attributes,
        ...(getFullBranch === true && { children: this.getFullBranch(getFullBranch) })
      }
    }
}