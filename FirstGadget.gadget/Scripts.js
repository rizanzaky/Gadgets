document.getElementsByTagName("body").onload = startTime();

function startTime() {
    var today = new Date();
    var h = checkHour(today.getHours());
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    
    document.getElementById('clock').innerHTML = h[0] + ":" + m + ":" + s + h[1];
    
    setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}

function checkHour(h) {
    if (h == 0)
        return [12, "AM"];
    else if (h > 12) {
        if (h - 12 < 10)
            return ["0" + (h - 12), "PM"];
        return [h - 12, "PM"];        
    }
    else if (h == 10 || h == 11)
        return [h - 12, "PM"];
    else
        return ["0" + h, "AM"]
}