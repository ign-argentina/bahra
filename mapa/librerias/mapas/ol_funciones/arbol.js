
function crearArbol(){
 var LayerNodeUI = Ext.extend(
        GeoExt.tree.LayerNodeUI, new GeoExt.tree.RadioButtonMixin()
    );

 

App.datosTree= [
   {nodeType: "gx_baselayercontainer",
    text:"Cartografia Base",
    expanded: true}
   
 ];
 
 for (var n in App.grupo){
 App.datosTree.push(App.grupo[n]);
 }

 App.treeConfig = new OpenLayers.Format.JSON().write(App.datosTree);
 App.tree = new Ext.tree.TreePanel({
        border: true,
        region: "east",
        id:'arbolito_capas',
        title: "Capas",
        width: 200,
        split: true,
        collapsible: true,
        collapseMode: "mini",
        autoScroll: true,
        loader: new Ext.tree.TreeLoader({
                applyLoader: false,
                uiProviders: {
                              "use_radio": LayerNodeUI
                             }
        }),
        root: {
               nodeType: "async",
               children: Ext.decode(App.treeConfig)
             },
        rootVisible: false,
        lines: false

    });
}
