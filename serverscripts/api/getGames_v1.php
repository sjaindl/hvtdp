<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getGames($dbname, $dbuser, $dbpass, $dbhost);
    
    function getGames($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $season = $_GET['season'];

        $sql = "select json_object(
                'round', g.round,
                'description', g.description,
                'date', g.date,
                'links', (select CAST(CONCAT('[',
                            GROUP_CONCAT(
                                JSON_OBJECT(
                                'link', l.link,
                                'description', l.description,
                                'scorer', l.scorer)),
                            ']')
                    AS JSON) from Link l where gameId = g.gameId)
            ) from Game g where g.season = '$season'";

        $q = mysqli_query($con, $sql);
        
        $games = array();
        
        while ($res = mysqli_fetch_array($q))
        {
            array_push($games, array(
                'round'=> utf8_encode($res["round"]),
                'description'=> utf8_encode($res["description"]),
                'date'=> utf8_encode($res["date"]),
                'link'=> utf8_encode($res["link"]),
                'scorer'=> utf8_encode($res["scorer"])));
        }
        
        // Close connection
        mysqli_close ($con);

        // print_r($games);
        
        $json = json_encode($games);

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


