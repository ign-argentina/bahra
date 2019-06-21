function getControles(){
// inicializar variables
App.store=[];
App.col=[];
App.fields=[];
App.datos=[];
App.url="";
App.aValores=[];
App.grid=[];
App.template_ids=[];
App.visorActivo = false;
App.datos=[];
App.store=[];
App.fields=[];
App.col=[];
App.subgrupo=[];

App.ctrl= [];
App.toolbarItems = [];
App.action= {};
App.actions = {};
App.loading = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando..."});

var opciones = {restrictedExtent: App.bounds,
                maxResolution: "auto",
                projection:"EPSG:900913",
                tileSize:new OpenLayers.Size(512,512),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                units: "m",
                scales: [50000000,35000000,10000000],
                theme: false};

App.map.addControl (new OpenLayers.Control.OverviewMap(
{mapOptions: opciones,
 size: new OpenLayers.Size(250,250),
 div: OpenLayers.Util.getElement("Mapa de referencia")}));

App.map.addControl(new OpenLayers.Control.Permalink());

App.tabs = new Ext.TabPanel({

            resizeTabs:true, // turn on tab resizing
            minTabWidth: 115,
            tabWidth:150,
            padding:2,
            enableTabScroll:true,
            width:600,
            height:250,
            defaults: {autoScroll:true}
            //plugins: new Ext.ux.TabCloseMenu()
            });

////// Boton de Consulta///////////

App.consulta = new OpenLayers.Control();
App.consulta.events.remove("activate");

App.consulta.events.register("activate", App.consulta, function(){boxx.activate();});
App.consulta.events.register("deactivate", App.consulta, function(){});

OpenLayers.Util.extend(App.consulta, {
    draw: function () {
           boxx = new OpenLayers.Handler.Box( App.consulta,
           {done: this.notice},
           {keyMask: OpenLayers.Handler.MOD_NONE});
    },
   notice: function (bounds){
           var sw;
           var ne;
           var box;
           var boxtemp;
      if (bounds.top===undefined){ // si left,top,right o left son indefinidos significa q es un punto
            sw = App.map.getLonLatFromViewPortPx(new OpenLayers.Pixel((bounds.x)-5 , (bounds.y)+5) );
            ne = App.map.getLonLatFromViewPortPx(new OpenLayers.Pixel((bounds.x)+5 , (bounds.y)-5) );
            boxtemp = new OpenLayers.Bounds(sw.lon, sw.lat, ne.lon, ne.lat);
            App.box = boxtemp.toBBOX();
        }else{ // no es un punto
            sw = App.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(bounds.left , bounds.bottom) );
            ne = App.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(bounds.right , bounds.top) );
            boxtemp = new OpenLayers.Bounds(sw.lon, sw.lat, ne.lon, ne.lat);
            App.box = boxtemp.toBBOX();
            }

         var typename = getCapasActivas(App.map);
         if (typename!=="error") {
             App.loading.show();
	     App.grids=[];
	     App.fids=[];	
             crearUrls(typename);	      
          }} // del notice
});

//////  Mouseover  del feature cuando esta seleccionado /////

 App.hover = new OpenLayers.Control.SelectFeature(App.vector,{hover:true});
 App.map.addControl(App.hover);
 App.hover.events.register("featurehighlighted", this, function(e) {createPopup(e.feature);});
 App.hover.events.register("featureunhighlighted", this, function(e) {
                           if (App.popup!==undefined){App.popup.close();
                            }
 });
App.hover.activate();


//// Crear el popup cuando se pone el mouse arriba ////

function createPopup(feature) {

var fid=getFid(feature);
var nombre_as=getNombre_as(fid);
var dts=getDatosDeCapa(App.capas,fid);
var titulo =nombre_as;
var contenido="";
var nombre;
var valor;
if(dts[0]!== undefined){
   for (var key = 0;key < dts[0].length; key ++){
       nombre= dts[1][key];
       valor = dts[0][key];
       contenido +="<b>"+nombre+" : </b>"+feature.attributes[valor]+"<br>";
    }
}else{
   
    titulo="Mapa Educativo Nacional";
    contenido="<b>Establecimiento : </b>"+feature.attributes.nom_est+"<br>";
    contenido+="<b>Cueanexo : </b><a href='/legajo/legajo.php?cueanexo="+App.cue+"' target='_blank'>"+App.cue+"</a><br>";
    contenido+="<b>Localidad : </b>"+feature.attributes.nom_loc+"<br>";
    contenido+="<b>Provincia : </b>"+feature.attributes.nom_prov+"<br>";
}
App.popup = new GeoExt.Popup({
            title: titulo,
            feature: feature,
            width:200,
            html: contenido,
            collapsible: true,
            collapsed:true
        });

        App.popup.on({
            close: function() {
                if(OpenLayers.Util.indexOf(App.vector.selectedFeatures,this.feature) > -1) {
                /// recien me di cuenta que esto esta al pedo, pero voy a asegurarme bien antes de borrar
                }
            }
        });
        App.popup.show();
    }


/////////////////////////////////////////////////////////////
////// Toolbar con acciones//////////////////////////////////
App.action =new GeoExt.Action({
        control: new OpenLayers.Control,
        handler: function(){App.map.zoomToExtent(App.bounds)},
        map: App.map,
	iconCls: 'zoomfull',
        tooltip: "zoom a la maxima extension"
    });
App.actions["max_extent"] = App.action;
App.toolbarItems.push(App.action);


/// // Navigation control and DrawFeature controls
/// // in the same toggle group
App.action = new GeoExt.Action({
            control: new OpenLayers.Control.Navigation(),
            map: App.map,
            toggleGroup: "nav",
            allowDepress: false,
            pressed: true,
            iconCls: 'pan',
            tooltip: "Navegar",
            group: "draw",
            checked: true
        });
App.actions["nav"] = App.action;
App.toolbarItems.push(App.action);
App.toolbarItems.push("-");


    // ZoomToMaxExtent control, a "button" control
App.action = new GeoExt.Action({
            control: new OpenLayers.Control.ZoomBox(),
            map: App.map,
            toggleGroup: "nav",
            iconCls: 'zoomin',
            tooltip: "Acercar"
        });
App.actions["zoom_in"] =App.action;
App.toolbarItems.push(App.action);




    // ZoomToMaxExtent control, a "button" control
App.action = new GeoExt.Action({
            control: new OpenLayers.Control.ZoomBox({out: true}),
            map: App.map,
            toggleGroup: "nav",
            iconCls: 'zoomout',
            tooltip: "Alejar"
    });
App.actions["zoom_in"] = App.action;
App.toolbarItems.push(App.action);
App.toolbarItems.push("-");

App.action = new GeoExt.Action({
             map: App.map,
             toggleGroup: "nav",
             allowDepress: false,
             iconCls: 'info',
             tooltip: 'Consultar la informacion del mapa dibujando un rectangulo o con click en el punto',
             control: App.consulta
            
});
App.actions["sel"] = App.action;
App.toolbarItems.push(App.action);
App.toolbarItems.push("-");

App.action = new GeoExt.Action({
control:new OpenLayers.Control(),
handler: function (){borrarVector();},
map: App.map,
allowDepress: false,
icon: './librerias/mapas/images/delete.png',
tooltip: 'Borrar del mapa la selecci&oacute;n actual.'
});
App.actions["sel"] = App.action;
App.toolbarItems.push(App.action);
App.toolbarItems.push("-");

//distancia
App.action = new GeoExt.Action({
control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
eventListeners: {
measure: function(evt) {
new Ext.Window({
    title: "Herramienta de medici&oacute;n de distancia",
    height:150,
    width: 400,
    layout: "fit",
    autoScroll:true,
    maximizable :true,
    collapsible : true,
    bodyStyle:'background-color:white',
    html:"La distancia es de " + evt.measure + " " + evt.units 
    }).show();
 }
}
}),
map: App.map,
toggleGroup: "nav",
iconCls: 'drawline',
tooltip: "Medir distancias"
});
App.actions["lenght"] = App.action;
App.toolbarItems.push(App.action);


// Superficie
App.action = new GeoExt.Action({
control: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, {
eventListeners: {
measure: function(evt) {

new Ext.Window({
    title: "Herramienta de medici&oacute;n de superficie",
    height:150,
    width: 400,
    layout: "fit",
    autoScroll:true,
    maximizable :true,
    collapsible : true,
    bodyStyle:'background-color:white',
    html:"La superficie es de " + evt.measure + " " + evt.units + " cuadrados"
    }).show();

 }
 }
}),
map: App.map,
toggleGroup: "nav",
iconCls: 'drawpolygon',
tooltip: "Medir superficie"
});
App.actions["lenght"] = App.action;
App.toolbarItems.push(App.action);
App.toolbarItems.push("-");


//////// Navigation history - two "button" controls
App.ctrl = new OpenLayers.Control.NavigationHistory();
App.map.addControl(App.ctrl);

App.action = new GeoExt.Action({
        control: App.ctrl.previous,
        disabled: true,
	iconCls: 'back',
        tooltip: "anterior"
    });
App.actions["previous"] = App.action;
App.toolbarItems.push(App.action);

App.action = new GeoExt.Action({
           control: App.ctrl.next,
           disabled: true,
           iconCls: 'next',
           tooltip: "siguiente"
    });

    App.actions["next"] = App.action;
    App.toolbarItems.push(App.action);
    App.toolbarItems.push("-");

App.action = new GeoExt.Action({
control:new OpenLayers.Control(),
handler: function (){
	if (App.visorActivo == false) {
	var center = App.map.getCenter();
	crearVentanaGoogle(center);
	App.ventanaGE.show();
	App.visorGE.earthLayer.setVisibility(true);
	} else {
		if (App.ventanaGE.isVisible()) {
	 	App.ventanaGE.hide();
		App.visorGE.earthLayer.setVisibility(false);
		} else {
			App.ventanaGE.show();
			App.visorGE.earthLayer.setVisibility(true);
			}
		}
        },
map: App.map,
allowDepress: false,
icon: './librerias/mapas/images/googleearth.png',
tooltip: 'Ver la vista actual en Google Earth.'
});
App.actions["gh"] = App.action;
App.toolbarItems.push(App.action);
App.toolbarItems.push("->");

//// para el video tutorial
App.action = new GeoExt.Action({
control:new OpenLayers.Control(),
handler: function (){ 
	 new Ext.Window({
	 html:"<iframe width='500' height='289' src='http://www.youtube.com/embed/vFtVlaadgLs' frameborder='0' allowfullscreen=''></iframe>",
	 title:'Tutorial',	 
	 modal:true
	 }).show();
},
map: App.map,
allowDepress: false,
icon:'./librerias/mapas/images/tutorial.png',
text:'Tutorial',
tooltip: 'Tutorial para utilizar mapas navegables'
});
App.actions["tut"] = App.action;
App.toolbarItems.push(App.action);
App.toolbarItems.push("->");


    var scaleStore = new GeoExt.data.ScaleStore({map: App.map});
    var zoomSelector = new Ext.form.ComboBox({
        store: scaleStore,
        emptyText: "Zoom Level",
        tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',
        editable: false,
        triggerAction: 'all', // needed so that the combo box doesn't filter by its current content
        mode: 'local' // keep the combo box from forcing a lot of unneeded data refreshes
    });

  
    App.map.events.register('zoomend', this, function() {
        var scale = scaleStore.queryBy(function(record){
            return App.map.getZoom() == record.data.level;
        });

        if (scale.length > 0) {
            scale = scale.items[0];
            zoomSelector.setValue("1 : " + parseInt(scale.data.scale));
        } else {
            if (!zoomSelector.rendered) {
            zoomSelector.clearValue();}
        }
    });



return [App.toolbarItems,App.actions,zoomSelector];

} //// Aca termina Getcontroles


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//********** FUNCIONES PARA LOS ATAJOS*******************************

function getDeptos(which)
{
  var n = which.value;
 document.getElementById('departamentos').length = 0;
 document.getElementById('localidades').length = 0;

 OpenLayers.loadURL('/librerias/ajax/getdeptos.php?cod='+n, '', this, resp_getdeptos);
}/////////////////////////


function getLocs(wich){

 var n = wich.value;
 document.getElementById('localidades').length = 0;
 OpenLayers.loadURL('/librerias/ajax/getlocs.php?cod='+n, '', this, resp_getlocs);

}//////////////////////////////

function resp_getdeptos(response) {
var json_depto = new OpenLayers.Format.JSON();
var datos = json_depto.read(response.responseText);
deptos = document.getElementById('departamentos');
opcion=document.createElement("option");
opcion.innerHTML="Seleccionar un Departamento";
deptos.appendChild(opcion);
for (var i=0;i<datos.length ;i++ )
{
opcion=document.createElement("option");
opcion.value=datos[i].cod_depto;
opcion.innerHTML =datos[i].nom_depto;
deptos.appendChild(opcion);
}

showdiv('atajosTildeProv');
hidediv('atajosTildeDept');
hidediv('atajosTildeLoc');
}///////////////////////////////

function resp_getlocs(response) {
var json_locs = new OpenLayers.Format.JSON();
var datos = json_locs.read(response.responseText);
locs = document.getElementById('localidades');
opcion=document.createElement("option");
opcion.innerHTML ="Seleccionar una Localidad";
locs.appendChild(opcion);
for (var i=0;i<datos.length ;i++ )
{
opcion=document.createElement("option");
opcion.value=datos[i].cod_loc;
opcion.innerHTML =datos[i].nom_loc;
locs.appendChild(opcion);
}
showdiv('atajosTildeDept');
hidediv('atajosTildeLoc');
}

function resp_getloc_center(response)
{
var rsp= response.responseText;
var rsp_array=rsp.split(',');

var lonlat= new OpenLayers.LonLat(rsp_array[0],rsp_array[1])
showdiv('atajosTildeLoc');
App.map.setCenter(lonlat,7);
}

function verLoc(wich){
 var n = wich.value;
 OpenLayers.loadURL('/librerias/ajax/getloc_center.php?cod='+n, '', this, resp_getloc_center);

}



function hidediv(id) {
if (document.getElementById) { // DOM3 = IE5, NS6
document.getElementById(id).style.visibility = 'hidden';
}
else {
if (document.layers) { // Netscape 4
document.hideShow.visibility = 'hidden';
}
else { // IE 4
document.all.hideShow.style.visibility = 'hidden';
}
}
}

function showdiv(id) {
if (document.getElementById) { // DOM3 = IE5, NS6
document.getElementById(id).style.visibility = 'visible';
}
else {
if (document.layers) { // Netscape 4
document.hideShow.visibility = 'visible';
}
else { // IE 4
document.all.hideShow.style.visibility = 'visible';
}
}
}

function zoomProv(valor){
    OpenLayers.loadURL('/librerias/ajax/zoomto.php?tipo=prov&cod='+valor, '', this, resp_zoomto);
}

function zoomDepto(valor){
    OpenLayers.loadURL('/librerias/ajax/zoomto.php?tipo=depto&cod='+valor, '', this, resp_zoomto);
}

function zoomLoc(valor){
    showdiv('atajosTildeLoc');
    OpenLayers.loadURL('/librerias/ajax/zoomto.php?tipo=loc&cod='+valor, '', this, resp_zoomto);
}

function resp_zoomto(response)
{
var rsp= response.responseText;
var rsp_array=rsp.split(',');
var zoom =rsp_array[2];
var lonlat= new OpenLayers.LonLat(rsp_array[0],rsp_array[1])

if (App.map.baseLayer.CLASS_NAME =="OpenLayers.Layer.Google"){
    // si es una capa de google le sumo 5 al zoom porque tienen muchas mas escalas
    zoom=parseFloat(zoom) + 0;
   }

App.map.setCenter(lonlat,zoom);
}
