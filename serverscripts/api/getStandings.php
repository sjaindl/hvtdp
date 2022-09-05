<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getStandings($dbname, $dbuser, $dbpass, $dbhost);
    
    function getStandings($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $sql = "SELECT * FROM Standings order by place ASC";
        $q = mysqli_query($con, $sql);
        
        $standings = array();
        
        while ($res = mysqli_fetch_array($q))
        {
            array_push($standings, array(
                'place'=> $res["place"],
                'team'=> $res["team"],
                'games'=> $res["games"],
                'wins'=> $res["wins"],
                'draws'=> $res["draws"],
                'losses'=> $res["losses"],
                'goalDifference'=> $res["goalDifference"],
                'points'=> $res["points"],
                'season'=> $res["season"]
            ));
        }

        // Close connection
        mysqli_close ($con);
        
        $json = json_encode($standings, JSON_UNESCAPED_UNICODE);

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
