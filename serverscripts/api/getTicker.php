<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf8mb4');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getTicker($dbname, $dbuser, $dbpass, $dbhost);
    
    function getTicker($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $con->set_charset("utf8mb4");

        $sql = "SELECT * FROM Ticker order by tickerId ASC";
        $q = mysqli_query($con, $sql);
        
        $tickerItems = array();

        while ($res = mysqli_fetch_array($q))
        {
            array_push($tickerItems,array(
                'tickerItem'=> mb_convert_encoding($res["tickerItem"], 'UTF8')));
        }

        // Close connection
        mysqli_close ($con);
        
        $json = json_encode($tickerItems);

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
