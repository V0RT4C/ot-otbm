import { OTBMNode } from "./OTBMNode.ts";
import { OTBM_NODE_TYPE } from "../const.ts";

export class OTBMWaypoints extends OTBMNode {
    protected _type = OTBM_NODE_TYPE.OTBM_WAYPOINTS;
}