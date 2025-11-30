<?php require 'constants.php';

    header('Content-Type: text/plain; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    header("Access-Control-Allow-Methods: GET, POST");

    postGoldenshot($dbname, $dbuser, $dbpass, $dbhost);

    function postGoldenshot($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);
        mysqli_set_charset($con, "utf8mb4");

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $firstName = $_GET['firstName'];
        $lastName = $_GET['lastName'];
        $phone = $_GET['phone'];
        $mail = $_GET['mail'];
        $photo = $_GET['photo'];

        $useragent = $_GET['useragent'];
        $language = $_GET['language'];
        $platform = $_GET['platform'];

        $sql = "INSERT INTO Goldenshot (firstName, lastName, phone, email, photo) VALUES ('$firstName', '$lastName', '$phone', '$mail', '$photo')";

        if ($con->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $con->error;
        }

        // Close connection
        mysqli_close ($con);

        $to = "hvtdpstainz@gmx.at";
        $subject = "Anmeldung Torschuss-Challenge 2024: " . $teamname;

        $message = "Vorname: " . $firstName . "\r\n";
        $message .= "Nachname: " . $lastName . "\r\n";
        $message .= "Telefonnummer: " . $phone . "\r\n";
        $message .= "E-Mail: " . $mail . "\r\n";
        $message .= "Photo: " . $photo . "\r\n" . "\r\n";

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
