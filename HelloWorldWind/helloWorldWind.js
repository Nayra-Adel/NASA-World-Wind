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

// Add a COLLADA model
var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);

var position = new WorldWind.Position(1, .5, 800000.0);
var config = {dirPath: WorldWind.configuration.baseUrl + 'examples/collada_models/duck/'};
var colladaLoader = new WorldWind.ColladaLoader(position, config);

colladaLoader.load("duck.dae", function (colladaModel) {
    colladaModel.scale = 9000;
    modelLayer.addRenderable(colladaModel);
});

// Accessing a map imagery service (WMS "Web Map Service")
// visualize imagery over the globe of the average temperature over land

// Retrieved an imagery layer from NASA Earth Observations WMS
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";

var layerName = "MOD_LSTD_CLIM_M"; // Average Temperature Data

/*
** Creates a WmsCapabilities object from the XML document.
** Retrieves a WmsLayerCapabilities object by the desired layer name.
** Constructs a configuration object from the WmsLayerCapabilities object.
** Creates the WMS Layer from the configuration object.
** Adds the layer to the WorldWindow.
*/
var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
    wwd.addLayer(wmsLayer);
};

// Handle possible errors that may occur is something fails during the WMS request
var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
    " exception: " + exception);
};
$.get(serviceAddress).done(createLayer).fail(logError);
