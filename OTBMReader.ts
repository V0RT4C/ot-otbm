import { OTBM_NODE_TYPE, OTBM_NODE_SPECIAL_BYTE } from './const.ts';
import { Byt3s } from './lib/Bytes.ts';
import { OTBMHouseTile } from './lib/OTBMHouseTile.ts';
import { OTBMItem } from './lib/OTBMItem.ts';
import { OTBMMapData } from './lib/OTBMMapData.ts';
import { OTBMNode } from './lib/OTBMNode.ts';
import { OTBMRootNode } from './lib/OTBMRootNode.ts';
import { OTBMTile } from './lib/OTBMTile.ts';
import { OTBMTileArea } from './lib/OTBMTileArea.ts';
import { OTBMTown } from './lib/OTBMTown.ts';
import { OTBMTowns } from './lib/OTBMTowns.ts';
import { OTBMWaypoint } from './lib/OTBMWaypoint.ts';
import { OTBMWaypoints } from './lib/OTBMWaypoints.ts';

export class OTBMReader extends Byt3s {

    public _stack : OTBMNode[] = [];

    public parse() : OTBMRootNode {
        this.position = 0;
        this._stack = [];

        while (this.position < this.byteLength){
            this._readNextNode();
        }

        if (this._stack.length !== 1){
            throw new Error('Failed to parse .OTBM file.');
        }else{
            return this._stack[0] as OTBMRootNode;
        }
    }

    public getRootNode(){
        if (this._stack.length !== 1){
            return this.parse();
        }else{
            return this._stack[0];
        }
    }

    public getMapData(){
        if (this._stack.length !== 1){
            this.parse();
        }
        
        return this._stack[0].firstChild;
    }

    public getTileAreas(){
        if (this._stack.length !== 1){
            this.parse();
        }

        const tileAreas = [];

        if (this._stack[0].children[0] instanceof OTBMMapData){
            for (const child of this._stack[0].children[0].children){
                if (child instanceof OTBMTileArea){
                    tileAreas.push(child as OTBMTileArea);
                }
            }
        }else{
            throw new Error('Could not locate MapData instance. (Probably due to failed .OTBM parse)');
        }

        return tileAreas;
    }

    public getWaypoints(){
        if (this._stack.length !== 1){
            this.parse();
        }

        if (this._stack[0].children[0] instanceof OTBMMapData){
            for (const child of this._stack[0].children[0].children){
                if (child instanceof OTBMWaypoints){
                    return child.children;
                }
            }

            return [];
        }else{
            throw new Error('Could not locate MapData instance. (Probably due to failed .OTBM parse)');
        }
    }

    public getTowns(){
        if (this._stack.length !== 1){
            this.parse();
        }

        if (this._stack[0].children[0] instanceof OTBMMapData){
            for (const child of this._stack[0].children[0].children){
                if (child instanceof OTBMTowns){
                    return child.children;
                }
            }

            return [];
        }else{
            throw new Error('Could not locate MapData instance. (Probably due to failed .OTBM parse)');
        }
    }

    public getTiles(){
        const tiles : Array<OTBMTile | OTBMHouseTile> = [];
        if (this._stack.length !== 1){
            this.parse();
        }

        if (this._stack[0].firstChild instanceof OTBMMapData){
            for (const child of this._stack[0].firstChild.children){
                if (child instanceof OTBMTileArea){
                    for (const tile of child.children){
                        tiles.push(tile as OTBMTile | OTBMHouseTile);
                    }
                }
            }
        }

        return tiles;
    }

    public getHouseTiles(){
        return this.getTiles().filter((tile) => tile instanceof OTBMHouseTile);
    }

    public getTileAt(x: number, y: number, z: number){
        const tiles = this.getTiles();
        for (const tile of tiles){
            if (tile.realX === x && tile.realY === y && tile.z === z){
                return tile;
            }
        }

        return null;
    }

    public getTopLevelItems(){
        const tiles = this.getTiles();
        const items = [];

        for (const tile of tiles){
            items.push(...tile.children);
        }

        return items;
    }

    private _getNextNodeStartOrEndPosition(){
        let nextNodeStartOrEndPosition = -1;
        let previousPosition = this.position;
        let hasEscaped = false;

        while (this.position < this.byteLength){
            const byte = this.escapeReadByte();

            if ((this.position - previousPosition) > 1){
                hasEscaped = true;
            }else{
                hasEscaped = false;
            }

            previousPosition = this.position;

            if (
                (byte === OTBM_NODE_SPECIAL_BYTE.START && !hasEscaped) ||
                (byte === OTBM_NODE_SPECIAL_BYTE.END && !hasEscaped)
            ){
                nextNodeStartOrEndPosition = this.position - 1;
                break;
            }
        }

        return nextNodeStartOrEndPosition;
    }

    public _hasChild(){
        return this.peekByte() === OTBM_NODE_SPECIAL_BYTE.START;
    }

    public _hasSibling(){
        const positionSave = this.position;
        this.position+=1; //Skip 0xFF (If sibling)
        const bool = (this.peekByte() === OTBM_NODE_SPECIAL_BYTE.START);
        this.position = positionSave;
        return bool;
    }

    public _traverseUp(){
        this.readByte();
        const poppedNode = this._stack.pop();
        if (this._stack[this._stack.length - 1]){
            this._stack[this._stack.length - 1].children.push(poppedNode as OTBMNode);
        }else{
            throw new Error()
        }
    }

    public _readNextNode(){
        const nextNodeStartPosition = this._getNextNodeStartOrEndPosition();
        const nextNodeEndPosition = this._getNextNodeStartOrEndPosition();

        if (nextNodeEndPosition === -1){
            //Reached the end
            this.readByte();
            return;
        }

        
        this.position = nextNodeStartPosition;
        
        if (this.peekByte() === OTBM_NODE_SPECIAL_BYTE.START){
            //console.log({ nextNodeStartPosition, nextNodeEndPosition });
            this.readByte(); //Read 0xFE

            const node = this._getNodeType(nextNodeEndPosition);

            
            //After doing all node byte reading
            if (this.position !== nextNodeEndPosition){
                throw new Error(`Oh no! Node parse error. Current byte position (${this.position}) is not equal to node end position (${nextNodeEndPosition}).`);
            }
            
            // if (nextNodeStartPosition === 26168825){
            //     console.log(node)
            //     throw new Error();
            // }
            if (node !== null){
                //Add ref to parent
                if (this._stack[this._stack.length - 1] !== undefined){
                    node.parent = this._stack[this._stack.length - 1];
                }

                //Add ref to siblings
                const prevSibling = node.parent?.children[node.parent?.children.length - 1];

                if (prevSibling !== undefined){
                    node.prevSibling = prevSibling;

                    //Add next sibling ref to previous sibling
                    prevSibling.nextSibling = node;
                }


                if (this._stack.length === 0 || this._hasChild()){
                    this._stack.push(node as OTBMNode);
                }        
                else {
                    this._stack[this._stack.length - 1].children.push(node);
                    const nodeEnd = this.readByte(); //Read 0xFF node end
                    if (nodeEnd !== OTBM_NODE_SPECIAL_BYTE.END){
                        throw new Error('Not end byte');
                    }
                }
            }
        }else{
            if (this.peekByte() === OTBM_NODE_SPECIAL_BYTE.END){
                this._traverseUp();
            }else{
                throw new Error();
            }
        }
    }

    private _getNodeType(nodeEndPosition : number) : OTBMNode | null {
        const type = this.readByte();

        switch(type){
            case OTBM_NODE_TYPE.OTBM_MAP_HEADER: {
                const rootNode = new OTBMRootNode();
                rootNode.set(this);
                return rootNode;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_MAP_DATA: {
                const mapData = new OTBMMapData();
                mapData.setAttributes(this, nodeEndPosition);
                //Children
                return mapData;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_TILE_AREA: {
                const tileArea = new OTBMTileArea();
                tileArea.set(this);
                //Children
                return tileArea;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_TILE: {
                const tile = new OTBMTile();
                tile.set(this);
                tile.setAttributes(this, nodeEndPosition);
                //Children
                return tile;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_ITEM: {
                const item = new OTBMItem();
                item.set(this);
                item.setAttributes(this, nodeEndPosition);
                //Children
                return item;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_TOWNS: {
                const towns = new OTBMTowns();
                //Children
                return towns;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_TOWN: {
                const town = new OTBMTown();
                town.set(this);
                return town;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_HOUSETILE: {
                const houseTile = new OTBMHouseTile();
                houseTile.set(this);
                houseTile.setAttributes(this, nodeEndPosition);
                //Children
                return houseTile;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_WAYPOINTS: {
                const waypoints = new OTBMWaypoints();
                //Children
                return waypoints;
            }
            break;
            case OTBM_NODE_TYPE.OTBM_WAYPOINT: {
                const waypoint = new OTBMWaypoint();
                waypoint.set(this);
                return waypoint;
            }
            break;
            default:
                console.log(`Node type: ${type} is not supported yet.`);
            break;
        }

        return null;
    }
}