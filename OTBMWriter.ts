import { Byt3s } from './lib/bytes/Bytes.ts';
import { NODE_TYPE, PROPERTY, TILE_STATE } from './const.ts';
import type { Node } from "./lib/Node.ts";
import type { HouseTile } from "./lib/HouseTile.ts";
import type { Item } from "./lib/Item.ts";
import type { MapData } from "./lib/MapData.ts";
import type { RootNode } from "./lib/RootNode.ts";
import type { Tile } from "./lib/Tile.ts";
import type { TileArea } from "./lib/TileArea.ts";
import type { Town } from "./lib/Town.ts";
import type { Towns } from "./lib/Towns.ts";
import type { Waypoint } from "./lib/Waypoint.ts";
import type { Waypoints } from "./lib/Waypoints.ts";
import type { INode, IRootNode } from "./types.d.ts";

export class OTBMWriter {
    public tree : INode | Node | undefined;
    public buffer : Byt3s = new Byt3s(100000000);

    public setTree(node : IRootNode | RootNode) {
        this.tree = node;
    }

    public writeBuffer() : Uint8Array {
        this.buffer = new Byt3s(100000000);
        //Write magic bytes
        this.buffer.escapeWriteUint32LE(0);
        this._writeNode(this.tree as INode);
        return new Uint8Array(this.buffer.slice(0, this.buffer.position));
    }

    private _writeNode(node : INode | HouseTile | Tile | Item | MapData | RootNode | TileArea | Town | Towns | Waypoint | Waypoints){
        if (node === undefined){
            throw new Error('Node is undefined');
        }
        this.buffer.writeByte(0xFE);
        this.buffer.escapeWriteByte(node.type);

        switch(node.type){
            case NODE_TYPE.OTBM_MAP_HEADER:
                this._writeRootNode(node as RootNode);
            break;
            case NODE_TYPE.OTBM_MAP_DATA:
                this._writeProperties(node);
            break;
            case NODE_TYPE.OTBM_TILE_AREA:
                this._writeTileArea(node);
            break;
            case NODE_TYPE.OTBM_TILE:
                this._writeTile(node);
                this._writeProperties(node);
            break;
            case NODE_TYPE.OTBM_ITEM:
                this._writeItem(node);
                this._writeProperties(node);
            break;
            case NODE_TYPE.OTBM_TOWNS:
            break;
            case NODE_TYPE.OTBM_TOWN:
                this._writeTown(node);
            break;
            case NODE_TYPE.OTBM_HOUSETILE:
                this._writeHouseTile(node);
                this._writeProperties(node);
            break;
            case NODE_TYPE.OTBM_WAYPOINTS:
            break;
            case NODE_TYPE.OTBM_WAYPOINT:
                this._writeWaypoint(node);
            break;
        }

        if (node.children && node.children.length > 0){
            for (let i=0; i < node.children.length; i++){
                const currChild = node.children[i];
                this._writeNode(currChild);
            }
        }

        this.buffer.writeByte(0xFF);
    }

    private _writeRootNode(node : IRootNode | RootNode) : void {
        //Version
        this.buffer.escapeWriteUint32LE(node.version);
        //Width
        this.buffer.escapeWriteUint16LE(node.width);
        //Height
        this.buffer.escapeWriteUint16LE(node.height);
        //Itemminor
        this.buffer.escapeWriteUint32LE(node.itemMinorVersion);
        //Itemmajor
        this.buffer.escapeWriteUint32LE(node.itemMajorVersion);
    }

    private _writeTileArea(node : INode | TileArea) : void {
        this.buffer.escapeWriteUint16LE(node.x ? node.x : 0);
        this.buffer.escapeWriteUint16LE(node.y ? node.y : 0);
        this.buffer.escapeWriteByte(node.z ? node.z : 0);
    }

    private _writeTile(node : INode | Tile) : void {
        this.buffer.escapeWriteByte(node.x ? node.x : 0);
        this.buffer.escapeWriteByte(node.y ? node.y : 0);
    }

    private _writeItem(node : INode | Item) : void {
        this.buffer.escapeWriteUint16LE(node.id ? node.id : 0);
    }

    private _writeTown(node : INode | Town) : void {
        this.buffer.escapeWriteUint32LE(node.townId ? node.townId : 0);
        this.buffer.escapeWriteString(node.name ? node.name : 'No name');
        this.buffer.escapeWriteUint16LE(node.x ? node.x : 0);
        this.buffer.escapeWriteUint16LE(node.y ? node.y : 0);
        this.buffer.escapeWriteByte(node.z ? node.z : 0);
    }

    private _writeHouseTile(node : INode | HouseTile) : void {
        this.buffer.escapeWriteByte(node.x ? node.x : 0);
        this.buffer.escapeWriteByte(node.y ? node.y : 0);
        this.buffer.escapeWriteUint32LE(node.id ? node.id : 0);
    }

    private _writeWaypoint(node : INode | Waypoint) : void {
        this.buffer.escapeWriteString(node.name ? node.name : 'No name');
        this.buffer.escapeWriteUint16LE(node.x ? node.x : 0);
        this.buffer.escapeWriteUint16LE(node.y ? node.y : 0);
        this.buffer.escapeWriteByte(node.z ? node.z : 0);
    }

    private _writeProperties(node : INode | Node) {
        if (node.properties?.text){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_TEXT);
            this.buffer.escapeWriteString(node.properties.text);
        }

        if (node.properties?.spawnFile){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_EXT_SPAWN_FILE);
            this.buffer.escapeWriteString(node.properties.spawnFile);
        }

        if (node.properties?.houseFile){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_EXT_HOUSE_FILE);
            this.buffer.escapeWriteString(node.properties.houseFile);
        }

        if (node.properties?.houseDoorId){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_HOUSEDOORID);
            this.buffer.escapeWriteByte(node.properties.houseDoorId);
        }

        if (node.properties?.description){
            if (node.properties.description.length > 0){
                for (let i=0; i < node.properties.description.length; i++){
                    this.buffer.writeByte(PROPERTY.OTBM_PROP_DESCRIPTION);
                    this.buffer.escapeWriteString(node.properties.description[i]);
                }
            }
        }

        if (node.properties?.desc){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_DESC);
            this.buffer.escapeWriteString(node.properties.desc);
        }

        if (node.properties?.depotId){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_DEPOT_ID);
            this.buffer.escapeWriteUint16LE(node.properties.depotId);
        }

        if (node.properties?.tileFlags){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_TILE_FLAGS);
            let flags = TILE_STATE.TILESTATE_NONE;

            flags |= node.properties.tileFlags.protection && TILE_STATE.TILESTATE_PROTECTIONZONE;
            flags |= node.properties.tileFlags.noPVP && TILE_STATE.TILESTATE_NOPVP;
            flags |= node.properties.tileFlags.noLogout && TILE_STATE.TILESTATE_NOLOGOUT;
            flags |= node.properties.tileFlags.PVPZone && TILE_STATE.TILESTATE_PVPZONE;
            flags |= node.properties.tileFlags.refresh && TILE_STATE.TILESTATE_REFRESH;

            this.buffer.escapeWriteUint32LE(flags);
        }

        if (node.properties?.runeCharges){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_RUNE_CHARGES);
            this.buffer.escapeWriteByte(node.properties.runeCharges);
        }

        if (node.properties?.count){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_COUNT);
            this.buffer.escapeWriteByte(node.properties.count);
        }

        if (node.properties?.tileId){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_ITEM);
            this.buffer.escapeWriteUint16LE(node.properties.tileId);
        }

        if (node.properties?.actionId){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_ACTION_ID);
            this.buffer.escapeWriteUint16LE(node.properties.actionId);
        }

        if (node.properties?.uniqueId){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_UNIQUE_ID);
            this.buffer.escapeWriteUint16LE(node.properties.uniqueId);
        }

        if (node.properties?.destination){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_TELE_DEST);
            if (node.properties?.destination?.x){
                this.buffer.escapeWriteUint16LE(node.properties.destination.x);
            }else{
                this.buffer.escapeWriteUint16LE(0);
            }

            if (node.properties?.destination?.y){
                this.buffer.escapeWriteUint16LE(node.properties.destination.y);
            }else{
                this.buffer.escapeWriteUint16LE(0);
            }

            if (node.properties?.destination?.z){
                this.buffer.escapeWriteByte(node.properties.destination.z);
            }else{
                this.buffer.escapeWriteByte(0);
            }
        }

        if (node.properties?.charges){
            this.buffer.writeByte(PROPERTY.OTBM_PROP_CHARGES);
            this.buffer.escapeWriteUint16LE(node.properties.charges ? node.properties.charges : 0);
        }
    }
}
