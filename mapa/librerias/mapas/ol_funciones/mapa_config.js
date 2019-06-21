function cargarConfigMapa(){
App.geoserver="/geoserver"; 
var options = {
  maxExtent: App.bounds,
  //tileSize:new OpenLayers.Size(1024,1024),
  projection: "EPSG:900913",
  units: "m",
  //scales: [50000000,35000000,10000000,1000000,250000,100000,75000,50000,20000,10000],
  scales: [27734017,23000000,21000000,20000000,19000000,13867008,6933504,3466752,1733376,866688,433344,216672,108336,54168,27084,13542,6771,3385,1682,846,423,211],
  controls:[]
 };

App.map = new OpenLayers.Map('map', options);

var simbolo={
          graphicName: "star",
          pointRadius: 8,
          fillColor: "#FFF58F",
          strokeColor: "#ff1313",
          strokeWidth: 2
         };
	

App.vector=new OpenLayers.Layer.Vector("vector",
                    {isBaseLayer: false,
                    extractAttributes: true,visibility: false,
		styleMap: new OpenLayers.StyleMap(simbolo)
 });

// la capa vector se agrega al mapa recien al final del index.php

}
