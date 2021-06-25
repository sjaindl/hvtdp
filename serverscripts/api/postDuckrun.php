<?php require 'constants.php';

    header('Content-Type: application/json; charset=utf-8');
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET");

    postDuckrun($dbname, $dbuser, $dbpass, $dbhost);
    
    function postDuckrun($name, $user, $pass, $host) {
        $con = @mysqli_connect($host, $user, $pass, $name);

        if (!$con) {
            echo "Error: " . mysqli_connect_error();
            exit();
        }

        $firstname = $_GET['firstname'];
        $lastname = $_GET['lastname'];
        $phone = $_GET['phone'];
        $mail = $_GET['mail'];
        $duckcount = $_GET['duckcount'];

        $sql = "INSERT INTO Duckrun (firstName, lastName, phone, mail, duckCount) VALUES ('$firstname', '$lastname', '$phone', '$mail', '$duckcount')";

        if ($con->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        // Close connection
        mysqli_close ($con);

        $to = "hvtdpstainz@gmx.at";
        $subject = "Bestellung Entenlauf 2021: " . $firstname . " " . $lastname;

        $message = "Vorname: " . $firstname . "\r\n";
        $message .= "Nachname: " . $lastname . "\r\n";
        $message .= "Telefonnummer: " . $phone . "\r\n";
        $message .= "E-Mail: " . $mail . "\r\n";
        $message .=  "Anzahl Enten: " . $duckcount;

        $headers = "From: " . $mail . "\r\n" .
        "CC: jaindl.stefan@gmail.com";

        mail($to, $subject, $message, $headers);
    }
?>
