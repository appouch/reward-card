<?php

    $dbServer = "pigeondb.cs7e6xfyqwyi.us-west-1.rds.amazonaws.com";
    $dbName = "pigeonRewardCard";
    $dbUser = "airline";
    $dbPwd = "airline123";

    if(!@mysql_connect($dbServer, $dbUser, $dbPwd))
        die("Connect to database $dbServer failed");
        
    //echo "Connect to database $dbServer successfully! <br>";
    
    mysql_query("SET NAMES utf8");

    if(!@mysql_select_db($dbName))
        die("The database is not avaliable.");
        
    //echo "Select database $dbName successfully! <br>";
?> 