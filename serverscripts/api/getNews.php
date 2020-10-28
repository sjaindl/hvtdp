<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf8mb4');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    getNews($dbname, $dbuser, $dbpass, $dbhost);
    
    function getNews($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $con->set_charset("utf8mb4");

        $sql = "SELECT * FROM News ORDER BY newsDate DESC";
        $q = mysqli_query($con, $sql);
        
        $news = array();
        
        while ($res = mysqli_fetch_array($q))
        {
            array_push($news, array(
                'newsId'=> mb_convert_encoding($res["newsId"], 'UTF8'),
                'newsDate'=> mb_convert_encoding($res["newsDate"], 'UTF8'),
                'title'=> mb_convert_encoding($res["title"], 'UTF8'),
                'news'=> mb_convert_encoding($res["news"], 'UTF8'),
                'imagePath'=> mb_convert_encoding($res["imagePath"], 'UTF8')));
        }
        
        // Close connection
        mysqli_close ($con);
        
        $json = json_encode($news, JSON_UNESCAPED_UNICODE);

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
