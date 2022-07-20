import { Byt3s } from './Bytes.ts';
import { HouseTile } from "./../HouseTile.ts";
import { Item } from "./../Item.ts";
import { MapData } from "./../MapData.ts";
import { RootNode } from "./../RootNode.ts";
import { Tile } from "./../Tile.ts";
import { TileArea } from "./../TileArea.ts";
import { Town } from "./../Town.ts";
import { Towns } from "./../Towns.ts";
import { Waypoint } from "./../Waypoint.ts";
import { Waypoints } from "./../Waypoints.ts";
import { NODE_SPECIAL_BYTE, NODE_TYPE } from "./../../const.ts";

import type { Node } from "./../Node.ts";

export class TreeTraverser extends Byt3s {
    public stack : Array<Node> = [];
    public position = 0;

    public getNextSpecialBytePosition(incrPosition = false) : number {
        const startPosition = this.position;
        let nextSpecialBytePosition! : number; 

        if (incrPosition) this.position++;

        while (this.position < this.byteLength){
            const byte = this.readByte();
            if (
                ((byte === NODE_SPECIAL_BYTE.START && this[this.position - 2] !== NODE_SPECIAL_BYTE.ESCAPE_CHAR) 
                || 
                (byte === NODE_SPECIAL_BYTE.END && this[this.position - 2] !== NODE_SPECIAL_BYTE.ESCAPE_CHAR)
                )
                ||
                ((byte === NODE_SPECIAL_BYTE.START && this[this.position - 2] === NODE_SPECIAL_BYTE.ESCAPE_CHAR && this[this.position - 3] === NODE_SPECIAL_BYTE.ESCAPE_CHAR && this[this.position - 4] !== NODE_SPECIAL_BYTE.ESCAPE_CHAR)
                ||
                (byte === NODE_SPECIAL_BYTE.END && this[this.position - 2] === NODE_SPECIAL_BYTE.ESCAPE_CHAR && this[this.position - 3] === NODE_SPECIAL_BYTE.ESCAPE_CHAR && this[this.position - 4] !== NODE_SPECIAL_BYTE.ESCAPE_CHAR)
                )
               ){
                nextSpecialBytePosition = this.position - 1;
                break;
            }
        }

        this.position = startPosition;
        return nextSpecialBytePosition;
    }


    public nodeHasChild() : boolean {
        const nextSpecialBytePosition = this.getNextSpecialBytePosition();
        if (this[nextSpecialBytePosition] === NODE_SPECIAL_BYTE.START){
            return true;
        }else{
            return false;
        }
    }

    public nodeHasSibling() : boolean {
        const nextSpecialBytePosition = this.getNextSpecialBytePosition();
        if (this[nextSpecialBytePosition] === NODE_SPECIAL_BYTE.END && this[nextSpecialBytePosition+1] === NODE_SPECIAL_BYTE.START){
            return true;
        }else{
            return false;
        }
    }

    public readNextNode(){
        const nextNodeStartPosition = this.getNextSpecialBytePosition();
        const nextNodeEndPosition = this.getNextSpecialBytePosition(true);
        this.position = nextNodeStartPosition;
        
        const byte : number = this.readByte();
        if (byte === NODE_SPECIAL_BYTE.START){
            const node = this._getNodeType(nextNodeEndPosition);

            if (node !== null){

                //Add ref to parent
                if (this.stack[this.stack.length - 1] !== undefined){
                    node.parent = this.stack[this.stack.length - 1];
                }

                //Add ref to siblings
                const prevSibling = node.parent?.children[node.parent?.children.length - 1];

                if (prevSibling !== undefined){
                    node.prevSibling = prevSibling;

                    //Add next sibling ref to previous sibling
                    prevSibling.nextSibling = node;
                } 


                if (this.stack.length === 0){ //Root
                    this.stack.push(node);
                }else{
                    if (this.nodeHasChild()){
                        this.stack.push(node);
                    }else{
                        //Does not have a child            
                        if (this.nodeHasSibling()){
                            this.stack[this.stack.length - 1].children.push(node);
                        }else{
                            //Traverse back up
                            const poppedNode = this.stack.pop();
                            poppedNode?.children.push(node);
                            this.stack[this.stack.length - 1].children.push(poppedNode as Node);
                        }
                    }
                }
            }else{
                return null;
            }
        }
        //Traverse back up if its a node close
        else if (byte === NODE_SPECIAL_BYTE.END){
            if (this[this.position - 2] === NODE_SPECIAL_BYTE.END && this[this.position] === NODE_SPECIAL_BYTE.END && this.stack.length > 1){
                const poppedNode = this.stack.pop();
                if (this.stack[this.stack.length - 1]){
                    this.stack[this.stack.length - 1].children.push(poppedNode as Node);
                }
            }
        }
    }

    private _getNodeType(nodeEndPosition : number) : Node | null {
        const type = this.readByte();

        switch(type){
            case NODE_TYPE.OTBM_MAP_HEADER: {
                const rootNode = new RootNode();
                rootNode.set(this);
                return rootNode;
            }
            break;
            case NODE_TYPE.OTBM_MAP_DATA: {
                const mapData = new MapData();
                mapData.setProperties(this, nodeEndPosition);
                //Children
                return mapData;
            }
            break;
            case NODE_TYPE.OTBM_TILE_AREA: {
                const tileArea = new TileArea();
                tileArea.set(this);
                //Children
                return tileArea;
            }
            break;
            case NODE_TYPE.OTBM_TILE: {
                const tile = new Tile();
                tile.set(this);
                tile.setProperties(this, nodeEndPosition);
                //Children
                return tile;
            }
            break;
            case NODE_TYPE.OTBM_ITEM: {
                const item = new Item();
                item.set(this);
                item.setProperties(this, nodeEndPosition);
                //Children
                return item;
            }
            break;
            case NODE_TYPE.OTBM_TOWNS: {
                const towns = new Towns();
                //Children
                return towns;
            }
            break;
            case NODE_TYPE.OTBM_TOWN: {
                const town = new Town();
                town.set(this);
                return town;
            }
            break;
            case NODE_TYPE.OTBM_HOUSETILE: {
                const houseTile = new HouseTile();
                houseTile.set(this);
                houseTile.setProperties(this, nodeEndPosition);
                //Children
                return houseTile;
            }
            break;
            case NODE_TYPE.OTBM_WAYPOINTS: {
                const waypoints = new Waypoints();
                //Children
                return waypoints;
            }
            break;
            case NODE_TYPE.OTBM_WAYPOINT: {
                const waypoint = new Waypoint();
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