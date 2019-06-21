//// constructor capas///


 function crearCapa(op){
    this.id = App.capas.length;
    this.nombre=op.nombre;
    this.nombre_as=op.nombre_as;
    this.datos=op.datos_consultables;
    this.datos_as=op.ver_consultables_as;
    (op.template)? this.template=op.template : this.template=null ;
    (op.filtro)? this.filtro=op.filtro : this.filtro=null ;
    (op.grupo)? this.grupo=op.grupo : this.grupo=null ;
    (op.activo)? this.activo=op.activo : this.activo=false ;
    (op.wms)? this.wms=op.wms : this.wms = App.geoserver+'/wms?';
    (op.lupita==false)? this.lupita=op.lupita : this.lupita = true;
    (op.cantidad)? this.cantidad=op.cantidad : this.cantidad=null;	
    if(op.estilo){
	this.estilo=op.estilo;
	this.iconito=App.geoserver+"/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style="+this.estilo
	} 
	else {
		this.estilo='';
		this.iconito=App.geoserver+"/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+this.nombre
	    };
var textoLayer;
var filtrito;
(this.filtro)? filtrito= "&cql="+this.filtro : filtrito=''; 
(this.lupita)? textoLayer = "<ident style='display:none'>"+this.id+"</ident><img src='/librerias/mapas/images/zoomto.ico' style='width:15;height:15' onclick='zoomaLaCapa(this)'></img>"+this.nombre_as : textoLayer = this.nombre_as;
(this.cantidad)? textoLayer = textoLayer + '<img src="/librerias/ajax/wmsextent.php?layer='+this.nombre+filtrito+'&cant=true'+'"'+'></img>' : textoLayer=textoLayer;

var aux;
if (this.grupo == null || this.grupo =="base" || this.grupo =="gwc")
    {// Es una capa sin grupo o es la capa base
    aux={
        nodeType: "gx_layer",
        text: this.nombre_as ,
        checked: false,
        layer: this.nombre_as,
        leaf: true,
        icon: this.iconito
        };
        if (this.grupo == null){App.grupo.push(aux);}
   }
    else {
           aux = {
	 	  nodeType: "gx_layer",		  
		  checked: this.activo,
		  layer: this.nombre_as,
		  leaf: true,
 		  text: textoLayer,	
		  icon: this.iconito
		 };
          if (App.grupo[this.grupo])
             {
              App.grupo[this.grupo].children.push(aux)
             }else
                  {
                    App.subgrupo[this.grupo].items.children.push(aux)
                   }
         }// del else
 addCapa(this,this.activo);
}


function addCapa(capa,visible){
   var layer;
   if(capa.grupo !=='base' && capa.grupo !=='gwc'){
      layer = new OpenLayers.Layer.WMS( capa.nombre_as, capa.wms,
		{layers: capa.nombre, format: 'image/png',transparent:true, cql_filter:capa.filtro, styles:capa.estilo  },
		{isBaseLayer: false, singleTile: true,visibility: visible});

      }else{
        if(capa.grupo=='gwc'){
           layer = new OpenLayers.Layer.WMS( capa.nombre_as, 'http://wms.mapaeducativo.edu.ar/geoserver/wms',
		{layers: 'base', format: 'image/png8',transparent:true,tiled:true  },
		{isBaseLayer: true,visibility: visible,buffer: 0,yx : {'EPSG:900913' : false} });
   
        }else{
                layer = new OpenLayers.Layer.WMS( capa.nombre_as, capa.wms,
		{layers: capa.nombre, format: 'image/png8',transparent:true },
		{isBaseLayer: true, singleTile: true,visibility: visible,ratio:1.1});
	     }
   }
   App.map.addLayer(layer);
App.capas.push(capa);
}

