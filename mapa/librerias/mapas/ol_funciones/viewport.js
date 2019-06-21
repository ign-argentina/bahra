function cargarViewport(){
(App.fondo)? App.fondo=App.fondo : App.fondo="background-color:#d8f3f9";

var cont=getControles();
var toolbarItems=cont[0];

var zoomSelector=cont[2];

crearArbol();

var itemsHerramientas=[];
var itemsInformacion=[];

var east=document.getElementById('informacion');
itemsInformacion.push(App.tree);
for (var i in east.children){
    var tmp=east.children[i];
    
    if ((tmp.innerHTML)&&( tmp.id !="" && tmp.innerHTML.length > 10)){
      var obj_tmp={title:tmp.id,
             contentEl: tmp.id,
	     width: 200,
             split: true,
             autoScroll: true
	    };
      itemsInformacion.push(obj_tmp);
    }
}

var west=document.getElementById('herramientas');
for (var x in west.children){
     tmp=west.children[x];

    if ((tmp.innerHTML)&&( tmp.id !="" && tmp.innerHTML.length > 10)){         
         obj_tmp={title:tmp.id,
             contentEl: tmp.id,
	     border:true
	    };
      itemsHerramientas.push(obj_tmp);
    }
}



App.viewport = new Ext.Viewport({
            layout:'border',
            items:[
                new Ext.BoxComponent({ // raw
                    region:'north',
                    el: 'north',
                    height:41
                }),
		   {
                    region:'west',
                    id:'west-panel',
                    title:'Herramientas',
                    split:true,
                    width: 300,
                    minSize: 175,
                    maxSize: 400,
                    collapsible: true,
		    collapsed:true,
                    margins:'0 0 0 5',
                    layout:'accordion',
                    layoutConfig:{
                    animate:true
                    },
                    items:itemsHerramientas
                        
                },{
		    region:'center',
		    title: App.titulo,
                    layout: 'fit',
                    xtype: 'gx_mappanel',
                    map: App.map,
                    bodyStyle: App.fondo,
                    tbar: toolbarItems,
		    bbar: [zoomSelector]
                },{
                    region:'east',
                    id:'east-panel',
                    title:'Informacion',
                    split:true,
                    width: 280,
                    minSize: 175,
                    maxSize: 400,
                    collapsible: true,
                    margins:'0 0 0 5',
                    layout:'accordion',
                    layoutConfig:{
                    animate:true
                    },
                    items:itemsInformacion
                }
             ]
        });
new Autocompleter.Local('input_nom_loc', 'div_autoc_nomloc', App.aValores,
{afterUpdateElement: actualizarLocalidad});

new Ajax.Autocompleter('input_nom_escuela', 'div_autoc_nomescuela', '/mapserver/librerias/ajax/buscaescuela/buscar_escuela.php',
{paramName: 'nom_escuela',
 parameters: 'f=esc',
 minChars: 1,
 frequency: 0.5,
 indicator: 'imgIndicEsc',
 afterUpdateElement: actualizarEscuela});

cargarTemplatesFids();

}

