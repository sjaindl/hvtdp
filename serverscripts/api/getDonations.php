<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf8mb4');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getDonations($dbname, $dbuser, $dbpass, $dbhost);

    function getDonations($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $llm = filter_var($_GET['llm'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $con->set_charset("utf8mb4");

        $sql = "SELECT * FROM Donation ORDER BY date desc";
        $q = mysqli_query($con, $sql);

        $donations = array();

        while ($res = mysqli_fetch_array($q))
        {
            $array = array(
                'donator'=> mb_convert_encoding($res["donator"], 'UTF8'),
                'date'=> mb_convert_encoding($res["date"], 'UTF8'),
                'game'=> mb_convert_encoding($res["game"], 'UTF8')
            );

            if (!$llm) {
                $array['description'] = mb_convert_encoding($res["description"], 'UTF8');
                $array['imagePath'] = mb_convert_encoding($res["imagePath"], 'UTF8');
                $array['matchBallImagePath'] = mb_convert_encoding($res["matchBallImagePath"], 'UTF8');
            }

            array_push($donations, $array);
        }

        // Close connection
        mysqli_close ($con);

        $json = json_encode($donations, JSON_UNESCAPED_UNICODE);

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
