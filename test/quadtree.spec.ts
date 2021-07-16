import Quadtree from "../src/quadtree";
import IllegalArgumentError from "../src/illegalArgumentError";
import Geometry, {Envelope, Point} from "../src/geometry";


describe("Quadtree", () => {
    const extent = new Envelope(1, 1, 80, 80);

    it("can create instance", () => {
        const quadtree = new Quadtree(extent);
    });

    it("should return specified envelope", () => {
        const quadtree = new Quadtree(extent);

        const actualExtent = quadtree.envelope;

        expect(actualExtent).toEqual(extent);
    });

    it("can add geometry to quadtree", () => {
        const point = new Point(12.88, 48.44);
        const quadtree = new Quadtree(extent);

        quadtree.add(point);
    });

    it("should throw error if geometry is not within the extent of the quadtree", () => {
        const point = new Point(12.88, 49.01);
        const quadtree = new Quadtree(extent);

        expect(() => quadtree.add(point)).toThrow(IllegalArgumentError);
    })

    it("can query one geometry from quadtree", () => {
        const bbox = new Envelope(12.5, 48.2, 12.9, 48.9)
        const point = new Point(12.88, 48.44);
        const quadtree = new Quadtree(extent);

        quadtree.add(point);

        const actualPoints = quadtree.find(bbox);

        expect(actualPoints).toEqual([point]);
    });

    it("can query a geometry when a bbox filter is used", () => {
        const bbox = new Envelope(12.5, 48.2, 12.9, 48.9)
        const point = new Point(12.88, 48.44);
        const point2 = new Point(12.12, 48.44);
        const quadtree = new Quadtree(extent);

        quadtree.add(point);
        quadtree.add(point2);

        const actualPoints = quadtree.find(bbox);

        expect(actualPoints).toEqual([point]);
    });

    it("can query a geometry when a bbox filter is used for a tree with 2 level", () => {
        const expectedPoints = [new Point(10.20,10.20), new Point(10.30,10.30), new Point(10.40,10.40), new Point(10.50,10.50)]
        const quadtreeExtent = new Envelope(10, 10, 20, 20);
        const numberOfPoints = 100;
        const deltaX = (quadtreeExtent.maxX - quadtreeExtent.minX) / numberOfPoints;
        const deltaY = (quadtreeExtent.maxY - quadtreeExtent.minY) / numberOfPoints;
        const quadtree = new Quadtree(quadtreeExtent);
        for(let i = 0; i < numberOfPoints; i++){
            const point = new Point(quadtreeExtent.minX + i * deltaX, quadtreeExtent.minY + i * deltaY);
            quadtree.add(point);
        }

        const actualPoints = quadtree.find(new Envelope(10.11, 10.11, 10.52, 10.52));

        expect(actualPoints.length).toEqual(4);
        expect(actualPoints).toEqual(expect.arrayContaining(expectedPoints));

    });

    it("should remove geometry", () => {
        const quadtreeExtent = new Envelope(10, 10, 20, 20);
        const numberOfPoints = 100;
        const deltaX = (quadtreeExtent.maxX - quadtreeExtent.minX) / numberOfPoints;
        const deltaY = (quadtreeExtent.maxY - quadtreeExtent.minY) / numberOfPoints;
        const quadtree = new Quadtree(quadtreeExtent, 4);

        let testPoint: any = null;

        for(let i = 0; i < numberOfPoints; i++){
            const point = new Point(quadtreeExtent.minX + i * deltaX, quadtreeExtent.minY + i * deltaY);
            quadtree.add(point);
            testPoint = point;
        }

        const removed = quadtree.remove(testPoint);

        expect(removed).toBeTruthy();
        expect(quadtree.find(quadtreeExtent).length).toBe(numberOfPoints - 1);
    });

    it("should not remove geometry when not existing geometry is specified", () => {
        const quadtreeExtent = new Envelope(10, 10, 20, 20);
        const numberOfPoints = 100;
        const deltaX = (quadtreeExtent.maxX - quadtreeExtent.minX) / numberOfPoints;
        const deltaY = (quadtreeExtent.maxY - quadtreeExtent.minY) / numberOfPoints;
        const quadtree = new Quadtree(quadtreeExtent, 4);

        for(let i = 0; i < numberOfPoints; i++){
            const point = new Point(quadtreeExtent.minX + i * deltaX, quadtreeExtent.minY + i * deltaY);
            quadtree.add(point);
        }

        const removed = quadtree.remove(new Point(9.99, 9.99));

        expect(removed).toBeFalsy();
        expect(quadtree.find(quadtreeExtent).length).toBe(numberOfPoints );
    });

    it("should remove geometries", () => {
        const quadtreeExtent = new Envelope(10, 10, 20, 20);
        const numberOfPoints = 100;
        const deltaX = (quadtreeExtent.maxX - quadtreeExtent.minX) / numberOfPoints;
        const deltaY = (quadtreeExtent.maxY - quadtreeExtent.minY) / numberOfPoints;
        const quadtree = new Quadtree(quadtreeExtent, 4);

        const testPoints: Point[] = [];
        const testEnvelope = new Envelope(18.75, 18.75, 20, 20);
        for(let i = 0; i < numberOfPoints; i++){
            const point = new Point(quadtreeExtent.minX + i * deltaX, quadtreeExtent.minY + i * deltaY);
            quadtree.add(point);

            if(testEnvelope.intersects(point.envelope())){
                testPoints.push(point);
            }
        }

        testPoints.forEach(point => quadtree.remove(point));

        expect(quadtree.find(quadtreeExtent).length).toBe(numberOfPoints - 12);
    });
});