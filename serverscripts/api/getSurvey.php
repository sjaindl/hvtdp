<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getSurvey($dbname, $dbuser, $dbpass, $dbhost);

    function getSurvey($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);
        mysqli_set_charset($con, "utf8mb4");

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $sql = "SELECT * FROM Survey";
        $q = mysqli_query($con, $sql);

        $surveys = array();

        while ($res = mysqli_fetch_array($q))
        {
            array_push($surveys, array(
                'id'=> utf8_encode($res["id"]),
                'link'=> utf8_encode($res["link"])
              ));
        }

        // Close connection
        mysqli_close ($con);

        $json = json_encode($surveys);

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
