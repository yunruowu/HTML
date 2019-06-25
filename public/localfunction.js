var sta_or_end = 0;
// 游戏开始
function start() {
    if (sta_or_end == 0) {
        startVar = window.setInterval("move()", getspeed());
        starttime();
        sta_or_end = 1;
    }
}

// 游戏结束
function end() {
    if (sta_or_end == 1) {
        endtime();
        clearInterval(startVar);

        sta_or_end = 0;
    }

}

// 实现速度改变
function changespeed() {
    end();
    start();
}


// 设定计时器
function settime(a) {
    if (a < 10)
        a = "0" + a;
    return a;
}
h = 0;
m = 0;
s = 0;

function starttime() {
    var showh = settime(h);
    var showm = settime(m);
    var shows = settime(s);
    document.getElementById("showtime").innerHTML = showh + ":" + showm + ":" + shows;
    s++;
    if (s == 60) {
        s = 0;
        m++;
    }
    if (m == 60) {
        m = 0;
        h++;
    }
    t = setTimeout("starttime()", 1000);
}

function endtime() {
    clearTimeout(t);
}

var map=[[0,1,1,1,1],[0,1,1,1,1]];
for (var i = 0;i<2;i++){
    for(var j = 0;j<5;j++){
        if(map[i][j]==1){
            
        }
    }
}