<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getMatchInfo($dbname, $dbuser, $dbpass, $dbhost);

    function getMatchInfo($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);
        mysqli_set_charset($con, "utf8mb4");

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $con->set_charset("utf8mb4");

        $sql = "SELECT * FROM MatchInfo ORDER BY id ASC";
        $q = mysqli_query($con, $sql);

        $matches = array();

        while ($res = mysqli_fetch_array($q))
        {
            array_push($matches, array(
                'id'=> $res["id"],
                'season'=> $res["season"],
                'matchInfo'=> $res["matchInfo"],
                'dateTime'=> $res["dateTime"],
                'venue'=> $res["venue"],
                'homeTeam'=> $res["homeTeam"],
                'awayTeam'=> $res["awayTeam"],
                'homeScore'=> $res["homeScore"],
                'awayScore'=> $res["awayScore"],
                'additionalInfo'=> $res["additionalInfo"]
            ));
        }

        // Close connection
        mysqli_close ($con);

        $json = json_encode($matches, JSON_UNESCAPED_UNICODE);

        if ($json === false) {
            $json = json_encode(array("jsonError", json_last_error_msg()));
            if ($json === false) {
                $json = '{"jsonError": "unknown"}';
            }
            http_response_code(500);
        }

        echo $json;
    }
?>
