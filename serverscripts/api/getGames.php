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

        $seasons_array = array();

        $fetchSeasons = mysqli_query($con, "SELECT * FROM GameSeason order by season DESC") or die(mysqli_error($con));
        
        while ($row_seasons = mysqli_fetch_assoc($fetchSeasons)) {
            $season = utf8_encode($row_seasons['season']);

            $season_array = array();
            $season_array['season'] = $season;
            $season_array['games'] = array();

            $fetch_games = mysqli_query($con, "SELECT round, description, date, gameId
                FROM Game g where g.season = '$season' order by date DESC") or die(mysqli_error($con));

            $gameId = 0;
            
            $game_array = array();

            while ($row_games = mysqli_fetch_assoc($fetch_games)) {
                $gameId = utf8_encode($row_games['gameId']);

                $game_array['round'] = utf8_encode($row_games['round']);
                $game_array['description'] = utf8_encode($row_games['description']);
                $game_array['date'] = utf8_encode($row_games['date']);
                $game_array['gameId'] = $gameId;
                $game_array['links'] = array();
                
                $fetch_links = mysqli_query($con, "SELECT link, description, scorer
                    FROM Link l where l.gameId = '$gameId' order by description ASC") or die(mysqli_error($con));

                $link_array = array();
                
                while ($row_links = mysqli_fetch_assoc($fetch_links)) {
                    $link_array['link'] = utf8_encode($row_links['link']);
                    $link_array['description'] = utf8_encode($row_links['description']);
                    $link_array['scorer'] = utf8_encode($row_links['scorer']);

                    array_push($game_array['links'], $link_array);
                }

                array_push($season_array['games'], $game_array);
            }
            
            array_push($seasons_array, $season_array);
        }

         // Close connection
         mysqli_close ($con);

        //print_r($seasons_array);
        $json = json_encode($seasons_array, JSON_PRETTY_PRINT);

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


