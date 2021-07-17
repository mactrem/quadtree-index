# quadtree-index

Quadtree data structure for indexing 2D geospatial data.  
Implemented as lossy index, meaning that the index may produce false matches for geometries other than points,  
because it's only tested for spatial intersection against the specified bounding box of the geometry.

## API

#### new Quadtree(envelope, capacity)
Creates an Quadtree index for the given bounding box.
- `envelope`: Spatial extent of the Quadtree.
- `capacity`: Defaults to 16.
```js
const extent = new Envelope(12, 48, 13, 49);
const quadtree = new Quadtree(extent);
```

#### quadtree.add(geometry)
Add a geometry to the index.
- `geometry`: Geometry which has to implement a method `envelope`
```js
const point = new Point(12.88, 49.01);
quadtree.add(point)
```

#### quadtree.find(envelope)
Find all geometries in the Quadtree index which intersects with the given envelope.  
This may produce false matches, because it's only tested for spatial intersection against the specified bounding box of the geometry.
- `envelope`: Bounding box to test the intersection against.
```js
const extent = new Envelope(10, 10, 20, 20);
const geometries = quadtree.find(extent);
```

#### quadtree.remove(geometry)
Remove the given geometry from the index.
- `geometry`: Geometry which should be removed from the Quadtree.
```js
const point = new Point(12.88, 49.01);
const removed = quadtree.remove(point);
```