<?php
header('Content-Type: */*; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$target_dir = $_SERVER['DOCUMENT_ROOT'] . "/assets/images/goldenshot/";

$target_file = $target_dir . basename($_FILES["file"]["name"]);

echo "target_file: " . $target_file . "\r\n";

$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION)) . "\r\n";;

echo "imageFileType: " . $imageFileType;

// Check if image file is a actual image or fake image
// if(isset($_POST["submit"])) {
//   $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
//   if($check !== false) {
//     echo "File is an image - " . $check["mime"] . ".";
//     $uploadOk = 1;
//   } else {
//     echo "File is not an image.";
//     $uploadOk = 0;
//   }
// }

// Check if file already exists
// if (file_exists($target_file)) {
//   echo "Sorry, file already exists.";
//   $uploadOk = 0;
// }

// Check file size
// if ($_FILES["fileToUpload"]["size"] > 500000) {
//   echo "Sorry, your file is too large.";
//   $uploadOk = 0;
// }


// Allow certain file formats
// if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
// && $imageFileType != "gif" ) {
//   echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
//   $uploadOk = 0;
// }

// Check if $uploadOk is set to 0 by an error

if ($uploadOk == 0) {
  echo "Sorry, your file was not uploaded." . "\r\n";;
  // echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
  if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    $resp = "The file ". htmlspecialchars( basename( $_FILES["file"]["tmp_name"])). " has been uploaded." . " to " . $target_file . "!\r\n";;
    echo $resp;
  } else {
    $resp = "Not uploaded because of error ".$_FILES["file"]["error"]  . "\r\n";
    echo $resp;

    echo "isdir: " . is_dir($target_dir). "\r\n";
    echo "is_writable: " . is_writable($target_dir). "\r\n";

    echo " from " . $_FILES["file"]["tmp_name"] . " to " . $target_file  . "\r\n";
  }
}

?>
