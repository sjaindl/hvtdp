<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    checkDocPasswordValid($dbname, $dbuser, $dbpass, $dbhost, $docpass);
    
    function checkDocPasswordValid($name, $user, $pass, $host, $docpass) {
        $validation = array();
        $pw = $_GET['password'];

        array_push($validation, array(
            'valid'=> $pw == $docpass));
        
        $json = json_encode($validation, JSON_UNESCAPED_UNICODE);

        if ($json === false) {
            // Avoid echo of empty string (which is invalid JSON), and
            // JSONify the error message instead:
            $json = json_encode(array("jsonError", json_last_error_msg()));
            if ($json === false) {
                // This should not happen, but we go all the way now:
                $json = '{"jsonError": "unknown"}';
            }
            // Set HTTP response status code to: 500 - Internal Server Error
            http_response_code(500);
        }

        echo $json;
    }
?>
