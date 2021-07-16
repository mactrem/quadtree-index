export class Envelope{

    constructor(private readonly _minX: number, private readonly _minY: number, private readonly _maxX: number,
                private readonly _maxY: number) {
    }

    get minX(): number{
        return this._minX;
    }

    get minY(): number{
        return this._minY;
    }

    get maxX(): number{
        return this._maxX;
    }

    get maxY(): number{
        return this._maxY;
    }

    intersects(envelope: Envelope): boolean{
        const vertices = [{x: this.minX, y: this.minY}, {x: this.maxX, y: this.minY},
            {x: this.maxX, y: this.maxY}, {x: this.minY, y: this.maxY}]
        const otherVertices = [{x: envelope.minX, y: envelope.minY}, {x: envelope.maxX, y: envelope.minY},
            {x: envelope.maxX, y: envelope.maxY}, {x: envelope.minY, y: envelope.maxY}]

        return otherVertices.some(vertex => this.pointInEnvelope(this, vertex)) || vertices.some(vertex => this.pointInEnvelope(envelope, vertex));
    }

    private pointInEnvelope(envelope: Envelope, vertex: {x: number, y: number}): boolean{
        return envelope.minX <= vertex.x && envelope.minY <= vertex.y
            && envelope.maxX >= vertex.x && envelope.maxY >= vertex.y;
    }

}

export default interface Geometry{
    envelope(): Envelope;
}

export class Point implements Geometry{
    private static readonly EPSILON = 1e-7;

    constructor(private readonly _x: number, private readonly _y: number, private readonly _z = 0) {
    }

    get x(){
        return this._x;
    }

    get y(){
        return this._y;
    }

    get z(){
        return this._z;
    }

    equals(other: Point){
        return Math.abs(this._x - other.x) < Point.EPSILON && Math.abs(this._y - other.y) < Point.EPSILON && Math.abs(this._z - other.z) < Point.EPSILON;
    }

    envelope(): Envelope {
        return new Envelope(this._x, this._y, this._x, this._y);
    }
}

