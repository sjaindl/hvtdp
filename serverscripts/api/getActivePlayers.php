<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getPlayers($dbname, $dbuser, $dbpass, $dbhost);

    function getPlayers($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);
        mysqli_set_charset($con, "utf8mb4");

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $llm = filter_var($_GET['llm'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $sql = "SELECT * FROM Player WHERE type = 'Aktiv'";
        $q = mysqli_query($con, $sql);

        $players = array();

        while ($res = mysqli_fetch_array($q))
        {
            $array = array(
                'position'=> $res["position"],
                'firstName'=> $res["firstName"],
                'lastName'=> $res["lastName"],
                'games'=> $res["games"],
                'goals'=> $res["goals"],
                'memberSinceYear'=> $res["memberSinceYear"]
            );

            if (!$llm) {
                $array['imagePath'] = $res["imagePath"];
            }

            array_push($players, $array);
        }

        // Close connection
        mysqli_close ($con);

        $json = json_encode($players, JSON_UNESCAPED_UNICODE);

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
