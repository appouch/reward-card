<?php 
    header("Access-Control-Allow-Origin: *");
    
    include("config.php");
    #echo "hello cross domain.";
    
    $request_method = $_SERVER['REQUEST_METHOD'];
    #echo $request_method;
    
    if ($request_method == 'POST')  // now the POST method is fade out, no one use this method
    {
        $body = file_get_contents("php://input");
        $xml = simplexml_load_string($body);
        $cardId = (string)$xml->id;
        #echo $cardId;
        
        $sql = "SELECT * FROM cards WHERE id='$cardId'";
        $result = mysql_query($sql) or die('Invalid query: ' . mysql_error());
        $num_rows = mysql_num_rows($result);
        
        if ($row = mysql_fetch_row($result)) 
        {
            $points = $row[1];
            
            $array = array(
                "id" => $cardId,
                "points" => $points,
            );
            $ret = json_encode($array);    
        }
        else
        {
            $array = array(
                "id" => $cardId,
                "error" => "401 User Unauthorized",
            );
            $ret = json_encode($array);        
        }
        
        echo $ret;
        mysql_free_result($result);    
    }
    
    else if ($request_method == 'PUT')
    {
        $requestPath = $_SERVER['PHP_SELF'];
        $pos = strpos($requestPath, 'index.php');
        $requestPath = substr($requestPath, $pos+strlen('index.php'));
        $tokens = explode('/', $requestPath);
        $cardId = $tokens[sizeof($tokens)-2];
        $pointsValue = $tokens[sizeof($tokens)-1];
        
        if ((!strcmp($cardId, '')) or (!strcmp($pointsValue, '')))
        {
            echo "Missing id or points \n";
            return;
        }
        
        $sql = "SELECT points FROM cards WHERE id='$cardId'";
        $result = mysql_query($sql);
        $num_rows = mysql_num_rows($result);
        
        if ($num_rows)
        {
            $sql = "UPDATE cards SET points='$pointsValue' WHERE id='$cardId'";
            $result = mysql_query($sql);
        }
        else
        {
            $sql = "INSERT INTO cards (id, points) VALUES ('$cardId', '$pointsValue')";
            $result = mysql_query($sql);
        }
        
        if (!mysql_error()) 
            echo header("HTTP/1.1 200 OK");
        else
        {
            echo header("HTTP/1.1 503 Service Unavailable");
            echo "Update database failed \n";
        }
    }
    
    else if ($request_method == 'GET')
    {
        $requestPath = $_SERVER['PHP_SELF'];
        $pos = strpos($requestPath, 'index.php');
        $requestPath = substr($requestPath, $pos+strlen('index.php'));
        $tokens = explode('/', $requestPath);
        $cardId = $tokens[sizeof($tokens)-1];
        
        $sql = "SELECT * FROM cards WHERE id='$cardId'";
        $result = mysql_query($sql) or die('Invalid query: ' . mysql_error());
        $num_rows = mysql_num_rows($result);
        
        if ($row = mysql_fetch_row($result)) 
        {
            $points = $row[1];
            echo '{"'.$cardId.'": "'.$points.'"}';
        }
        else
        {
            echo 'Invalid id';
        }
        mysql_free_result($result); 
    }
    
?>