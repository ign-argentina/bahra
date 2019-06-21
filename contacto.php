<?php
session_start();
   ini_set( 'display_errors', 1 );
    error_reporting( E_ALL );
function enviar($texto,$sNombre,$mail_to,$reply){
    $texto = "Mensaje enviado a traves del sitio www.bahra.gob.ar.\r\n".$texto;
    $headers .= 'Content-type: text/plain; charset=UTF-8' . "\r\n";
//    $envio_mail = mail($mail_to,"Sitio BAHRA",$texto,"From: BAHRA <contacto@bahra.gob.ar>\r\nCc:lvaccari@gmail.com,  ilureck@gmail.com, gacke@indec.mecon.gov.ar\r\nBcc:  manuel.retamozo@gmail.com\r\n Reply-to: ".$reply."\r\n".$headers);
    $envio_mail = mail($mail_to,"Sitio BAHRA",$texto,"From: BAHRA <contacto@bahra.gob.ar>\r\nCc:mretamozo@mapaeducativo.edu.ar\r\nBcc:  manuel.retamozo@gmail.com\r\n Reply-to: ".$reply."\r\n".$headers);

    if($envio_mail){
        error_log("Enviado mail contacto BAHRA de $sNombre \n");
        $respuesta="Se le ha enviado un mail al administrador.";
        return true;
    }else{
	error_log($envio_mail);
var_dump($envio_mail);
die();
        $respuesta="ERROR: $sNombre";
        return false;
    }
}
/*
 * Formulario de COntacto BAHRA
 */
	if (isset($_REQUEST["enviar"])){
		if (sha1(strtoupper($_REQUEST['captcha']))!=$_SESSION['CAPTCHA_CODE']){
				$mensaje="Error: El codigo de seguridad ingresado no es correcto.Intente nuevamente.";
		}else{
	//mylog(" - Se reciben datos\n"); 
    $sNombre= $_REQUEST['nombre_usuario']." ".$_REQUEST['apellido_usuario'];
    $sEmail=$_REQUEST['email_usuario'];
    $datos_usuario=
//					"Usuario: ".$_REQUEST['nombre_usuario']."\r\n".
					"Nombre: ".$_REQUEST['nombre_usuario']." \r\n".
					"Apellido: ".$_REQUEST['apellido_usuario']."\r\n".
					"Provincia: ".$_REQUEST['provincia_usuario']."\r\n".
					"Localidad: ".$_REQUEST['localidad_usuario']." \r\n".
					"Institución: ".$_REQUEST['institucion_usuario']."\r\n".
					"Que Institución: ".$_REQUEST['que_institucion_usuario']."\r\n".
					"Telefono:".$_REQUEST['telefono_usuario']."\r\n".
					"Celular:".$_REQUEST['celular_usuario']."\r\n".
					"E-Mail: ".$_REQUEST['email_usuario']."\r\n";

    $mensaje_usuario=
                "Mensaje: ".$_REQUEST['motivo_usuario']."\r\n";
    
	    $texto_mail="Mensaje recibido de : \r\n".$datos_usuario."\r\n Envía el siguiente mensaje desde el sitio BAHRA: \r\n".$mensaje_usuario;

// LOG MENSAJES
        error_log("\r\n ".date('Y-m-d H:i')." $sEmail : ".$texto_mail,3,"contactos.log");

//    if(enviar($texo_mail,$sNombre,'sticotti@me.gov.ar,dsticotti@gmail.com',$sEmail)){
    if(enviar($texto_mail,$sNombre,'manuel.retamozo@gmail.com',$sEmail)){
        $mensaje="La solicitud fue enviada correctamente";
    }else{
        $mensaje="Se produjo un error al enviar la solicitud. Por favor reintentelo mas tarde.";
    }
//---------------------------------------------------------------
		//mylog("ok\n");
}
//ALERT MENSAJE Y BACK O RETORNAR AL INICIO		
?>
<script>
alert('<?php echo $mensaje ?>');
window.history.go(-1);
</script>
<?php
	}

?>
