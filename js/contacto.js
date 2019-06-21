function validarEmail(str){
// Validacion del correo
                var at="@"
                var dot="."
                var lat=str.indexOf(at)
                var lstr=str.length
                var ldot=str.indexOf(dot)
                if (str.indexOf(at)==-1){
                        alert("1.La dirección de E-Mail no resulta válida, por favor revísela")
                        return false;
                }
                if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
                        alert("2.La dirección de E-Mail no resulta válida, por favor revísela")
                        return false;
                }
                if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
                        alert("3.La dirección de E-Mail no resulta válida, por favor revísela")
                        return false;
                }
                if (str.indexOf(at,(lat+1))!=-1){
                        alert("4.La dirección de E-Mail no resulta válida, por favor revísela")
                        return false
                }
                if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
                        alert("5.La dirección de E-Mail no resulta válida, por favor revísela")
                        return false
                }
                if (str.indexOf(dot,(lat+2))==-1){
                        alert("6.La dirección de E-Mail no resulta válida, por favor revísela")
                        return false
                }
                if (str.indexOf(" ")!=-1){
                        alert("7.La dirección de E-Mail no resulta válida, por favor revísela")
                        return false
                }       
                return true;
}
		function enviar(){
			if (document.getElementById('nombre_usuario').value.length == 0){
				alert("Por favor ingrese su nombre");
				return ;
			}	
			if (document.getElementById('apellido_usuario').value.length == 0){
				alert("Por favor ingrese su apellido");
				return ;
			}			
			if (document.getElementById('institucion_usuario').value == 'xx'){
				alert("Por favor seleccione una Persona/Organismo/Institucion");
				return ;
			}			
			if (document.getElementById('institucion_usuario').value != 'Usuario Particular'){
				if (document.getElementById('que_institucion_usuario').value.length == 0){
					alert("Por favor ingrese a que parte de la organización/institucion seleccionada pertence");
					return ;
				}
			}
			if ((document.getElementById('telefono_usuario').value.length < 10) && (document.getElementById('celular_usuario').value.length < 10)){
				alert("Por favor ingrese un numero de telefono o de celular con su caracteristica.");
				return ;
			}
			if (document.getElementById('motivo_usuario').value.length < 6){
				alert("Por favor ingrese el motivo por el cual desea contactarse");
				return ;
			}
			if (document.getElementById('localidad_usuario').value.length < 2){
				alert("Por favor ingrese la LOCALIDAD para una mejor atención");
				return ;
			}
			if (validarEmail(document.getElementById('email_usuario').value))
				document.getElementById('form_contacto').submit();

		}
		function cancelar(){
			window.location='/';
		}
