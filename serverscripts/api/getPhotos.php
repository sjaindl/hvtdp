<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getPhotos($dbname, $dbuser, $dbpass, $dbhost);
    
    function getPhotos($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $seasons_array = array();

        $fetchSeasons = mysqli_query($con, "SELECT * FROM AlbumSeason order by season DESC") or die(mysqli_error($con));
        
        while ($row_seasons = mysqli_fetch_assoc($fetchSeasons)) {
            $season = utf8_encode($row_seasons['season']);

            $season_array = array();
            $season_array['season'] = $season;
            $season_array['albums'] = array();

            $fetch_albums = mysqli_query($con, "SELECT name, date, albumId
                FROM Album a where a.season = '$season' order by date DESC") or die(mysqli_error($con));

            $albumId = 0;
            
            $album_array = array();

            while ($row_album = mysqli_fetch_assoc($fetch_albums)) {
                $albumId = utf8_encode($row_album['albumId']);

                $album_array['name'] = utf8_encode($row_album['name']);
                $album_array['date'] = utf8_encode($row_album['date']);
                $album_array['albumId'] = $albumId;
                $album_array['photos'] = array();
                
                $fetch_photos = mysqli_query($con, "SELECT description, imagePath
                    FROM Photo p where p.albumId = '$albumId' order by description ASC") or die(mysqli_error($con));

                $photo_array = array();
                
                while ($row_photos = mysqli_fetch_assoc($fetch_photos)) {
                    $photo_array['description'] = utf8_encode($row_photos['description']);
                    $photo_array['imagePath'] = utf8_encode($row_photos['imagePath']);

                    array_push($album_array['photos'], $photo_array);
                }

                array_push($season_array['albums'], $album_array);
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


