var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var util = require('util');
var session = require('express-session');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var dir = __dirname + '/public/';
var identityKey = 'skey';
// 用于加密
function hash(str) {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
//会话管理
app.use(session({
    name: identityKey,
    secret: 'dev',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 1000
    } //30 天免登陆
}));
//通过网址登录，已经登录的跳转到主页面，否则跳转到登录界面
app.get('/', function (req, res) {

    console.log("通过主页登录");
    if (req.session.username) { //判断session 状态，如果有效，则返回主页，否则转到登录页面
        console.log(req.session.username);
        console.log("已经登录了，直接跳转主界面");
        res.redirect('/main');
    } else {
        console.log(req.session.username);
        console.log("未登录，跳转到登录界面");
        res.redirect('/login');
    }
})
app.post('/', function (req, res) {
    console.log("zhuye");
})

//退出登录
app.post('/logout', function (req, res) {
    req.session.username = null; // 删除session
    console.log("登出");
    res.clearCookie(identityKey);
    res.sendFile(dir + 'login.html')
});


//注册一个账户，如果已经存在进行登录
app.post("/register", urlencodedParser, function (req, res) {
    var username = req.body.username;
    var pwd = req.body.password;
    console.log("Register:", username, pwd);
    //连接数据库，查询是否已注册
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {
        console.log("sss");
        console.log(err);
        console.log(row);
        // 已经注册了
        if (row != undefined) {
            console.log("用户存在");
            // res.send("用户已注册");
            console.log(__dirname);
            res.sendFile(dir + 'login.html');
        }
        // 未注册 
        else {
            db.serialize(function () {
                //向数据库写入注册信息
                console.log("用户不存在,注册新用户！");

                var new_pwd = hash(pwd);
                console.log("加密之后：", new_pwd);
                db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, new_pwd]);
                console.log("注册成功！");
            });
            res.sendFile(dir + 'login.html');
        }
        db.close();
    });
    // res.send(" 用户已注册");
})

//用于跳转到login post
app.get('/login', function (req, res) {
    console.log("从主页跳转：get login，跳转到post login");
    console.log("ss", __dirname);
    res.sendFile(__dirname + "/public/" + "login.html");
})
//在主界面的时候，如果没有登录的话，则跳转到登录界面
app.get('/main', function (req, res) {
    if (req.session.username == undefined) {
        res.redirect('/login')
    }
    console.log("从主页跳转get main");
    console.log("ss", __dirname);
    res.sendFile(__dirname + "/public/" + "main.html");
})
//登录的管理界面
var user = []
app.post("/login", urlencodedParser, function (req, res) {
    // console.log("postlogin")
    var username = req.body.username;
    var pwd = req.body.password;

    pwd = hash(pwd);
    console.log("lofgin:", username, pwd);
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {
        if (row == undefined) {
            console.log("用户不存在");
            res.send("登录失败：用户名不注册！");
        } else {
            if (row.password == pwd) {
                console.log(username, "登录成功");
                req.session.username = username;
                user[user.length] = username;
                res.redirect('/main');
            } else {
                res.send("登录失败:密码错误！");
            }
        }
        db.close();
    });
})

//注册时判读用户名是否存在；
app.post('/getusername', urlencodedParser, function (req, res) {
    var username = req.body.username1;
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    console.log(username);
    db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {
        if (row == undefined) {
            res.send("OK");
            console.log("ok");
        } else {
            res.send("err");
            console.log("err")
        }
        db.close();
    })
})

var destination = [65, 65, 65];
var tempdest = [65, 65, 65];
var map = new Array();
var snake = []; //存储蛇的位置，身体和头部
var win;
//存储整个地图
for (var i = 0; i < 16; i++) {
    map[i] = new Array()
    for (var j = 0; j < 24; j++) {
        map[i][j] = 0;
    }

}
score = [0, 0, 0];
//头的位置
var head = [
    // [12, 12],
    [2, 12],
    [5, 12]
];
//用于启动游戏
var startGame;
snake[0] = [head[0]];
snake[1] = [head[1]];
snake[2] = [head[2]];
//随机生成食物
var y = Math.ceil(((Math.random() * 24) % 24) - 1);
var x = Math.ceil(((Math.random() * 16) % 16) - 1);
map[x][y] = 5;

//重新开始
function restart() {
    //
    for (var i = 0; i < 16; i++) {
        map[i] = new Array()
        for (var j = 0; j < 24; j++) {
            map[i][j] = 0;
        }
    }
    win = undefined;
    for (var i = 0; i < snake.length; i++) {
        snake[i].length = 0
    }
    head = [
        // [12, 12],
        [2, 12],
        [5, 12]
    ];
    snake[0] = [head[0]];
    snake[1] = [head[1]];
    snake[2] = [head[2]];
    score = [0, 0, 0];
    y = Math.ceil(((Math.random() * 24) % 24) - 1);
    x = Math.ceil(((Math.random() * 16) % 16) - 1);
    map[x][y] = 5;
    destination = [65, 65, 65];
    tempdest = [65, 65, 65];
    ready = 0;
    clearInterval(startGame);
}
//对按键事件做出反应
app.post('/Keys', urlencodedParser, function (req, res) {
    // map [2][3] =1;
    var data = [{
        "score": score,
        "users": user,
        "map": map,
        "name": req.session.username
    }]
    res.send(data);
    console.log(data, "key");
    console.log(req.session.username);
    for (var i = 0; i < user.length; i++) {
        if (req.session.username == user[i]) {
            tempdest[i] = req.body.keynum;
        }
    }
})
var key_num = [0, 0, 0];
//主要的函数，移动，判断输赢，num为第几个玩家
function getmap(num) {
    var len = []
    len[num] = snake[num].length; //蛇的长度
    var tem = [
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    //进行身体移动
    tem[num][0] = snake[num][len[num] - 1][0];
    tem[num][1] = snake[num][len[num] - 1][1];
    for (var i = len[num] - 1; i > 0; i = i - 1) {
        snake[num][i][0] = snake[num][i - 1][0];
        snake[num][i][1] = snake[num][i - 1][1];
    }
    // 舌头的移动
    if (key_num[num] == 0) {
        if (tempdest[num] == 68) { //→
            if (destination[num] == 65) {
                key_num[num] = 0;
            } else {
                destination[num] = tempdest[num];
            }
        }
        if (tempdest[num] == 65) { //→
            if (destination[num] == 68) {
                key_num[num] = 0;
            } else {
                destination[num] = tempdest[num];
            }
        }
        if (tempdest[num] == 87) { //→
            if (destination[num] == 83) {
                key_num[num] = 0;
            } else {
                destination[num] = tempdest[num];
            }
        }
        if (tempdest[num] == 83) { //→
            if (destination[num] == 87) {
                key_num[num] = 0;
            } else {
                destination[num] = tempdest[num];
            }
        }
        key_num[num]++; //控制按键的数量，不会出错
    }
    if (destination[num] == 65) { //→
        head[num][0] = head[num][0];
        head[num][1] = head[num][1] - 1;
    }
    if (destination[num] == 68) { //←
        head[num][0] = head[num][0];
        head[num][1] = head[num][1] + 1;
    }
    if (destination[num] == 83) { //↑
        head[num][0] = head[num][0] + 1;
        head[num][1] = head[num][1];
    }
    if (destination[num] == 87) { //↓
        head[num][0] = head[num][0] - 1;
        head[num][1] = head[num][1];
    }
    key_num[num] = 0

    snake[num][0] = head[num];
    //清空所有这条蛇的数据
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 24; j++) {
            if (map[i][j] != 5 && map[i][j] == num + 1) {
                map[i][j] = 0;
            }
        }
    }
    //失败
    if (head[num][0] < 0 || head[num][0] >= 16 || head[num][1] >= 24 || head[num][1] < 0 ) {
        console.log("失败");
        updatedb(num)
        clearInterval(startGame);
        win = user[num];
        head[num] = [0, 0];
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 24; j++) {
                map[i][j] = 0;
            }
        }
        for (var i = 0; i < snake[num].length; i++) {
            snake[num][i] = [0, 0];
        }
    }
    if (map[head[num][0]][head[num][1]] == 5) { //吃子
        score[num]++;
        map[head[num][0]][head[num][1]] = 0;
        var y = Math.ceil(((Math.random() * 24) % 24) - 1);
        var x = Math.ceil(((Math.random() * 16) % 16) - 1);
        map[x][y] = 5;
        snake[num][snake[num].length] = [tem[num][0], tem[num][1]];
    }else{
        if (map[head[num][0]][head[num][1]]!=0) {
            console.log("失败");
            updatedb(num)
            clearInterval(startGame);
            win = user[num];
            head[num] = [0, 0];
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 24; j++) {
                    map[i][j] = 0;
                }
            }
            for (var i = 0; i < snake[num].length; i++) {
                snake[num][i] = [0, 0];
            }
        }
    }
    for (var i = 0; i < snake[num].length; i++) {
        map[snake[num][i][0]][snake[num][i][1]] = num + 1;
        // console.log(snake[num][i][0], snake[num][i][1])
    }
}
function updatedb(numplay){
    console.log(user[0],user[1])
    var tem = getgrade(user[0],user[1]);
    console.log("sss",tem)
    if(numplay ==0){
        tem[0] = Number(tem[0]) + Number(1);
    }
    if(numplay ==1){
        tem[1] = Number(tem[1]) + Number(1);
    }
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    db.serialize(function () {
        //向数据库写入注册信息
        console.log([tem[0],tem[1],user[0],user[1]])
        db.run("update grade set grade1 = ?,grade2 =? WHERE play1 =?and play2 =?;", [tem[0],tem[1],user[0],user[1]]);
        db.run("update grade set grade1 = ?,grade2 =? WHERE play1 =?and play2 =?;", [tem[1],tem[0],user[1],user[0]]);
        console.log("注册成功！");
    });
}

var ready = 0;
app.post('/Ready', urlencodedParser, function (req, res) {
    ready++;
    console.log(ready, req.session.username);
    if (ready == 2) {
        starttime();
        startGame = setInterval(

            function move() {
                // console.log("move", head[num], snake[num]);
                getmap(0);
                getmap(1);
                // getmap(2);
            }, 500);
        var sda = [{
            "user": user,
            "username": req.session.username
        }]
        res.send(sda);
    }
})
app.post('/stopgame', urlencodedParser, function (req, res) {
    clearInterval(startGame);
    endtime();
    res.send("ok");
})
app.post('/startgame', urlencodedParser, function (req, res) {
    starttime();
    startGame = setInterval(
        function move() {
            // console.log("move", head[num], snake[num]);
            getmap(0);
            // getmap(2);
            getmap(1);

        }, 500);
    res.send("ok");
})
app.post('/restart', urlencodedParser, function (req, res) {

    if (win == undefined) {
        console.log("st1")
        clearInterval(startGame);
    } else {
        console.log("st2")
        win == undefined;
    }
    h = 0;
    m = 0;
    s = 0;
    restart();
    startGame = setInterval(
        function move() {
            // console.log("move", head[num], snake[num]);
            getmap(0);
            getmap(1);
            // getmap(2);
        }, 500);
    res.send("ok");
})

//重新设置地图得初值
var grade1,grade2;
function getgrade(play1, play2) {
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    // console.log(username);
    // var grade1,grade2;
    var str = "SELECT * FROM grade WHERE play1= " +  play1 + "AND play2 ="+ play2;
    // console.log(str);
    db.get("SELECT * FROM grade WHERE play1=? AND play2 =? ", [play1, play2], function (err, row) {
        // console.log(play1,play2);
        // console.log(row,err);
        if (row == undefined) {
            db.serialize(function () {
                //向数据库写入注册信息
                
                db.run("INSERT INTO grade (play1, play2,grade1,grade2) VALUES (?,?,?,?)", [play1,play2,0,0]);
                // console.log("注册成功！");
            });
            grade1 = 0;
            grade2 = 0;
        } else {
            grade1 = row.grade1;
            grade2 = row.grade2;
        }
        db.close();
    })
    return [grade1,grade2];
}
app.post('/check',urlencodedParser,function(req,res){
    var match
    if (ready==2)
        match = getgrade(user[0],user[1]);
    if (ready ==1){
        match = [0,0];
    }
    var ma = user[0]+" : "+user[1]+ "  "+ match[0]+" : "+match[1];
    res.send(ma);
})
app.post('/data', urlencodedParser, function (req, res) {
    // for (var i = 0;i<16;i++){
    //     for(var j = 0;j<24;j++){
    //         if(map[i][j]==1){
    //             console.log(i,j)

    //         }
    //     }
    // }
    
    time = [showh, showm, shows]
    var data = [{
        "score": score,
        "users": user,
        "map": map,
        "win": win,
        "head": head,
        "time": time,
        "name": req.session.username
    }]
    res.send(data);
    // console.log(data, "data");
    // console.log("key;")
    // console.log(req.body.keynum);

})

function settime(a) {
    if (a < 10)
        a = "0" + a;
    return a;
}
h = 0;
m = 0;
s = 0;
var showh = settime(h);
var showm = settime(m);
var shows = settime(s);

function starttime() {
    showh = settime(h);
    showm = settime(m);
    shows = settime(s);
    s++;
    if (s == 60) {
        s = 0;
        m++;
    }
    if (m == 60) {
        m = 0;
        h++;
    }
    t = setTimeout(
        function () {
            starttime();
        },
        1000);
}

function endtime() {
    clearTimeout(t);
}

// app.post('/test', urlencodedParser,function(req,res){
//     mmmp = [1,2,3];
//     var mess=[
//         {
//             "user":"xyy",
//             "map":mmmp,
//         }
//     ]
//     res.send(mess)
// }
// )

var server = app.listen(8081, "192.168.43.180");

//     var host = server.address().address;
//     var port = server.address().port;

//     console.log("应用实例，访问地址为 http://%s:%s", host, port);

// })