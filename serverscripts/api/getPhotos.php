<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf8mb4');
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

        $llm = filter_var($_GET['llm'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $con->set_charset("utf8mb4");

        $fetchSeasons = mysqli_query($con, "SELECT * FROM AlbumSeason order by season DESC") or die(mysqli_error($con));

        $albums_array = array();

        while ($row_seasons = mysqli_fetch_assoc($fetchSeasons)) {
            $season = $row_seasons['season'];

            $fetch_albums = mysqli_query($con, "SELECT name, date, albumId
                FROM Album a where a.season = '$season' order by date DESC") or die(mysqli_error($con));

            $albumId = 0;

            $album_array = array();

            while ($row_album = mysqli_fetch_assoc($fetch_albums)) {
                $albumId = $row_album['albumId'];

                $album_array['season'] = mb_convert_encoding($season, 'UTF8');
                $album_array['name'] = mb_convert_encoding($row_album["name"], 'UTF8');
                $album_array['date'] = mb_convert_encoding($row_album["date"], 'UTF8');
                if (!$llm) {
                  $album_array['albumId'] = mb_convert_encoding($albumId, 'UTF8');

                  $album_array['photos'] = array();

                  $fetch_photos = mysqli_query($con, "SELECT description, imagePath
                      FROM Photo p where p.albumId = '$albumId' order by description ASC") or die(mysqli_error($con));

                  $photo_array = array();

                  while ($row_photos = mysqli_fetch_assoc($fetch_photos)) {
                      $photo_array['description'] = mb_convert_encoding($row_photos['description'], 'UTF8');
                      $photo_array['imagePath'] = mb_convert_encoding($row_photos['imagePath'], 'UTF8');

                      array_push($album_array['photos'], $photo_array);
                  }
                }

                array_push($albums_array, $album_array);
            }
        }

         // Close connection
         mysqli_close ($con);

        //print_r($seasons_array);
        $json = json_encode($albums_array, JSON_UNESCAPED_UNICODE);

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
