import { NODE_SPECIAL_BYTE } from '../../const.ts';

export class Byt3s extends Uint8Array {
    public position = 0;

    public readByte() {
        const val = this[this.position++] & 0xFF;
        return val;
    }

    public peekByte() {
        const val = this[this.position] & 0xFF;
        return val;
    }

    public escapeReadByte(offset?: number) {
        return this._getEscapedValue(offset);
    }

    public escapeReadUint16LE(offset?: number) {
        const int1 : number = this._getEscapedValue(offset);
        const int2 : number = this._getEscapedValue();

        return int1 | (int2 << 8);
    }

    public escapeReadUint32LE(offset?: number) {
        const int1 : number = this._getEscapedValue(offset);
        const int2 : number = this._getEscapedValue();
        const int3 : number = this._getEscapedValue();
        const int4 : number = this._getEscapedValue();

        return ((int1) |
        (int2 << 8) |
        (int3 << 16)) +
        (int4 * 0x1000000)
    }

    public escapeReadString() : string {
        const length = this.escapeReadUint16LE();

        const strArr : number[] = [];
    
        for (let i=0; i < length; i++){
            strArr.push(this.escapeReadByte());
        }
        
        return String.fromCharCode(...strArr);
    }

    public writeByte = (value: number, offset?: number) : void => {
        checkInt(value, 0, 255);

        this.position = (offset || offset === 0) ? offset : this.position;

        this[this.position++] = value & 0xFF;
    }

    public escapeWriteByte(value : number) : void {
        if (
            value === NODE_SPECIAL_BYTE.START
            ||
            value === NODE_SPECIAL_BYTE.END
            ||
            value === NODE_SPECIAL_BYTE.ESCAPE_CHAR){
                this.writeByte(NODE_SPECIAL_BYTE.ESCAPE_CHAR);
                this.writeByte(value);
        }else{
            this.writeByte(value);
        }
    }

    public escapeWriteUint16LE(value : number) : void {
        const int1 = (value & 0xff);
        const int2 = (value >>> 8);

        this.escapeWriteByte(int1);
        this.escapeWriteByte(int2);
    }

    public escapeWriteUint32LE(value : number) : void {
        const int1 = (value & 0xff);
        const int2 = (value >>> 8);
        const int3 = (value >>> 16);
        const int4 = (value >>> 24);

        this.escapeWriteByte(int1);
        this.escapeWriteByte(int2);
        this.escapeWriteByte(int3);
        this.escapeWriteByte(int4);
    }

    public escapeWriteString(str : string) : void {
        checkString(str);

        const length = str.length;

        this.escapeWriteUint16LE(length);

        for (let i=0; i < str.length; i++){
            this.escapeWriteByte(str.charCodeAt(i));
        }
    }

    private _getEscapedValue(offset? : number) : number {
        this.position = (offset || offset === 0) ? offset : this.position;
        if (this[this.position] === NODE_SPECIAL_BYTE.ESCAPE_CHAR && (this[this.position+1] === NODE_SPECIAL_BYTE.START || this[this.position+1] === NODE_SPECIAL_BYTE.END || this[this.position+1] === NODE_SPECIAL_BYTE.ESCAPE_CHAR)){
            this.readByte();
            return this.readByte();
        }else{
            return this.readByte();
        }
    }
}

function checkInt(value : number, min : number, max : number) : void {
    if (!Number.isInteger(value)){
        throw NotAnIntError(value)
    }

    if (value > max || value < min){
        throw IntSizeError(value, min, max);
    }
}

function checkString(str : string) : void {
    if (typeof str !== 'string'){
        throw NotAStringError(str);
    }
}

function NotAStringError(str : string) : Error {
    const err : any = new Error('Not a string.' + 'Got a: ' + typeof str);
    err.code = 'NOT_STR';
    return err;
}

function NotAnIntError(value : any) : Error {
    const err : any = new Error('Not an integer.' + 'Got: ' + value);
    err.code = 'NOT_INT';
    return err;
}

function IntSizeError(value : number, min : number, max : number) : Error {
    const err : any = new Error('Integer is out of bounds. Received ' + value + ' but integer has to be between ' + min + ' and ' + max);
    err.code = 'INT_BOUNDS';
    return err;
}