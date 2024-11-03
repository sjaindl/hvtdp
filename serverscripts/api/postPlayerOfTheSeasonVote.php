<?php require 'constants.php';

    header('Content-Type: text/plain; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST");

    postPlayerOfTheSeasonVote($dbname, $dbuser, $dbpass, $dbhost);

    function postPlayerOfTheSeasonVote($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $season = $_GET['season'];
        $player = $_GET['player'];

        $sql = "UPDATE `PlayerOfTheSeason` SET `votes` = `votes` + 1 WHERE `season` = '$season' AND `player` = '$player';";

        if ($con->query($sql) === TRUE) {
            echo '{"result": "Updated record successfully!"}';
        } else {
            echo '{"Error": "' . $con->error . '"';
        }

        // Close connection
        mysqli_close ($con);
    }
?>
