<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf8mb4');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getGoldenshot($dbname, $dbuser, $dbpass, $dbhost);

    function getGoldenshot($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $con->set_charset("utf8mb4");

        $sql = "SELECT id, firstName, lastName, email, phone, photo, votes FROM Goldenshot";
        $q = mysqli_query($con, $sql);

        $goldenshot_array = array();

        while ($res = mysqli_fetch_assoc($q)) {
          array_push($goldenshot_array,array(
            'id'=> $res["id"],
            'firstName'=> $res["firstName"],
            'lastName'=> $res["lastName"],
            'email'=> $res["email"],
            'phone'=> $res["phone"],
            'photo'=> $res["photo"],
            'votes'=> $res["votes"]));
        }

        // Close connection
        mysqli_close ($con);

        $json = json_encode($goldenshot_array, JSON_UNESCAPED_UNICODE);

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
