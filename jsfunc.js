// global variables
var g_account;
var g_password;
var g_uniqueId;
var g_points = 0;

var ptPerCard = 10; //points per reward card

var xhr = new XMLHttpRequest();
//var url = 'http://172.22.41.63/Pigeon/MA/00_Demo/R0.2/RewardCard/Server/index.php'; 
//var imgUrl = 'http://172.22.41.63/Pigeon/MA/00_Demo/R0.2/RewardCard/Server/img/'; 
var url = 'http://api.RewardCard2.kuopo.twbbs.org/index.php'; 
var imgUrl = 'http://api.RewardCard2.kuopo.twbbs.org/img/'; 
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
    var qs = '/' + g_uniqueId;
        
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
            
            if (!response['error'])
                showPoints(response[g_uniqueId]);
            else
            {
                showPoints(0);
                dprint(response['error'] + ' [' + response['id'] + ']');
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
    }
} 

function showPoints(points)
{
    var image, result = "";
    var cards;
    var update = false;
    
    if (g_points != points)
    {
        update = true;
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

function messaging_cb(channel, message)
{
    dprint("in messaging_cb: " + message);
    queryServer();
}

function getUniqueId()
{
    var uniqueId = pigeon.getSubscriptionId();
    
    if (uniqueId.search("200") == -1)
    {
        alert("getSubscriptionId Error: " + uniqueId);
        return 0;
    }
    else
    {
        uniqueId = uniqueId.substring(uniqueId.indexOf(":")+1, uniqueId.length);
        uniqueId = parseInt(uniqueId.substring(0, 8), 16);
        return uniqueId;
    }

}

function onloadBody()
{   
    setCss();

    g_uniqueId = getUniqueId();
    queryServer();

    ret = pigeon.subscribeChannel('demo_card', "messaging_cb");
    resultParser(ret, "subsribe channel demo_card");

    dprint("[" + g_uniqueId + "]");
}