import { NODE_TYPE } from "../const.ts";
import { NodeWithPosition } from "./NodeWithPosition.ts";

export class TileArea extends NodeWithPosition {
    public type = NODE_TYPE.OTBM_TILE_AREA;
}