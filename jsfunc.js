document.write('<script type="text/javascript" src="cordova-2.5.0.js"></script>');
document.write('<script type="text/javascript" src="pigeon-0.4.js"></script>');

// global variables
var g_account;
var g_password;
var g_uniqueId;
var g_points = 0;

var firstTime = true;

var ptPerCard = 10; //points per reward card

var xhr = new XMLHttpRequest();
//var url = 'http://172.22.41.63/Pigeon/MA/00_Demo/R0.4/RewardCard/api/index.php'; 
//var imgUrl = 'http://172.22.41.63/Pigeon/MA/00_Demo/R0.4/RewardCard/api/img/'; 
var url = 'http://RewardCard4.pigeonmtk.twbbs.org/api/index.php'; 
var imgUrl = 'http://RewardCard4.pigeonmtk.twbbs.org/api/img/'; 
// ----------------

function dprint(str)
{
    document.getElementById("div_log").innerHTML = str;
}

function setCss()
{
    var sheet = document.createElement("style");
    var width = (document.documentElement.clientWidth / document.documentElement.clientWidth) * 95;
    sheet.innerHTML = "#div_header img {width: " + width + "%; }";
    sheet.innerHTML += "#div_points {width: " + width + "%; }";
    sheet.innerHTML += "img {width: " + width*0.9 + "%; }";

    document.head.appendChild(sheet);
}

function removeClass(id)
{
    document.getElementById(id).className = "";
}

// -------------------------------------
// query server side for card's points
// -------------------------------------

function queryServer()
{   
    var qs = '?id=' + g_uniqueId;
    
    if(xhr)
    {
        xhr.open("GET", url+qs, true);
        xhr.send();
        xhr.onreadystatechange = queryServerHandler;
    }
    else
    {
        alert("no xhr took place at all");
    }
}

function queryServerHandler(evtXHR)
{
    if (xhr.readyState == 4)
    {
        if (xhr.status == 200)
        {
            var response = xhr.responseText;
            response = JSON.parse(response);
            
            if (!response["error"])
                showPoints(response[g_uniqueId]);
            else
            {
                showPoints(0);
                dprint(response["error"] + ' [' + response["id"] + ']');
            }
        }
        else
        {
            alert("xhr Errors Occured " + xhr.readyState + " and the status is " + xhr.status);
        }
    }
    else
    {
        //console.log("currently the application is at" + xhr.readyState);
		//alert("currently the application is at" + xhr.readyState);
    }
} 

function showPoints(points)
{
    var image, result = "";
    var cards;
    var update = false;
    
    if (g_points != points)
    {
		if (firstTime)
		{
			update = false;
			firstTime = false;
		}
		else
		{
			update = true;
		}
		g_points = points;
    }
    
    // error
    if (points < 0)
    {
        points = 0;
        cards = 0;
    }
    else 
    {           
        cards = Math.floor(points / ptPerCard);
        
        switch (cards)
        {
            case 0: result = "";    break;
            case 1: result = "You have " + cards + " full card";    break;
            default: result = "You have " + cards + " full cards";  break;
        }
    }

    if (points == 0)
    {
        image = "<img src='" + imgUrl + "00.png' />";
        result += "Oops, you do not have any points now!"
    }
    else if ((points % ptPerCard) == 0)
    {
        image = "<img src='" + imgUrl + ptPerCard + ".png' />";        
        result = result + " now! <br /> Get a free exchange!"
    }
    else if ((points % ptPerCard) < ptPerCard)
    {
        image = "<img src='" + imgUrl + "0" + (points % ptPerCard) + ".png' />";
        if (cards >= 1)
            result = result + " and " + (points-ptPerCard*cards) + " points now! <br /> " + (ptPerCard*(cards+1)-points) + " points for next card!";
        else    
            result = "You have " + (points-ptPerCard*cards) + " points now! <br /> " + (ptPerCard*(cards+1)-points) + " points for a full card!";
    }
    
    document.getElementById("div_points").innerHTML = image;
    document.getElementById("div_message").innerHTML = result;
    $("#div_barcode").barcode(g_uniqueId.toString(), "code128", {barWidth:2, barHeight:30, showHRI:false});
    
    if (update)
    {
        document.getElementById("div_points").className = "emphasis";
        document.getElementById("div_message").className = "emphasis";
        
        setTimeout("removeClass('div_points')", 5000);
        setTimeout("removeClass('div_message')", 5000);
    }    
}


//---------------------------
// msghub
//---------------------------

function messaging_success_cb(ret)
{
	queryServer();
}

function messaging_eror_cb(ret)
{
	alert(ret);
}

function messaging_cb(ret)
{
	//ret = eval('(' + ret + ')');
	//document.getElementById("div_log").innerHTML = "msg from [" + ret["channel"] + "]<br />";
    queryServer();
}

//---------------------------
// get subscription id
//---------------------------
function getUniqueId()
{
	pigeon.getSubscriptionId(getid_success_cb, getid_error_cb);
}

function getid_success_cb(ret)
{
	ret = eval('(' + ret + ')');
	g_uniqueId = ret["mValues"]["Value"];
	g_uniqueId = g_uniqueId.substring(0, 8);
	
	pigeon.subscribeChannel(messaging_success_cb, messaging_eror_cb, 'CH-'+g_uniqueId.toString(), messaging_cb);
}

function getid_error_cb(ret)
{
	alert(ret);
}
/*
function resultParser(result, errorStr)
{
    var successStr = "200:";
    
    if (result.search(successStr) == -1)
    {
        dprint(errorStr + " Error: " + result);
        return false;
    }
    else
    {
        index = result.indexOf(successStr);
        ret = result.substring(index+successStr.length, result.length);
        return ret;
    }
}
*/

function onloadBody()
{   
    setCss();
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady()
{
    getUniqueId();
}