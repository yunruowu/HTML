// 蛇头的相对坐标
var d_i = 0;
var d_j = 0;
// 初始化方向
var destination = 'D';
// 玩家得分
var score_play1 = 0;
// 控制按键的次数
var key_num = 0;
// 控制速度提升
var changeboll = 1;
var ekey = 87;

// 用于获取当前速度，实现最初的难度选择和运行过程中的速度提升
function getspeed() {
    var level_d = document.getElementById('seltable');
    var index = level_d.selectedIndex;
    var val = level_d.options[index].value;
    var speed = 0;
    if (val != null) {
        if (val == "Easy") {
            speed = 200;

        }
        if (val == "Middle") {
            speed = 100;
        }
        if (val == "Hard") {
            speed = 50;
        }
    }
    else {
        speed = 40;
    }
    // 游戏过程中加速
    if ((speed - score_play1 / 5 * 20) >= 10) {
        speed = speed - score_play1 / 5 * 20;
        return speed;
    } else {
        return 10;
    }
}

// 获取键盘事件并解析具体内容
document.onkeydown = function getDestination(evt) {
    ekey = evt.keyCode;
    if (key_num == 0) {
        if (ekey == 87) {
            if (destination == 'S') {
                key_num = 0;
                destination == 'S';
            }
            else {
                destination = 'W';
            }
        }
        if (ekey == 65) {
            if (destination == 'D') {
                destination == 'D';
                key_num = 0;
            }
            else {
                destination = 'A';
            }
        }
        if (ekey == 83) {
            if (destination == 'W') {
                destination == 'W';
                key_num = 0;
            }
            else {
                destination = 'S';

            }
        }
        if (ekey == 68) {
            if (destination == 'A') {
                destination == 'A';
                key_num = 0;
            }
            else {
                destination = 'D';
            }
        }
        key_num++;
    }
    else {
        destination = destination;
    }
}

// 获取蛇尾
function tail_pos(head) {
    var b = document.getElementsByClassName("body");
    var tail = [];
    if (b.length == 0) {
        tail[0] = head.style.top;
        tail[1] = head.style.left;
    } else {

        tail[0] = b[0].style.top;
        tail[1] = b[0].style.left;
    }
    return tail;
}

// 控制蛇身的移动
function body(head) {
    var b = document.getElementsByClassName("body");
    var i = b.length - 1;
    for (; i >= 0; i = i - 1) {
        if (i == 0) {
            b[0].style.left = head.style.left;
            b[0].style.top = head.style.top;
        } else {
            b[i].style.left = b[i - 1].style.left;
            b[i].style.top = b[i - 1].style.top;
        }
    }
}

// 判断蛇是否吃到自己身体
function hit_body(head) {
    var b = document.getElementsByClassName("body");
    var i = head.style.left;
    var j = head.style.top;
    if (b.length > 3) {
        var num = 0;
        for (; num < b.length; num++) {
            if (b[num].style.left == i) {
                if (b[num].style.top == j) {
                    end();
                    alert("over");
                }
            }
        }
    }
}

// 控制蛇头的移动以及判断是否吃食物，生成下一个食物
function move() {
    var b = document.getElementById('snake');
    var pre_i = d_i;
    var pre_j = d_j;
    var snakenode = [];
    var tail = tail_pos(b);
    if (destination == 'D') {
        if (d_i == 23) {//判断是否撞墙
            end();
            alert("over");
        } else {
            d_i = (d_i + 1) % 24;
        }
    }
    if (destination == 'S') {
        if (d_j == 15) {//判断是否撞墙
            end();
            alert("over");
        } else {
            d_j = (d_j + 1) % 16;
        }

    }
    if (destination == 'A') {
        if (d_i == 0) {//判断是否撞墙
            end();
            alert("over");
        } else {
            d_i = (d_i - 1) % 24;
        }
    }
    if (destination == 'W') {
        if (d_j == 0) {//判断是否撞墙
            end();
            alert("over");
        } else {
            d_j = (d_j - 1) % 16;
        }
    }

    hit_body(b);
    body(b);

    // 实现蛇吃食物的动作，并随机刷新食物位置
    b.style.left = (d_i % 24) * 20 + 'px';
    b.style.top = (d_j % 16) * 20 + 'px';
    var food_d = document.getElementById('food');
    var snake2 = document.getElementById('map');

    f_i = food_d.style.left;
    f_j = food_d.style.top;

    // 判断是否吃到食物
    if ((pre_j % 16) * 20 + 'px' == f_j) {
        if ((pre_i % 24) * 20 + 'px' == f_i) {
            score_play1++;
            food_d.style.left = Math.ceil(((Math.random() * 24) % 24) - 1) * 20 + 'px';
            food_d.style.top = Math.ceil(((Math.random() * 16) % 16) - 1) * 20 + 'px';
            snakenode.push(food_d);
            // 将食物“转化”为身体
            var newnode = document.createElement("div");
            newnode.id = "snake1";
            newnode.className = "body";
            newnode.style.color = "black";
            newnode.style.top = tail[0];
            newnode.style.left = tail[1];
            newnode.style.width = 20 + "px";
            newnode.style.height = 20 + "px";
            newnode.style.position = "absolute;z-index:10";
            snake2.appendChild(newnode);
        }
    }
    var out1_play1 = document.getElementById("out1");
    if (score_play1 % 5 == 1 && score_play1 != 1 && changeboll == 0) {

        changeboll = 1;
    }
    if (score_play1 % 5 == 0 && score_play1 != 0 && changeboll == 1) {
        changespeed();
        changeboll = 0;
    }

    out1_play1.innerHTML = score_play1 + "分";
    key_num = 0;
}
;

// 实现虚拟按键
function up() {
    if (destination == 'S') {
        key_num = 0;
        destination == 'S';
    }
    else {
        destination = 'W';
    }
}
function down() {
    if (destination == 'W') {
        key_num = 0;
        destination == 'W';
    }
    else {
        destination = 'S';
    }
}
function left() {
    if (destination == 'D') {
        key_num = 0;
        destination == 'D';
    }
    else {
        destination = 'A';
    }
}
function right() {
    if (destination == 'A') {
        key_num = 0;
        destination == 'A';
    }
    else {
        destination = 'D';
    }
}

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