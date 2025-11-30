<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf8mb4');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getVisitCount($dbname, $dbuser, $dbpass, $dbhost);

    function getVisitCount($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);
        mysqli_set_charset($con, "utf8mb4");

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $con->set_charset("utf8mb4");

        $sql = "SELECT visitorCounter FROM Statistics";
        $q = mysqli_query($con, $sql);

        $visitorCount = 0;

        while ($res = mysqli_fetch_array($q))
        {
            $visitorCount = $res["visitorCounter"];
        }

        // Increase visitor count
        $sql = "UPDATE `Statistics` SET `visitorCounter` = $visitorCount + 1 WHERE `Statistics`.`id` = 1;";

        if ($con->query($sql) === FALSE) {
            echo "Error updating record: " . $con->error;
        }

        // Close connection
        mysqli_close ($con);

        $json = json_encode($visitorCount);

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
