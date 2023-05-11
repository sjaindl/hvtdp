<?php require 'constants.php';

    header('Content-Type: text/plain; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST");

    postDuckrun($dbname, $dbuser, $dbpass, $dbhost);

    function postDuckrun($name, $user, $pass, $host) {
        //if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            //exit();
        //}

        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $firstname = $_GET['firstname'];
        $lastname = $_GET['lastname'];
        $phone = $_GET['phone'];
        $mail = $_GET['mail'];
        $address = $_GET['address'];
        $duckcount = $_GET['duckcount'];
        $useragent = $_GET['useragent'];
        $language = $_GET['language'];
        $platform = $_GET['platform'];

        $sql = "INSERT INTO Duckrun (firstName, lastName, phone, mail, duckCount) VALUES ('$firstname', '$lastname', '$phone', '$mail', '$address', '$duckcount')";

        if ($con->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $con->error;
        }

        // Close connection
        mysqli_close ($con);

        $to = "hvtdpstainz@gmx.at";
        $subject = "Bestellung Entenlauf 2023: " . $firstname . " " . $lastname;

        $message = "Vorname: " . $firstname . "\r\n";
        $message .= "Nachname: " . $lastname . "\r\n";
        $message .= "Telefonnummer: " . $phone . "\r\n";
        $message .= "E-Mail: " . $mail . "\r\n";
        $message .= "Adresse: " . $address . "\r\n";
        $message .=  "Anzahl Enten: " . $duckcount . "\r\n" . "\r\n";

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
