# quadtree-index

Quadtree data structure for indexing 2D geospatial data.  
Implemented as lossy index, meaning that the index may produce false matches,  
because it's only tested for spatial intersection against the specified bounding box of the geometry.