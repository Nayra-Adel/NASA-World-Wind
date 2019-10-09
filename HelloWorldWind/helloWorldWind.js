// Loading and displaying a WorldWind globe
var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Drawing placemarks
var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
wwd.addLayer(placemarkLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);

/* WorldWind.configuration.baseUrl provides us
** with a relative path to the root folder
** where Web WorldWind is being served
*/
placemarkAttributes.imageSource = WorldWind.configuration.baseUrl
                                + "images/pushpins/plain-red.png";

/*
** WorldWind.Position object  used to
** define the placemark location over
** the globe in terms of geographic coordinates
*/

// The creation of a placemark at 21.23° N latitude, 38.25° W longitude and 0 meters altitude
var position = new WorldWind.Position(21.23, 38.25, 0);

/*
** we desired the placemark size to scale according to the camera zoom.
** so, we will make the placemark size to remain constant = set to false.
*/
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

/*
** Using the Placemark.label, we can define the text contents of it.
** we’ll display the placemark’s latitude and longitude. We’ll
** also want the placemark to always be drawn on top of other shapes placed over the globe.
*/
placemark.label = "Red Sea\n" +
    placemark.position.latitude.toPrecision(4).toString() + "°N\n" +
    placemark.position.longitude.toPrecision(5).toString() + "°E";
placemark.alwaysOnTop = true;

placemarkLayer.addRenderable(placemark);

// Displaying 3D shapes
var polygonLayer = new WorldWind.RenderableLayer();
wwd.addLayer(polygonLayer);

var polygonAttributes = new WorldWind.ShapeAttributes(null);
polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
polygonAttributes.outlineColor = WorldWind.Color.BLUE;
polygonAttributes.drawOutline = true;
polygonAttributes.applyLighting = true;

var boundaries = [];
boundaries.push(new WorldWind.Position(22.0, 4.0, 700000.0));
boundaries.push(new WorldWind.Position(22.0, 20.0, 700000.0));
boundaries.push(new WorldWind.Position(13.0, 20.0, 700000.0));
boundaries.push(new WorldWind.Position(13.0, 4.0, 700000.0));

/*
** we displayed our shape as an extrusion from the surface of the Earth,
** and we use the polygon.extrude attribute set to true for this.
** If set to false, we would see a hovering triangle without thickness instead.
*/
var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
polygon.extrude = true;
polygonLayer.addRenderable(polygon);