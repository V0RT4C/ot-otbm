import { TILE_STATE, PROPERTY } from "../const.ts";

import type { INodeProperties, NODE_TYPE_E } from "../types.d.ts";
import type { TreeTraverser } from "./bytes/TreeTraverser.ts";

export abstract class Node {
    public abstract type : NODE_TYPE_E;
    public properties : INodeProperties = {};
    public parent : Node | null = null;
    public children : Node[] = [];
    public prevSibling : Node | null = null;
    public nextSibling : Node | null = null;

    public get firstChild() : Node | null {
      return this.children[0] !== undefined ? this.children[0] : null;
    }

    public get lastChild() : Node | null {
      return this.children[this.children.length - 1] ? this.children[this.children.length - 1] : null;
    }

    public setProperties(nodeBuffer : TreeTraverser, nodeEndPos : number){
        while (nodeBuffer.position + 1 < nodeEndPos) {
          const byte = nodeBuffer.readByte();

          switch(byte){
            case PROPERTY.OTBM_PROP_TEXT:
              this.properties.text = nodeBuffer.escapeReadString();
              break;
      
            case PROPERTY.OTBM_PROP_EXT_SPAWN_FILE:
              this.properties.spawnFile = nodeBuffer.escapeReadString();
              break;
      
            case PROPERTY.OTBM_PROP_EXT_HOUSE_FILE:
              this.properties.houseFile = nodeBuffer.escapeReadString();
              break;
      
            case PROPERTY.OTBM_PROP_HOUSEDOORID:
              this.properties.houseDoorId = nodeBuffer.escapeReadByte();
              break;
      
            // Multiple descriptions can exist
            case PROPERTY.OTBM_PROP_DESCRIPTION: {
                this.properties.description = this.properties.description ? this.properties.description : [];
                this.properties.description.push(nodeBuffer.escapeReadString());
              }
            break;
      
            case PROPERTY.OTBM_PROP_DESC:
              this.properties.desc = nodeBuffer.escapeReadString();
              break;
      
            case PROPERTY.OTBM_PROP_DEPOT_ID:
              this.properties.depotId = nodeBuffer.escapeReadUint16LE();
              break;
      
            case PROPERTY.OTBM_PROP_TILE_FLAGS:{
                const flagInt = nodeBuffer.escapeReadUint32LE();
                this.properties.tileFlags = {
                  protection: flagInt & TILE_STATE.TILESTATE_PROTECTIONZONE,
                  noPVP: flagInt & TILE_STATE.TILESTATE_NOPVP,
                  noLogout: flagInt & TILE_STATE.TILESTATE_NOLOGOUT,
                  PVPZone: flagInt & TILE_STATE.TILESTATE_PVPZONE,
                  refresh: flagInt & TILE_STATE.TILESTATE_REFRESH
                }
              }
              break;
      
            case PROPERTY.OTBM_PROP_RUNE_CHARGES:
              this.properties.runeCharges = nodeBuffer.escapeReadByte();
              break;
      
            case PROPERTY.OTBM_PROP_COUNT:
              this.properties.count = nodeBuffer.escapeReadByte();
              break;
      
            case PROPERTY.OTBM_PROP_ITEM:
              this.properties.tileId = nodeBuffer.escapeReadUint16LE();
              break;
      
            case PROPERTY.OTBM_PROP_ACTION_ID:
              this.properties.actionId = nodeBuffer.escapeReadUint16LE();
              break;
      
            case PROPERTY.OTBM_PROP_UNIQUE_ID:
              this.properties.uniqueId = nodeBuffer.escapeReadUint16LE();
              break;
      
            case PROPERTY.OTBM_PROP_TELE_DEST:
              this.properties.destination = {
                "x": nodeBuffer.escapeReadUint16LE(),
                "y": nodeBuffer.escapeReadUint16LE(),
                "z": nodeBuffer.escapeReadByte()
              }
            break;
            case PROPERTY.OTBM_PROP_CHARGES:
              this.properties.charges = nodeBuffer.escapeReadUint16LE();
            break;
            default:
              console.log(`Property ${byte} is not supported yet.`);
            break;
          }      
        }
    }
}