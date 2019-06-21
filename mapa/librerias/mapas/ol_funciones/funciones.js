////////funciones/////////

function zoomInicial(){
    if(App.cue.length > 7 && App.cue.length < 10){
    OpenLayers.loadURL('/librerias/ajax/zoomtocue.php?cueanexo='+App.cue,'',this,zoomtocue);
    }else{
        App.map.zoomToMaxExtent();
        }
}


function zoomtocue(response) {

if(response.responseText !=="error"){
    var datos= (response.responseText).split('::');
    var point = new OpenLayers.Geometry.Point(datos[0], datos[1]);
    var feature = new OpenLayers.Feature.Vector(point);
    feature.attributes.cueanexo=datos[2];
    feature.attributes.nom_est=datos[3];
    feature.attributes.nom_prov=datos[4];
    feature.attributes.nom_depto=datos[5];
    feature.attributes.nom_loc=datos[6];
    App.vector.destroyFeatures();
    App.vector.setVisibility(true);
    App.vector.addFeatures(feature);
    App.map.zoomToExtent(App.vector.getDataExtent());
}else{
     alert("Error: No se encontró Establecimiento con el cueanexo "+App.cue);
     App.map.zoomToMaxExtent();
     }
}
// Esta funcion recibe todos los features de la consulta
// y si el feature tiene cueanexo lo cambia por un link
function linkAlegajo(features){
   for (var x=0;x<features.length ;x++ ){
       var a = features[x].attributes.cueanexo;
       if (a!==undefined){
       a="<a href='/legajo/legajo.php?cueanexo="+a+"' target='_blank'>"+a+"</a>";
       features[x].attributes.cueanexo=a;
        }
   }

}

function linkAcnc(features){
   for (var x=0;x<features.length ;x++ ){
       var a = features[x].attributes.codigo_cnc;
       if (a!==undefined){
       a="<a href='/cnc_tda/formularios/crear_ajax/"+a+"' target='_blank'>"+a+"</a>";
       features[x].attributes.codigo_cnc=a;
        }
   }

}

function borrarVector()
         {
 	  App.vector.destroyFeatures();
          App.datos=[];
          App.store=[];
          App.fields=[];
          App.col=[];
          }

function agregarFids(features,fid){
 for(var k=0;k<features.length;k++){
    features[k].fid=fid;
 }
return features;
}

function cargarCapaVector(response){
	var grid;
	var gml_format = new OpenLayers.Format.GML();
	reiniciarTemplateFids(); 
        var oFeatures = gml_format.read(response.responseText);
        if (oFeatures.length > 0){   
	   var fid = App.urls[App.urls.length - 1].ident;
           App.fids.push(fid);	        
	   linkAlegajo(oFeatures);
           linkAcnc(oFeatures);
	   guardarIdsTemplate(fid,oFeatures);
	   oFeatures=agregarFids(oFeatures,fid);	
           App.vector.addFeatures(oFeatures);	   
           cargarStores(App.capas,fid);
	   if(App.template_ids[fid])
		{
	     	 var ids = (App.template_ids[fid]['ids']).toString();
             	 grid={
             	 title: fid ,
             	 iconCls: 'tabs',
             	 closable:true,
             	 autoLoad : {
                              url : App.template_ids[fid]['url'],
                              scripts: true,
                              method:'post',
                              params: {id:ids }
                            }};	   
           }
	    else { 
	    	  grid = new Ext.grid.GridPanel({
            	   	store: App.store[fid],
                  	columns: App.col[fid],
            	  	stripeRows: true,
            	  	height:350,
            	  	width:600,
            	  	title:fid
    	    	    });
		  }
  	   App.grids.push(grid);
	 }// del if
	App.urls.pop();
	consultarCapas(App.urls);
}

function consultarCapas(urls){
if(urls.length>0){
		  OpenLayers.loadURL(urls[urls.length - 1].url, '', this, cargarCapaVector);
		 } else mostrarResultados(); 	
			
}

function crearUrls(strcapas){
   App.vector.destroyFeatures();
   var capas = strcapas.split(',');
   var url=[];
   App.urls = [];
	for(var l=0;l<capas.length;l++){
   		for(var l2=0;l2 < App.capas.length;l2++)
      		  {
			if (capas[l]==App.capas[l2].nombre_as){
	   		
	   		if(App.capas[l2].filtro!==null){   
			var cql=App.capas[l2].filtro+" and bbox(the_geom,"+App.box+")";
			url = { url : App.geoserver+
			"/ows?service=WFS&version=1.0.0&request=GetFeature&typeName="
			+App.capas[l2].nombre+
			"&maxFeatures=50&CQL_FILTER="+encodeURIComponent(cql), ident: App.capas[l2].nombre_as};	   	
			}
	    		else
			    url = { url : App.geoserver+
			   "/wms/ows?service=WFS&version=1.0.0&request=GetFeature&maxFeatures=50&typeName="
			   +App.capas[l2].nombre+"&bbox="+App.box , ident : App.capas[l2].nombre_as};	         	
	 	  	}
	
     		  }//del for	
    
      		 App.urls.push(url);
      }//del for

  consultarCapas(App.urls);
}

function mostrarResultados() {

 var oFeatures = App.vector.features;         
 if(oFeatures.length > 49){
     alert("La selección supera los 50 puntos por lo tanto algunos puntos no serán mostrados");
    }
 var tabs = new Ext.TabPanel({
            activeTab: 0,
            width:600,
            height:250,
            plain:true,
            defaults:{autoScroll: true},
            items:App.grids
  });   
 if(App.win){App.win.destroy();}// si ya hay una ventana abierta la borro

 if(App.grids.length > 0) // si encontro algun resultado en ese punto abrir la ventana
     {
        App.win =new Ext.Window({
        layout: "fit",
        height:400,
        width: 650,
        autoScroll:true,
        maximizable :true,
        closeAction:'hide',
        collapsible : true,
        items:tabs
        }).show();
    }else          // si no encontro nada muestro un mensaje
         {
           App.win =new Ext.Window({
           layout: "fit",
           bodyStyle:'background-color:white',
           html:'No se encontraron resultados'
           }).show();
         }
    if(oFeatures.length > 0){
           limpiarStores();
        }
App.loading.hide();
}

function getFid(feature){
     var fid =feature.fid;	
    return fid;
}

// esta funcion devuelve los atributos de un feature pero solo un maximo de 5
function getAtributos(feature){
    if(feature.attributes){
        var datos = new Array();
        for(i in feature.attributes){
        datos.push(i);
        }
    }
return datos;

}


function crearGrupo(nombre,expandido){
    App.grupo[nombre]={
        text: nombre,
        leaf: false,
        expanded: expandido,
        checkable: false,
        children: []
    }

    return nombre;
}

function crearSubGrupo(padre,nombre,expandido){
    App.subgrupo[nombre]={           
        items:{
                text: nombre,  
                padre:padre,              
                leaf: false,
                expanded: expandido,
                checkable: false,
                children: []
              }
    }
    if(App.grupo[padre]){
       App.grupo[padre].children.push(App.subgrupo[nombre].items);
      }else{
      		var aux=getPadre(padre);
      		var abuelo=aux[0];
      		var ind_padre=aux[1]
      		App.grupo[abuelo].children[ind_padre].children.push(App.subgrupo[nombre].items);
            //App.subgrupo[padre].children.push(App.subgrupo[nombre].items);
            }
    return nombre;
}

function getPadre(nombre){
	for(i in App.grupo){
        for(j in App.grupo[i].children){
        	var nodo=App.grupo[i].children[j];
        	if(nodo.text==nombre){        		
        		return [nodo.padre,j];
        	}
        }
    }

}

function getDatosDeCapa(capas,nombre){
    for (var key in capas){
        if (capas[key].nombre_as==nombre){
            return [capas[key].datos,capas[key].datos_as];
        }
    }
}

function getCapasActivas(map){
    App.vector.setVisibility(false);
    var layersActivos=map.getLayersBy('visibility',true);
    App.vector.setVisibility(true);
    if (layersActivos.length < 2){
        alert("Necesita elegir al menos una capa para poder Consultar");
        App.vector.destroyFeatures();
        return "error"
        }else{
           var typename="";
            for (var indic=0; indic < layersActivos.length; indic++){
            if (layersActivos[indic].params!= undefined && layersActivos[indic].isBaseLayer !== true){
            
            typename=typename + layersActivos[indic].name +",";
                }
            }
            typename = typename.substring(0,typename.length -1);
            return typename;
   }// del else
}

function cargarStores(capas,fid){

    var dts=getDatosDeCapa(capas,fid);
             App.col[fid]=[];
             App.fields[fid]=[];
             App.datos[fid]=[];
             //dts[0] tiene los campos y dts[1] como se tiene que llamar el campo
             for (key in dts[0]){
                 App.col[fid][key]={header: dts[1][key], dataIndex:dts[0][key],width: 100, sortable:true};
                 App.fields[fid][key]={name: dts[0][key], type: 'string'};
                }
             App.store[fid] = new GeoExt.data.FeatureStore({
             layer: App.vector,
             features:App.store[fid],
             fields:App.fields[fid]
             });


}

// Esta funcion se encarga de filtrar cada store para que cada tab solamante muestre la info
// correspondiente a esa capa,
//  ya que como el grid esta unido a la capa vector,
//   entonces cada store es cargado inicialmente con todos los features de la capa vector
function limpiarStores(){
        for (var key=0;key <App.fids.length;key++){
             if(App.store[App.fids[key]]){
             App.store[App.fids[key]].clearFilter();
             App.store[App.fids[key]].filterBy(function(record){
                     var fid_tmp=record.data.fid;
                     if(fid_tmp==App.fids[key]){
                         return true;
                     }else{
                         return false;
                     }
                });
             }
        }

}

function getNombre_as(fid){
    
    for (var key =0; key <= App.capas.length; key++){
        if(App.capas[key] == undefined){
            return "RESULTADO"
        }else{
        if(fid==App.capas[key].nombre){
           return App.capas[key].nombre_as;
        }
     }
    
}
}
function cargarTemplatesFids(){
    for (var x=0;x < App.capas.length; x++){
         if (App.capas[x].template!==null){
           var nombre = App.capas[x].nombre_as;
           App.template_ids[nombre]=[];
           App.template_ids[nombre]['ids']=[];
	   App.template_ids[nombre]['url']=App.capas[x].template;
            }
        }
}

function reiniciarTemplateFids(){
    cargarTemplatesFids()
}

function guardarIdsTemplate(fid,features){

    for (var x=0;x < App.capas.length; x++){
         if (App.capas[x].nombre_as==fid){
            var capa = App.capas[x];
            }
        }
    if (capa.template!==null){ //porque usa un template
        var dato=capa.datos[0];
	for(var f=0;f<features.length;f++){
	    App.template_ids[fid]['ids'].push(features[f].data[dato]);
	}
    }
}


function resp_zoomaLaCapa(response){
  var json_format = new OpenLayers.Format.JSON();
  var datos = json_format.read(response.responseText);
  if(datos){
     var extent = new OpenLayers.Bounds(datos[0],datos[1],datos[2],datos[3]);
     App.map.zoomToExtent(extent,true);     
   }
  App.loading.hide();
}


function zoomaLaCapa(nomcapa){
 var id_capa=nomcapa.previousSibling.innerHTML;
 //var nom_as=htmlEntities(nomcapa.nextSibling.nodeValue);
 var nom;
 var params;
 var id; 
 for(var i=0;i<App.capas.length;i++)
    {
      id = App.capas[i].id;
	if(id==id_capa)
	  {
	   nom = App.capas[i].nombre;
	   (App.capas[i].filtro)? params = 'layer='+nom+'&cql='+App.capas[i].filtro : params = 'layer='+nom ;
          
	   }
    }
 App.loading.show();
 OpenLayers.loadURL('/librerias/ajax/wmsextent.php?'+params,'',this,resp_zoomaLaCapa);

}


function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function crearVentanaGoogle(center) {
	// visor de google earth
	App.visorActivo = true;
	App.visorGE = new mapfish.earth(
		App.map, 'gearthdiv',
		{
			lonLat: center,
			altitude: 500,
			heading: 0,
			tilt: 45,
			range: 700
		}
	);
	// ext.window con el visor
	App.ventanaGE = new Ext.Window({
		title: 'Google Earth',
		width: App.map.getSize().w*0.8,
		height: App.map.getSize().h*0.8,
		layout: 'fit',
		resizable: true,
		forceLayout: true,
		collapsible: true,
		closeAction: 'hide',
                contentEl :'gearthdiv'
		
	});
	// cuando cierro la ventana oculto la capa vectorial que tiene el ojo(obervador)-lineavisual-centro
	App.ventanaGE.on('hide', function() {
		App.visorGE.earthLayer.setVisibility(false);
	});
	App.ventanaGE.on('resize', function() {
		var anchog = App.ventanaGE.getInnerWidth();
		var altog = App.ventanaGE.getInnerHeight();
		Ext.get('gearthdiv').setWidth(anchog);
		Ext.get('gearthdiv').setHeight(altog);
	});
}




function cargarCapasGoogle()
{
var gphy = new OpenLayers.Layer.Google(
    "Google Relieve",
    {type: google.maps.MapTypeId.TERRAIN,
     numZoomLevels: 25}
    // used to be {type: G_PHYSICAL_MAP}
);


var gmap = new OpenLayers.Layer.Google(
    "Google Vial", // the default
    {numZoomLevels: 25}
    // default type, no change needed here
);
var ghyb = new OpenLayers.Layer.Google(
    "Google H&iacute;brido",
    {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 25}
    // used to be {type: G_HYBRID_MAP, numZoomLevels: 20}
);
var gsat = new OpenLayers.Layer.Google(
    "Google Satelital",
    {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 25}
    // used to be {type: G_SATELLITE_MAP, numZoomLevels: 22}
);

var osm= new OpenLayers.Layer.OSM();

App.map.addLayer(gphy);
App.map.addLayer(gmap);
App.map.addLayer(ghyb);
App.map.addLayer(gsat);
App.map.addLayer(osm);


}
