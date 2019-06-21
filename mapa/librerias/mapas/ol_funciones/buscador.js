
var nomloc= null;
var nomesc= null;
var tree=null;

Ajax.Autocompleter.prototype.onComplete = function(request) {
	var aux = '<ul>';
	var items = unescapeHTML(request.responseText).split('||');
	for(var i=0;i<items.length;i++) {
		if (items[i]) {
			var x = items[i].split('::');
			aux+="<li id='"+x[0]+"'>"+x[1];
			if (x.length > 2) {
			aux+='<span class="informal" codloc="'+x[2]+'" nomloc="'+x[3]+'"><br />'+x[3]+' - '+x[4]+' - '+x[5]+'</span>';
			}
			aux+="</li>";
		}
	}
	aux+= "</ul>";
	this.updateChoices(aux);
}


function cambioProvincia(cod) {
	Element.hide('imgTildeEsc');
	$('cueanexo').value = null;
	nomesc = null;
	//Element.show('buttonSubmit');
	Element.hide('buttonVerMapa');

	App.aValores.length= 0;
	if ($('input_nom_loc').value != '') {
		$('input_nom_loc').value = '';
		limpiarLocalidades();
	}
	if (cod=='x') Element.hide('imgTildeProv');
	else Element.show('imgTildeProv');
	Element.show('imgIndicProv');
	new Ajax.Request('/librerias/ajax/buscaescuela/buscar_escuela.php?f=prov&cod_prov=' + cod ,
        {onSuccess: actualizarLocalidades} );
}

function actualizarLocalidades(response) {
	if (response.responseText.length > 10) {
		/// decodifico los caracteres HTML Ej: &aacute; => á
		var items = response.responseText.unescapeHTML().split('||');
		App.aValores.length=0;
		for (var i=0; i<items.length; i++) {
			var node = items[i].split('::');
			App.aValores.push(node[1] + '<span class="informal" codloc="'+node[0]+'">&nbsp; Depto: '+node[2]+'</span>');
		}
		if (items[0].substr(0,2) == '02') {
			node = items[0].split('::');
			nomloc = node[1];//'CAPITAL FEDERAL';
			$('input_nom_loc').value = node[1];//'CAPITAL FEDERAL';
			$('cod_loc').value = node[0];//'020%';
			new Ajax.Request('/librerias/ajax/buscaescuela/buscar_escuela.php?f=loc&cod_loc=' + node[0],{ onSuccess: function () {Element.hide('imgIndicLoc')}});
			$('input_nom_loc').onkeyup = function () {if (nomloc!=this.value && $F('cod_loc')) {limpiarLocalidades()}};
			Element.show('imgTildeLoc');
//			aValores.push('CAPITAL FEDERAL'+'<span class="informal" codloc="020%">&nbsp;</span>');
		}
	}
	Element.hide('imgIndicProv');
}

function unescapeHTML(str) {
	var aux_div = document.createElement('div');
	aux_div.innerHTML = str;
  return aux_div.childNodes[0] ? aux_div.childNodes[0].nodeValue : '';
}

function actualizarLocalidad(input,li) {
	Element.hide('imgTildeEsc');
	Element.show('imgIndicLoc');

	$('cueanexo').value = null;
	nomesc = null;
	//Element.show('buttonSubmit');
	//Element.hide('buttonVerMapa');

	var codloc = li.lastChild.getAttribute('codloc');
	$('cod_loc').value = codloc;
	nomloc = input.value;
//	alert("Código de Localidad Seleccionado: " + codloc);
	new Ajax.Request('/librerias/ajax/buscaescuela/buscar_escuela.php?f=loc&cod_loc=' + codloc,{ onSuccess: function () {Element.hide('imgIndicLoc')}});
	$('input_nom_loc').onkeyup = function () {if (nomloc!=this.value && $F('cod_loc')) {limpiarLocalidades()}};
	Element.show('imgTildeLoc');
}

function limpiarLocalidades() {
	Element.hide('imgTildeLoc');
	Element.hide('imgTildeEsc');
	$('input_nom_loc').onkeyup = null;
	$('input_nom_escuela').value = '';
	$('cod_loc').value = null;
	nomloc = null;
	new Ajax.Request('/librerias/ajax/buscaescuela/buscar_escuela.php?f=loc&cod_loc=',{ onSuccess: function () {Element.hide('imgIndicLoc')}});
}

function actualizarEscuela(input,li) {
	Element.show('imgTildeEsc');
	if (!nomloc) {
		var codloc = li.lastChild.getAttribute('codloc');
		nomloc = li.lastChild.getAttribute('nomloc');
		$('input_nom_loc').value = li.lastChild.getAttribute('nomloc');
		$('cod_loc').value = codloc;
		new Ajax.Request('/librerias/ajax/buscaescuela/buscar_escuela.php?f=loc&cod_loc=' + codloc,{ onSuccess: function () {Element.hide('imgIndicLoc')}});
		$('input_nom_loc').onkeyup = function () {if (nomloc!=this.value && $F('cod_loc')) {limpiarLocalidades()}};
		Element.show('imgTildeLoc');
	}
	$('cueanexo').value = li.id;
	nomesc = input.value;
	//Element.hide('buttonSubmit');
	Element.show('buttonVerMapa');
}

function limpiarEscuela() {
	Element.hide('imgTildeEsc');
	$('cueanexo').value = null;
	nomesc = null;
	//Element.show('buttonSubmit');
	Element.hide('buttonVerMapa');
}

function enviar() {

var cod_prov= document.getElementById('cod_prov');
var cod_loc= document.getElementById('cod_loc');
var nom_loc= document.getElementById('input_nom_loc');
var nom_escuela= document.getElementById('input_nom_escuela');
var form_cue= document.getElementById('cueanexo');
App.cue=form_cue.value;
OpenLayers.loadURL('/librerias/ajax/zoomtocue.php?cueanexo='+App.cue,'',this,zoomtocue//de la respuesta

);
}



function buscar_x_cue() {
	Element.hide('tablaBusqueda');
	Element.show('tablaCUE');
}

function buscar_x_nombre() {
	Element.hide('tablaCUE');
	Element.show('tablaBusqueda');
}


function validar_cue() {
	var input = $('cueanexo');
	if (input.value) {
		if (input.value.length == 7) {
			input.value += '00';
		}
		if (input.value.length == 9) return true;
	}
	alert('El CUE ingresado no es válido');
	return false;
}

  function place(lat,lng) {

    point = new OpenLayers.Geometry.Point(lng,lat).transform(new OpenLayers.Projection('EPSG:4326'), new OpenLayers.Projection('EPSG:900913'));

    feature = new OpenLayers.Feature.Vector(point);

select.destroyFeatures();
select.setVisibility(true);
select.addFeatures(feature);
map.zoomToExtent(select.getDataExtent());
document.getElementById("resultados").innerHTML = "<div>Resultados:</div>";


      }


   function showAddress() {
        geo = new GClientGeocoder();
        var search = document.getElementById("query").value;
        // ====== Perform the Geocoding ======
        geo.getLocations(search, function (result)
          {

            if (result.Status.code == G_GEO_SUCCESS) {
              // ===== Si hay resultados los agrego dentro del div resultados =====
              if (result.Placemark.length > 0) {
                document.getElementById("resultados").innerHTML = "<div>Resultados:</div>";
                // recorro los resultados

                for (var i=0; i<result.Placemark.length; i++) {

                     var p = result.Placemark[i].Point.coordinates;
                    document.getElementById("resultados").innerHTML += "<div ><a href='javascript:place(" +p[1]+","+p[0]+")'>"+ result.Placemark[i].address+"<\/a></div>";
                }
              }

            }
            // ====== Decode the error status ======
            else {
              var reason="Code "+result.Status.code;
              if (razones[result.Status.code]) {
                reason = razones[result.Status.code]
               }
              alert('Could not find "'+search+ '" ' + reason);
            }
          }
        );
     }

