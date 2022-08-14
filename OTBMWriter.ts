import { Byt3s } from './lib/Bytes.ts';
import type { OTBMNode } from "./lib/OTBMNode.ts";
import type { OTBMHouseTile } from "./lib/OTBMHouseTile.ts";
import type { OTBMItem } from "./lib/OTBMItem.ts";
import type { OTBMMapData } from "./lib/OTBMMapData.ts";
import type { OTBMRootNode } from "./lib/OTBMRootNode.ts";
import type { OTBMTile } from "./lib/OTBMTile.ts";
import type { OTBMTileArea } from "./lib/OTBMTileArea.ts";
import type { OTBMTown } from "./lib/OTBMTown.ts";
import type { OTBMWaypoint } from "./lib/OTBMWaypoint.ts";
import { OTBM_NODE_TYPE, OTBM_ATTRIBUTE, OTBM_TILE_STATE } from './const.ts';

export class OTBMWriter {
    constructor(root : OTBMRootNode){
        this.tree = root;
    }

    public tree : OTBMNode | undefined;
    public buffer : Byt3s = new Byt3s(100000000);

    public writeBuffer() : Uint8Array {
        this.buffer = new Byt3s(100000000);
        //Write magic bytes
        this.buffer.escapeWriteUint32LE(0);
        this._writeNode(this.tree as OTBMNode);
        return new Uint8Array(this.buffer.slice(0, this.buffer.position));
    }

    private _writeNode(node : OTBMNode){
        if (node === undefined){
            throw new Error('Node is undefined');
        }

        this.buffer.writeByte(0xFE);
        this.buffer.escapeWriteByte(node.type);

        switch(node.type){
            case OTBM_NODE_TYPE.OTBM_MAP_HEADER:
                this._writeRootNode(node as OTBMRootNode);
            break;
            case OTBM_NODE_TYPE.OTBM_MAP_DATA:
                this._writeAttributes(node as OTBMMapData);
            break;
            case OTBM_NODE_TYPE.OTBM_TILE_AREA:
                this._writeTileArea(node as OTBMTileArea);
            break;
            case OTBM_NODE_TYPE.OTBM_TILE:
                this._writeTile(node as OTBMTile);
                this._writeAttributes(node as OTBMTile);
            break;
            case OTBM_NODE_TYPE.OTBM_ITEM:
                this._writeItem(node as OTBMItem);
                this._writeAttributes(node as OTBMItem);
            break;
            case OTBM_NODE_TYPE.OTBM_TOWNS:
            break;
            case OTBM_NODE_TYPE.OTBM_TOWN:
                this._writeTown(node as OTBMTown);
            break;
            case OTBM_NODE_TYPE.OTBM_HOUSETILE:
                this._writeHouseTile(node as OTBMHouseTile);
                this._writeAttributes(node as OTBMHouseTile);
            break;
            case OTBM_NODE_TYPE.OTBM_WAYPOINTS:
            break;
            case OTBM_NODE_TYPE.OTBM_WAYPOINT:
                this._writeWaypoint(node as OTBMWaypoint);
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

    private _writeRootNode(node : OTBMRootNode) : void {
        //Version
        this.buffer.escapeWriteUint32LE(node.version);
        //Width
        this.buffer.escapeWriteUint16LE(node.width);
        //Height
        this.buffer.escapeWriteUint16LE(node.height);
        //Itemmajor
        this.buffer.escapeWriteUint32LE(node.itemMajorVersion);
        //Itemminor
        this.buffer.escapeWriteUint32LE(node.itemMinorVersion);
    }

    private _writeTileArea(node : OTBMTileArea) : void {
        this.buffer.escapeWriteUint16LE(node.x ? node.x : 0);
        this.buffer.escapeWriteUint16LE(node.y ? node.y : 0);
        this.buffer.escapeWriteByte(node.z ? node.z : 0);
    }

    private _writeTile(node : OTBMTile) : void {
        this.buffer.escapeWriteByte(node.x ? node.x : 0);
        this.buffer.escapeWriteByte(node.y ? node.y : 0);
    }

    private _writeItem(node : OTBMItem) : void {
        this.buffer.escapeWriteUint16LE(node.id ? node.id : 0);
    }

    private _writeTown(node : OTBMTown) : void {
        this.buffer.escapeWriteUint32LE(node.townId ? node.townId : 0);
        this.buffer.escapeWriteString(node.name ? node.name : 'No name');
        this.buffer.escapeWriteUint16LE(node.x ? node.x : 0);
        this.buffer.escapeWriteUint16LE(node.y ? node.y : 0);
        this.buffer.escapeWriteByte(node.z ? node.z : 0);
    }

    private _writeHouseTile(node : OTBMHouseTile) : void {
        this.buffer.escapeWriteByte(node.x ? node.x : 0);
        this.buffer.escapeWriteByte(node.y ? node.y : 0);
        this.buffer.escapeWriteUint32LE(node.houseId ? node.houseId : 0);
    }

    private _writeWaypoint(node : OTBMWaypoint) : void {
        this.buffer.escapeWriteString(node.name ? node.name : 'No name');
        this.buffer.escapeWriteUint16LE(node.x ? node.x : 0);
        this.buffer.escapeWriteUint16LE(node.y ? node.y : 0);
        this.buffer.escapeWriteByte(node.z ? node.z : 0);
    }

    private _writeAttributes(node : OTBMNode) {
        if (node.attributes.subType){
            this.buffer.escapeWriteByte(node.attributes.subType);
        }

        if (node.attributes?.text){
            this.buffer.writeByte(OTBM_ATTRIBUTE.TEXT);
            this.buffer.escapeWriteString(node.attributes.text);
        }

        if (node.attributes?.spawnFile){
            this.buffer.writeByte(OTBM_ATTRIBUTE.EXT_SPAWN_FILE);
            this.buffer.escapeWriteString(node.attributes.spawnFile);
        }

        if (node.attributes?.houseFile){
            this.buffer.writeByte(OTBM_ATTRIBUTE.EXT_HOUSE_FILE);
            this.buffer.escapeWriteString(node.attributes.houseFile);
        }

        if (node.attributes?.houseDoorId){
            this.buffer.writeByte(OTBM_ATTRIBUTE.HOUSEDOORID);
            this.buffer.escapeWriteByte(node.attributes.houseDoorId);
        }

        if (node.attributes?.description){
            if (node.attributes.description.length > 0){
                for (let i=0; i < node.attributes.description.length; i++){
                    this.buffer.writeByte(OTBM_ATTRIBUTE.DESCRIPTION);
                    this.buffer.escapeWriteString(node.attributes.description[i]);
                }
            }
        }

        if (node.attributes?.desc){
            this.buffer.writeByte(OTBM_ATTRIBUTE.DESC);
            this.buffer.escapeWriteString(node.attributes.desc);
        }

        if (node.attributes?.depotId){
            this.buffer.writeByte(OTBM_ATTRIBUTE.DEPOT_ID);
            this.buffer.escapeWriteUint16LE(node.attributes.depotId);
        }

        if (node.attributes?.tileFlags){
            this.buffer.writeByte(OTBM_ATTRIBUTE.TILE_FLAGS);
            let flags = OTBM_TILE_STATE.TILESTATE_NONE;

            flags |= (node.attributes.tileFlags.protection ? 1 : 0) && OTBM_TILE_STATE.TILESTATE_PROTECTIONZONE;
            flags |= (node.attributes.tileFlags.noPVP ? 1 : 0) && OTBM_TILE_STATE.TILESTATE_NOPVP;
            flags |= (node.attributes.tileFlags.noLogout ? 1 : 0) && OTBM_TILE_STATE.TILESTATE_NOLOGOUT;
            flags |= (node.attributes.tileFlags.PVPZone ? 1 : 0) && OTBM_TILE_STATE.TILESTATE_PVPZONE;
            flags |= (node.attributes.tileFlags.refresh ? 1 : 0) && OTBM_TILE_STATE.TILESTATE_REFRESH;

            this.buffer.escapeWriteUint32LE(flags);
        }

        if (node.attributes?.runeCharges){
            this.buffer.writeByte(OTBM_ATTRIBUTE.RUNE_CHARGES);
            this.buffer.escapeWriteByte(node.attributes.runeCharges);
        }

        if (node.attributes?.count){
            this.buffer.writeByte(OTBM_ATTRIBUTE.COUNT);
            this.buffer.escapeWriteByte(node.attributes.count);
        }

        if (node.attributes?.tileId){
            this.buffer.writeByte(OTBM_ATTRIBUTE.ITEM);
            this.buffer.escapeWriteUint16LE(node.attributes.tileId);
        }

        if (node.attributes?.actionId){
            this.buffer.writeByte(OTBM_ATTRIBUTE.ACTION_ID);
            this.buffer.escapeWriteUint16LE(node.attributes.actionId);
        }

        if (node.attributes?.uniqueId){
            this.buffer.writeByte(OTBM_ATTRIBUTE.UNIQUE_ID);
            this.buffer.escapeWriteUint16LE(node.attributes.uniqueId);
        }

        if (node.attributes?.destination){
            this.buffer.writeByte(OTBM_ATTRIBUTE.TELE_DEST);
            if (node.attributes?.destination?.x){
                this.buffer.escapeWriteUint16LE(node.attributes.destination.x);
            }else{
                this.buffer.escapeWriteUint16LE(0);
            }

            if (node.attributes?.destination?.y){
                this.buffer.escapeWriteUint16LE(node.attributes.destination.y);
            }else{
                this.buffer.escapeWriteUint16LE(0);
            }

            if (node.attributes?.destination?.z){
                this.buffer.escapeWriteByte(node.attributes.destination.z);
            }else{
                this.buffer.escapeWriteByte(0);
            }
        }

        if (node.attributes?.charges){
            this.buffer.writeByte(OTBM_ATTRIBUTE.CHARGES);
            this.buffer.escapeWriteUint16LE(node.attributes.charges ? node.attributes.charges : 0);
        }
    }
}