export { OTBMReader } from './OTBMReader.ts';
export { OTBMWriter } from './OTBMWriter.ts';
export { OTBMHouseTile } from './lib/OTBMHouseTile.ts';
export { OTBMItem } from './lib/OTBMItem.ts';
export { OTBMMapData } from './lib/OTBMMapData.ts';
export { OTBMNode } from './lib/OTBMNode.ts';
export { OTBMRootNode } from './lib/OTBMRootNode.ts';
export { OTBMTile } from './lib/OTBMTile.ts';
export { OTBMTileArea } from './lib/OTBMTileArea.ts';
export { OTBMTown } from './lib/OTBMTown.ts';
export { OTBMTowns } from './lib/OTBMTowns.ts';
export { OTBMWaypoint } from './lib/OTBMWaypoint.ts';
export { OTBMWaypoints } from './lib/OTBMWaypoints.ts';

export type {
    IOTBMNodeAttributes,
    IOTBMTileFlags,
    IRawOTBMHouseTile,
    IRawOTBMItem,
    IRawOTBMNode,
    IRawOTBMRootNode,
    IRawOTBMTile,
    IRawOTBMTileArea,
    IRawOTBMTown,
    IRawOTBMTowns,
    IRawOTBMWaypoint,
    IRawOTBMWaypoints
} from './types.d.ts'

export { 
    OTBM_NODE_SPECIAL_BYTE,
    OTBM_NODE_TYPE,
    OTBM_ATTRIBUTE,
    OTBM_CLIENT_VERSION,
    OTBM_MAP_VERSION,
    OTBM_SPLASH_TYPE,
    OTBM_TILE_STATE
} from './const.ts';