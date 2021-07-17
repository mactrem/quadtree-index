import Geometry, {Envelope} from "./geometry";

export class IllegalArgumentError extends Error{
    constructor(private readonly _message: string) {
        super(_message);
        this.name = IllegalArgumentError.name;
    }

    get message(): string{
        return this._message;
    }
}

/*
* This Quadtree data structure is implemented as lossy index, meaning that the index may produce false matches
* for geometries other than Points e.g. LineStrings and Polygons, because it's only tested for spatial intersection
* against the specified bounding box of the geometry.
 * */
export default class Quadtree<T extends Geometry>{
    private static readonly DEFAULT_CAPACITY = 16;

    private geometries: T[] = [];
    private ne!: Quadtree<T> | null;
    private nw!: Quadtree<T> | null;
    private sw!: Quadtree<T> | null;
    private se!: Quadtree<T> | null;
    protected isRootNode = true;

    constructor(private _envelope: Envelope, private readonly capacity = Quadtree.DEFAULT_CAPACITY) {
    }

    get envelope(): Envelope{
        return this._envelope;
    }

    add(geometry: T): void{
        if(!this._envelope.intersects(geometry.envelope())){
            throw new IllegalArgumentError("The specified geometry is not within the extent of the quadtree.");
        }

        if(this.isLeafNode()){
            if(!this.shouldSubdivide()){
                this.geometries.push(geometry);
                return;
            }

            this.subdivide();

            for (const geom of [...this.geometries, geometry]) {
                this.addGeometryToChildNode(geom);
            }

            this.geometries = [];
        }
        else{
            this.addGeometryToChildNode(geometry);
        }
    }

    find(bbox: Envelope): T[]{
        if(this.isLeafNode()){
            return this.geometries.filter(geometry => bbox.intersects(geometry.envelope()));
        }

        const geometries: T[] = [];
        [this.ne, this.nw, this.sw, this.se].forEach(childNode => {
            if(childNode && bbox.intersects(childNode.envelope)){
                const nodes = childNode.find(bbox);
                geometries.push(...nodes);
            }
        });

        //remove duplicate geometries from  the different quadrants
        if(this.isRootNode){
            return [...new Set(geometries)];
        }

        return geometries;
    }

    remove(geometry: T): boolean{
        if(this.isLeafNode()){
            const index = this.geometries.indexOf(geometry);
            if(index > -1){
                this.geometries.splice(index, 1);
                return true;
            }

            return false;
        }

        const removed = [this.ne, this.nw, this.sw, this.se].some(childNode =>
            childNode?.envelope.intersects(geometry.envelope()) && childNode.remove(geometry));

        if(removed){
            const geometries = this.find(this.envelope);
            if(geometries.length <= this.capacity){
                this.geometries = geometries;
                this.ne = this.nw = this.sw = this.se = null;
            }

            return true;
        }

        return false;
    }

    private isLeafNode(): boolean{
        return !this.ne;
    }

    private subdivide() {
        const dx = this.envelope.maxX - this.envelope.minX;
        const dy = this.envelope.maxY - this.envelope.minY;
        const centerX = this.envelope.minX + dx / 2;
        const centerY = this.envelope.minY + dy / 2;

        this.ne = new Quadtree(new Envelope(centerX, centerY, centerX + dx / 2, centerY + dy / 2));
        this.nw = new Quadtree(new Envelope(this.envelope.minX, centerY, centerX, dy / 2 + centerY));
        this.sw = new Quadtree(new Envelope(this.envelope.minX, this.envelope.minY, centerX, centerY));
        this.se = new Quadtree(new Envelope(centerX, this.envelope.minY, this.envelope.maxX, centerY));
        [this.ne, this.nw, this.sw, this.se].forEach(node => node.isRootNode = false);
    }

    private shouldSubdivide(){
        return this.geometries.length > this.capacity;
    }

    private addGeometryToChildNode(geometry: T){
        [this.ne, this.nw, this.sw, this.se].forEach(childNode => {
            if(childNode?.envelope.intersects(geometry.envelope())){
                childNode.add(geometry);
            }
        });
    }
}