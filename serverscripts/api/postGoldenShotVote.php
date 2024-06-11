<?php require 'constants.php';

    header('Content-Type: text/plain; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST");

    postGoldenshotVote($dbname, $dbuser, $dbpass, $dbhost);

    function postGoldenshotVote($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $id = $_GET['id'];

        $sql = "UPDATE `Goldenshot` SET `votes` = `votes` + 1 WHERE `Goldenshot`.`id` = $id;";

        if ($con->query($sql) === TRUE) {
            echo '{"result": "Updated record successfully!"}';
        } else {
            echo '{"Error": "' . $con->error . '"';
        }

        // Close connection
        mysqli_close ($con);
    }
?>
