<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf8mb4');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getPappfans($dbname, $dbuser, $dbpass, $dbhost);
    
    function getPappfans($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $con->set_charset("utf8mb4");
        
        $sql = "SELECT * FROM Pappfan ORDER BY id asc";
        $q = mysqli_query($con, $sql);
        
        $pappfans = array();
        
        while ($res = mysqli_fetch_array($q))
        {
            array_push($pappfans, array(
                'id'=> mb_convert_encoding($res["id"], 'UTF8'),
                'name'=> mb_convert_encoding($res["name"], 'UTF8'),
                'imagePath'=> mb_convert_encoding($res["imagePath"], 'UTF8')));
        }

        // Close connection
        mysqli_close ($con);
        
        $json = json_encode($pappfans, JSON_UNESCAPED_UNICODE);

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
