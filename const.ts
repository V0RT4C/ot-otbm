export enum OTBM_NODE_SPECIAL_BYTE {
    START                                     = 0xFE,
    END                                       = 0xFF,
    ESCAPE_CHAR                               = 0xFD
}

export enum OTBM_NODE_TYPE {
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


export enum OTBM_TILE_STATE {
    TILESTATE_NONE                            = 0x0000,
    TILESTATE_PROTECTIONZONE                  = 0x0001,
    TILESTATE_DEPRECATED                      = 0x0002,
    TILESTATE_NOPVP                           = 0x0004,
    TILESTATE_NOLOGOUT                        = 0x0008,
    TILESTATE_PVPZONE                         = 0x0010,
    TILESTATE_REFRESH                         = 0x0020
}

// export enum ATTRIBUTE {
//     DESCRIPTION                               = 0x01,
//     EXT_FILE                                  = 0x02,
//     TILE_FLAGS                                = 0x03,
//     ACTION_ID                                 = 0x04,
//     UNIQUE_ID                                 = 0x05,
//     TEXT                                      = 0x06,
//     DESC                                      = 0x07,
//     TELE_DEST                                 = 0x08,
//     ITEM                                      = 0x09,
//     DEPOT_ID                                  = 0x0A,
//     EXT_SPAWN_FILE                            = 0x0B,
//     RUNE_CHARGES                              = 0x0C,
//     EXT_HOUSE_FILE                            = 0x0D,
//     HOUSEDOORID                               = 0x0E,
//     COUNT                                     = 0x0F,
//     CHARGES                                   = 0x16,
//     ATTRIBUTE_MAP                             = 0x80
// }

export enum OTBM_ATTRIBUTE {
    DESCRIPTION                               = 0x01,
    EXT_FILE                                  = 0x02,
    TILE_FLAGS                                = 0x03,
    ACTION_ID                                 = 0x04,
    UNIQUE_ID                                 = 0x05,
    TEXT                                      = 0x06,
    DESC                                      = 0x07,
    TELE_DEST                                 = 0x08,
    ITEM                                      = 0x09,
    DEPOT_ID                                  = 0x0A,
    EXT_SPAWN_FILE                            = 0x0B,
    RUNE_CHARGES                              = 0x0C,
    EXT_HOUSE_FILE                            = 0x0D,
    HOUSEDOORID                               = 0x0E,
    COUNT                                     = 0x0F,
    DURATION                                  = 0x10,
    DECAY_STATE                               = 0x11,
    WRITTEN_DATE                              = 0x12,
    WRITTEN_BY                                = 0x13,
    SLEEPERGUID                               = 0x14,
    SLEEPSTART                                = 0x15,
    CHARGES                                   = 0x16,
    ATTRIBUTE_MAP                             = 0x80
}

export enum OTBM_MAP_VERSION {
    MAP_OTBM_0                                = 0,
    MAP_OTBM_1,
    MAP_OTBM_2,
    MAP_OTBM_3
}

// OTBM versions
//........................... Really?
// enum MapVersionID
// {
// 	MAP_OTBM_UNKNOWN = -1,
// 	MAP_OTBM_1 = 0,
// 	MAP_OTBM_2 = 1,
// 	MAP_OTBM_3 = 2,
// 	MAP_OTBM_4 = 3,
// }

export enum OTBM_SPLASH_TYPE
{
	NONE                                      = 0,
	WATER                                     = 1,
	BLOOD                                     = 2,
	BEER                                      = 3,
	SLIME                                     = 4,
	LEMONADE                                  = 5,
	MILK                                      = 6,
	MANAFLUID                                 = 7,
	INK                                       = 8,
	WATER2                                    = 9,
	LIFEFLUID                                 = 10,
	OIL                                       = 11,
	SLIME2                                    = 12,
	URINE                                     = 13,
	COCONUT_MILK                              = 14,
	WINE                                      = 15,
	MUD                                       = 19,
	FRUIT_JUICE                               = 21,
	LAVA                                      = 26,
    RUM                                       = 27,
	SWAMP                                     = 28,
	TEA                                       = 35,
	MEAD                                      = 43
}

export enum OTBM_CLIENT_VERSION {
    //OTBM VERSION 0 START
    _750                                      = 1,
    _755                                      = 2,
    _760                                      = 3,
    //OTBM VERSION 0 END
    _770                                      = 3,
    _780                                      = 4,
    _790                                      = 5,
    _792                                      = 6,
    //OTBM VERSION 1 START
    _800                                      = 7,
    _810                                      = 8,
    _811                                      = 9,
    _820                                      = 10, // After this version, OTBM stores charges as an attribute
    _830                                      = 11,
    //OTBM VERSION 1 END
    //OTBM VERSION 2 START
    _840                                      = 12,
    _841                                      = 13,
    _842                                      = 14,
    _850                                      = 15,
    _854_BAD                                  = 16,
    _854                                      = 17,
    _855                                      = 18,
    _860_OLD                                  = 19,
    _860                                      = 20,
    _861                                      = 21,
    _862                                      = 22,
    _870                                      = 23,
    _871                                      = 24,
    _872                                      = 25,
    _873                                      = 26,
    _900                                      = 27,
    _910                                      = 28,
    _920                                      = 29,
    _940                                      = 30,
    _944_V1                                   = 31,
    _944_V2                                   = 32,
    _944_V3                                   = 33,
    _944_V4                                   = 34,
    _946                                      = 35,
    _950                                      = 36,
    _952                                      = 37,
    _953                                      = 38,
    _954                                      = 39,
    _960                                      = 40,
    _961                                      = 41,
    _963                                      = 42,
    _970                                      = 43,
    _980                                      = 44,
    _981                                      = 45,
    _982                                      = 46,
    _983                                      = 47,
    _985                                      = 48,
    _986                                      = 49,
    //OTBM VERSION 2 END
    //OTBM VERSION 3 START
    _1010                                     = 50,
    _1020                                     = 51,
    _1021                                     = 52
}