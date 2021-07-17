import {Envelope, Point} from "../src/geometry";
import Quadtree from "../src/quadtree";
import fs from "fs";

type Feature = { geometry: { coordinates: any[]; }; };

const envelope = new Envelope(12.945229, 48.937939, 13.200303, 49.178006);
const geoJson = JSON.parse(fs.readFileSync("./data/gemeinden.geojson", "utf8"));
const points: Point[] = geoJson.features.flatMap((feature: Feature) => feature.geometry.coordinates[0]).
    map((vertex: number[])  => new Point(vertex[0], vertex[1])).filter((vertex: { x: any; }) => !Array.isArray(vertex.x));

[1e2, 5e2, 1e3, 5e3, 1e4, 5e4, 1e5, points.length].forEach(numberOfPoints => {
    const selectedPoints = points.slice(0, numberOfPoints);
    console.group("Number of points: ", numberOfPoints);

    const t1 = linearScan(selectedPoints, envelope);
    const t2 = quadtreeScan(selectedPoints, envelope);

    console.info("Linear scan time: ", t1);
    console.info("Quadtree scan time: ", t2);
    console.info("Quadtree performance factor: ", t1 / t2);
    console.groupEnd();
});

function linearScan(points: Point[], envelope: Envelope): number{
    const filteredPoints: Point[] = [];
    const start = process.hrtime();

    for(const point of points){
        if(envelope.intersects(point.envelope())){
            filteredPoints.push(point);
        }
    }

    const elapsed = process.hrtime(start)[1] / 1000000;
    console.info("Number of filtered points via linear scan: ", filteredPoints.length);
    return elapsed;
}

function quadtreeScan(points: Point[], envelope: Envelope): number{
    const quadtree = new Quadtree<Point>(new Envelope(5.7,47.029089,15.820087,55.575970));
    console.time("Quadtree construction time");
    points.forEach(point => quadtree.add(point));
    console.timeEnd("Quadtree construction time");

    const start = process.hrtime();

    const filteredPoints = quadtree.find(envelope);

    const elapsed = process.hrtime(start)[1] / 1000000;
    console.info("Number of filtered points via Quadtree scan: ", filteredPoints.length);
    return elapsed;
}