<?php

#    $dbServer = "172.22.41.63";
#    $dbName = "pigeonRewardCard";
#    $dbUser = "scannerApp";
#    $dbPwd = "scanner";
    $dbServer = "198.211.104.181";
    $dbName = "pigeonRewardCard";
    $dbUser = "root";
    $dbPwd = "xu06z8dk";

    if(!@mysql_connect($dbServer, $dbUser, $dbPwd))
        die("Connect to database $dbServer failed");
        
    //echo "Connect to database $dbServer successfully! <br>";
    
    mysql_query("SET NAMES utf8");

    if(!@mysql_select_db($dbName))
        die("The database is not avaliable.");
        
    //echo "Select database $dbName successfully! <br>";
?>
