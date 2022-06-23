import { TreeTraverser } from './lib/bytes/TreeTraverser.ts';
import type { IOTBMVersionInfo } from './types.d.ts';

import type { RootNode } from './lib/RootNode.ts';

export class OTBMReader {
    private _treeTraverser : TreeTraverser | undefined;

    public setOTBM(bytes : Uint8Array){
        this._treeTraverser = new TreeTraverser(bytes);
    }

    public getVersionInfo() : IOTBMVersionInfo {
        if (this._treeTraverser !== undefined){
            const oldPos = this._treeTraverser.position;
            const version = this._treeTraverser.escapeReadUint32LE(6);
            this._treeTraverser.escapeReadUint16LE();
            this._treeTraverser.escapeReadUint16LE();
            const itemMinorVersion = this._treeTraverser.escapeReadUint32LE();
            const itemMajorVersion = this._treeTraverser.escapeReadUint32LE();
            this._treeTraverser.position = oldPos;
            return { version, itemMajorVersion, itemMinorVersion };
        }
        else {
            throw NoOTBMBufferError();
        }
    }

    public getMapWidth() : number {
        if (this._treeTraverser !== undefined){
            const oldPos = this._treeTraverser.position;
            const width = this._treeTraverser.escapeReadUint16LE(10);
            this._treeTraverser.position = oldPos;
            return width;
        }else{
            throw NoOTBMBufferError();
        }
    }

    public getMapHeight() : number {
        if (this._treeTraverser !== undefined){
            const oldPos = this._treeTraverser.position;
            const height = this._treeTraverser.escapeReadUint16LE(12);
            this._treeTraverser.position = oldPos;
            return height;
        }else{
            throw NoOTBMBufferError();
        }
    }

    public getNodeTree() : RootNode {
        if (this._treeTraverser !== undefined){
            try {
                do {
                    this._treeTraverser.readNextNode();
                }
                while(this._treeTraverser.position < this._treeTraverser.byteLength)
            }catch(err){
                throw err;
            }

            if (this._treeTraverser.stack.length > 0){
                this._treeTraverser.position = 0;
                return this._treeTraverser.stack[0] as RootNode;
            }else{
                this._treeTraverser.position = 0;
                throw TreeParseError();
            }
        }else{
            throw NoOTBMBufferError();
        }
    }
}

function NoOTBMBufferError() : Error {
    const err : any = new Error('You need to set the OTBM buffer with the setOTBM method first.');
    err.code = 'NO_OTBM_BUF';
    return err;
}

function TreeParseError() : Error {
    const err : any = new Error('Failed to parse & create the tree. At end of parse no RootNode in stack.');
    err.code = 'NO_ROOT_PARSE_ERR';
    return err;
}