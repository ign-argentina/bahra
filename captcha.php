<?php
session_start();

// Genero el codigo y lo guardo en la sesion para consultarlo luego.
$captchaCode = strtoupper(substr(sha1(microtime() * mktime()), 0, 6));
$_SESSION['CAPTCHA_CODE'] = sha1($captchaCode);

// Genero la imagen
$width = 70;
$height = 20; 

$img = imagecreatetruecolor($width, $height );

// Colores
$bgColor = imagecolorallocate($img, 230, 230, 230);
$stringColor = imagecolorallocate($img, 90, 90, 90);
$lineColor = imagecolorallocate($img, 245, 245, 245);
 
// Fondo
imagefill($img, 0, 0, $bgColor);
imagerectangle($img,0,0,$width-1,$height-1,$grey); 
imageline($img, 0, $height/2, $width, $height/2, $grey); 
imageline($img, $width/2, 0, $width/2, $height, $grey); 
// Escribo el codigo

//imagettftext($img,10,10,22, 12, $black, '../mapas/fuentes/verdana.ttf', 'fds');
  
imageline($img, 0, 5, 70, 5, $lineColor);
imageline($img, 0, 10, 70, 10, $lineColor);
imageline($img, 0, 15, 70, 15, $lineColor);
imageline($img, 0, 20, 70, 20, $lineColor);
imageline($img, 12, 0, 12, 25, $lineColor);
imageline($img, 24, 0, 24, 25, $lineColor);
imageline($img, 36, 0, 36, 25, $lineColor);
imageline($img, 48, 0, 48, 25, $lineColor);
imageline($img, 60, 0, 60, 25, $lineColor);

/*
//dibujamos los caracteres de color blanco
imagechar($img, 4, 20, 13, $captchaCode[0] ,$white);
imagechar($img, 5, 40, 13, $captchaCode[1] ,$white);
imagechar($img, 3, 60, 13, $captchaCode[2] ,$white);
imagechar($img, 4, 80, 13, $captchaCode[3] ,$white);
imagechar($img, 5, 100, 13, $captchaCode[4] ,$white);
imagechar($img, 3, 120, 13, $captchaCode[5] ,$white);
*/
//Throw in some lines to make it a little bit harder for any bots to break 


imagestring($img, 5, 8, 5, $captchaCode, $stringColor);


// Image output.
header("Content-type: image/png");
header("Cache-Control: no-cache");
imagepng($img);


?>