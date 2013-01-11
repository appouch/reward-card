<?php 
    header("Access-Control-Allow-Origin: *");
    
    include("config.php");
    #echo "hello cross domain.";
    
    $request_method = $_SERVER['REQUEST_METHOD'];
    #echo $request_method;

    if ($request_method == 'PUT')
    {
        $key_id = 'id';
        $key_point = 'point';
    
        $postData = file_get_contents("php://input");
        $obj = json_decode($postData);
        
        #echo $obj->$key_id;
        #echo $obj->$key_point;

        $cardId = $obj->$key_id;
        $pointsValue = $obj->$key_point;
        
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
        $qs = $_SERVER['QUERY_STRING'];       
        $value = explode("=", $qs);
        if ($value[0] == 'id')
            $cardId = $value[1];
        else
        {            
            $array = array(
                "id" => $cardId,
                "error" => "Invalid Format",
            );
            $ret = json_encode($array);

            echo $ret;
        }

        
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
            #echo 'Invalid id';
            
            $array = array(
                "id" => $cardId,
                "error" => "Invalid Id",
            );
            $ret = json_encode($array);

            echo $ret;
        }
        mysql_free_result($result); 
    }
    
?>