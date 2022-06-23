export { OTBMReader } from './OTBMReader.ts';
export { OTBMWriter } from './OTBMWriter.ts';

export { HouseTile } from './lib/HouseTile.ts';
export { Item } from './lib/Item.ts';
export { MapData } from './lib/MapData.ts';
export { Node } from './lib/Node.ts';
export { RootNode } from './lib/RootNode.ts';
export { Tile } from './lib/Tile.ts';
export { TileArea } from './lib/TileArea.ts';
export { Town } from './lib/Town.ts';
export { Towns } from './lib/Towns.ts';
export { Waypoint } from './lib/Waypoint.ts';
export { Waypoints } from './lib/Waypoints.ts';

export type {
    NODE_TYPE_E,
    IRootNode,
    INode,
    IOTBMVersionInfo,
    INodeProperties,
    ITileFlags
} from './types.d.ts';

export {
    NODE_SPECIAL_BYTE,
    NODE_TYPE,
    TILE_STATE,
    PROPERTY
} from './const.ts';