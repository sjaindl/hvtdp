<?php require 'constants.php';

    header('Content-Type: text/plain; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST");

    postKleinfeldturnier($dbname, $dbuser, $dbpass, $dbhost);

    function postKleinfeldturnier($name, $user, $pass, $host) {
        //if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            //exit();
        //}

        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $name = $_GET['name'];
        $phone = $_GET['phone'];
        $mail = $_GET['mail'];
        $teamname = $_GET['teamname'];
        $useragent = $_GET['useragent'];
        $language = $_GET['language'];
        $platform = $_GET['platform'];

        $sql = "INSERT INTO Turnier (name, phone, mail, teamname, vorrunde) VALUES ('$name', '$phone', '$mail', '$teamname')";

        if ($con->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $con->error;
        }

        // Close connection
        mysqli_close ($con);

        $to = "hvtdpstainz@gmx.at";
        $subject = "Anmeldung Stainzer Kleinfeldturnier 2023: " . $teamname;

        $message = "Name: " . $name . "\r\n";
        $message .= "Telefonnummer: " . $phone . "\r\n";
        $message .= "E-Mail: " . $mail . "\r\n";
        $message .=  "Teamname: " . $teamname . "\r\n" . "\r\n";

        $message .= "Server Logs: " . $_SERVER['HTTP_USER_AGENT'] . "\r\n" . "\r\n";

        $message .= "Client Logs: " . $useragent . "\r\n";
        $message .= "language: " . $language . "\r\n";
        $message .= "platform: " . $platform . "\r\n";

        $message .= "method: " . $_SERVER['REQUEST_METHOD'] . "\r\n";

        $message .= "timestamp: " . time() . "\r\n";

        $headers = "From: " . $mail . "\r\n" .
        "CC: jaindl.stefan@gmail.com";

        mail($to, $subject, $message, $headers);
    }
?>
