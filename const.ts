export const NODE_SPECIAL_BYTE = {
    START                               : 0xFE,
    END                                 : 0xFF,
    ESCAPE_CHAR                         : 0xFD
}

export const NODE_TYPE = {
    OTBM_MAP_HEADER                           : 0x00,
    OTBM_MAP_DATA                             : 0x02,
    OTBM_TILE_AREA                            : 0x04,
    OTBM_TILE                                 : 0x05,
    OTBM_ITEM                                 : 0x06,
    OTBM_TOWNS                                : 0x0C,
    OTBM_TOWN                                 : 0x0D,
    OTBM_HOUSETILE                            : 0x0E,
    OTBM_WAYPOINTS                            : 0x0F,
    OTBM_WAYPOINT                             : 0x10
}

export const TILE_STATE = {
    TILESTATE_NONE                            : 0x0000,
    TILESTATE_PROTECTIONZONE                  : 0x0001,
    TILESTATE_DEPRECATED                      : 0x0002,
    TILESTATE_NOPVP                           : 0x0004,
    TILESTATE_NOLOGOUT                        : 0x0008,
    TILESTATE_PVPZONE                         : 0x0010,
    TILESTATE_REFRESH                         : 0x0020
}

export const PROPERTY = {
    OTBM_PROP_DESCRIPTION                     : 0x01,
    OTBM_PROP_EXT_FILE                        : 0x02,
    OTBM_PROP_TILE_FLAGS                      : 0x03,
    OTBM_PROP_ACTION_ID                       : 0x04,
    OTBM_PROP_UNIQUE_ID                       : 0x05,
    OTBM_PROP_TEXT                            : 0x06,
    OTBM_PROP_DESC                            : 0x07,
    OTBM_PROP_TELE_DEST                       : 0x08,
    OTBM_PROP_ITEM                            : 0x09,
    OTBM_PROP_DEPOT_ID                        : 0x0A,
    OTBM_PROP_EXT_SPAWN_FILE                  : 0x0B,
    OTBM_PROP_RUNE_CHARGES                    : 0x0C,
    OTBM_PROP_EXT_HOUSE_FILE                  : 0x0D,
    OTBM_PROP_HOUSEDOORID                     : 0x0E,
    OTBM_PROP_COUNT                           : 0x0F,
    OTBM_PROP_CHARGES                         : 0x16
}