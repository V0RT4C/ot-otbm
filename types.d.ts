import { OTBM_NODE_TYPE } from "./const.ts";

export interface IOTBMNodeAttributes {
    text?: string, 
    houseDoorId?: number, 
    description?: string[] | undefined,
    desc?: string,
    houseFile?: string,
    spawnFile?: string; 
    depotId?: number,
    tileFlags?: IOTBMTileFlags,
    runeCharges?: number,
    charges?: number,
    count?: number,
    tileId?: number,
    actionId?: number,
    uniqueId?: number,
    subType?: number,
    destination?: {
        x: number,
        y: number,
        z: number
    }
}

export interface IOTBMTileFlags {
    protection: boolean;
    noPVP: boolean;
    noLogout: boolean;
    PVPZone: boolean;
    refresh: boolean;
}

export interface IRawOTBMNode {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    id?: number;
    houseId?: number;
    version?: number;
    width?: number;
    height?: number;
    itemMajorVersion?: number;
    itemMinorVersion?: number;
    name?: string;
    x?: number;
    y?: number;
    z?: number;
    realX?: number;
    realY?: number;
    children?: IRawOTBMNode[];
}

export interface IRawOTBMRootNode {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    version: number;
    width: number;
    height: number;
    itemMajorVersion: number;
    itemMinorVersion: number;
}

export interface IRawOTBMHouseTile {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    houseId: number;
    x: number;
    y: number;
    realX: number;
    realY: number;
}

export interface IRawOTBMItem {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    id: number;
}

export interface IRawOTBMTile {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    realX: number;
    realY: number;
    x: number;
    y: number;
    z: number;
}

export interface IRawOTBMTileArea {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    x: number;
    y: number;
    z: number;
}

export interface IRawOTBMTown {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    name: string;
    x: number;
    y: number;
    z: number;
}

export interface IRawOTBMTowns {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
}

export interface IRawOTBMWaypoint {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
    name: string;
}

export interface IRawOTBMWaypoints {
    type: OTBM_NODE_TYPE;
    attributes: IOTBMNodeAttributes;
}