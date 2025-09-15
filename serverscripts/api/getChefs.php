<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getChefs($dbname, $dbuser, $dbpass, $dbhost);

    function getChefs($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $llm = filter_var($_GET['llm'] ?? false, FILTER_VALIDATE_BOOLEAN);

        $sql = "SELECT function,firstName,lastName,imagePath FROM Chef";
        $q = mysqli_query($con, $sql);

        $chefs = array();

        while ($res = mysqli_fetch_array($q))
        {
            $array = array(
                'function'=> $res["function"],
                'firstName'=> $res["firstName"],
                'lastName'=> $res["lastName"]
            );

            if (!$llm) {
                $array['imagePath'] = $res["imagePath"];
            }

            array_push($chefs, $array);
        }

        // Close connection
        mysqli_close ($con);

        $json = json_encode($chefs, JSON_UNESCAPED_UNICODE);

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
