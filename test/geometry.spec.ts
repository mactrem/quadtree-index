import {Envelope, Point} from "../src/geometry";

describe("Envelope", ()=> {
    describe("intersect", ()=>{
        it("should intersect if both overlap",()=>{
            const e1 = new Envelope(10,10,20,20);
            const e2 = new Envelope(15, 15, 25, 25);

            const intersects = e1.intersects(e2);

            expect(intersects).toBeTruthy();
        });

        it("should not intersect",()=>{
            const e1 = new Envelope(10,10,20,20);
            const e2 = new Envelope(5, 5, 9.99, 9.99);

            const intersects = e1.intersects(e2);

            expect(intersects).toBeFalsy();
        });

        it("should intersect if second extend overlays first extend",()=>{
            const e1 = new Envelope(10,10,20,20);
            const e2 = new Envelope(5, 5, 25, 25);

            const intersects = e1.intersects(e2);

            expect(intersects).toBeTruthy();
        });
    });
});

describe("Point", () => {
    it("getter should return x and y", () => {
        const x = 13;
        const y = 49;
        const point = new Point(x, y);

        expect(point.x).toBe(x);
        expect(point.y).toBe(y);
        expect(point.z).toBe(undefined);
    });
});