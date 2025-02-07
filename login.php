<?php
$conn = new mysqli("localhost", "root", "", "salon_finder");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = htmlspecialchars(trim($_POST["username"]));
    $password = $_POST["password"];
    $role = $_POST["role"];

    $table = ($role === "user") ? "users" : (($role === "salon_owner") ? "salon_owners" : null);
    if (!$table)
        die("Invalid role selected.");

    $stmt = $conn->prepare("SELECT * FROM $table WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row["password"])) {
            session_start();
            $_SESSION["username"] = $username;
            $_SESSION["role"] = $role;
            echo "Login successful! Welcome, " . htmlspecialchars($row["name"]);
        } else {
            echo "Invalid username or password.";
        }
    } else {
        echo "Invalid username or password.";
    }
    $stmt->close();
}
$conn->close();
?>