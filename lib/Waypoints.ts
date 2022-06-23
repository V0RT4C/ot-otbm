import { NODE_TYPE } from "../const.ts";
import { Node } from "./Node.ts";

export class Waypoints extends Node {
    public type = NODE_TYPE.OTBM_WAYPOINTS;
}