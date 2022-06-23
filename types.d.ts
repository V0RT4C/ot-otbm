export enum NODE_TYPE_E {
    OTBM_MAP_HEADER                           = 0x00,
    OTBM_MAP_DATA                             = 0x02,
    OTBM_TILE_AREA                            = 0x04,
    OTBM_TILE                                 = 0x05,
    OTBM_ITEM                                 = 0x06,
    OTBM_TOWNS                                = 0x0C,
    OTBM_TOWN                                 = 0x0D,
    OTBM_HOUSETILE                            = 0x0E,
    OTBM_WAYPOINTS                            = 0x0F,
    OTBM_WAYPOINT                             = 0x10
}

export interface IRootNode {
    type: NODE_TYPE_E;
    version: number;
    width: number;
    height: number;
    itemMinorVersion: number;
    itemMajorVersion: number;
    children?: Array<INode>
}

export interface INode {
    type: NODE_TYPE_E,
    properties?: INodeProperties,
    children?: Array<INode>,
    id?: number;
    x?: number;
    y?: number;
    z?: number;
    townId?: number;
    name?: string;
}

export interface IOTBMVersionInfo {
    version: number;
    itemMinorVersion: number;
    itemMajorVersion: number;
}

export interface INodeProperties {
    text?: string, 
    houseDoorId?: number, 
    description?: string[] | undefined,
    desc?: string,
    houseFile?: string,
    spawnFile?: string; 
    depotId?: number,
    tileFlags?: ITileFlags,
    runeCharges?: number,
    charges?: number,
    count?: number,
    tileId?: number,
    actionId?: number,
    uniqueId?: number,
    destination?: {
        x: number,
        y: number,
        z: number
    }
}

export interface ITileFlags {
    protection: number;
    noPVP: number;
    noLogout: number;
    PVPZone: number;
    refresh: number;
}