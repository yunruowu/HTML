var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

var util = require('util');
// app.use(cookieParser())

var session = require('express-session');


var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
//   
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


app.use(session({
    name: identityKey,
    secret: 'dev',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 1000
    } //30 天免登陆
}));




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
    // if (req.cookies.isVisit) {
    //     console.log(req.cookies);
    //     res.send("再次欢迎访问");
    // } else {
    //     res.cookie('isVisit', 1, {maxAge: 60 * 1000});
    //     res.send("欢迎第一次访问");
    // }
})




app.post('/', function (req, res) {
    console.log("zhuye");
    // if(req.session.username){;  //判断session 状态，如果有效，则返回主页，否则转到登录页面
    //     res.render('index.html',{username : req.session.username});
    // }else{
    //     res.redirect('/login');
    // }
    // if (req.cookies.isVisit) {
    //     console.log(req.cookies);
    //     res.send("再次欢迎访问");
    // } else {
    //     res.cookie('isVisit', 1, {maxAge: 60 * 1000});
    //     res.send("欢迎第一次访问");
    // }
})


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


app.get('/login', function (req, res) {
    console.log("从主页跳转：get login，跳转到post login");
    console.log("ss", __dirname);
    res.sendFile(__dirname + "/public/" + "login.html");
})

app.get('/main', function (req, res) {
    console.log("从主页跳转get main")
    console.log("ss", __dirname)
    res.sendFile(__dirname + "/public/" + "main.html");
})

var user = []
app.post("/login", urlencodedParser, function (req, res) {
    // console.log("postlogin")
    var username = req.body.username;
    var pwd = req.body.password;

    pwd = hash(pwd);
    console.log("lofgin:", username, pwd);
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {
        // console.log("sss");
        // console.log(err);
        // console.log(row);
        // 没有注册了
        if (row == undefined) {
            console.log("用户不存在");
            res.send("登录失败：用户名不注册！");
        }
        // 注册 
        else {
            if (row.password == pwd) {
                // res.send("登录成功");

                // res.sendFile('/HTML/snake/theme.css');
                // res.sendFile('/HTML/snake/fun.js');
                console.log("登录成功");

                // res.sendFile(dir + 'main.html');
                req.session.username = username;
                user[user.length] = username;
                res.redirect('/main');
                // console.log(req.session.username);
            } else {
                res.send("登录失败:密码错误！");
            }
        }
        db.close();
    });
})


app.post('/getusername', urlencodedParser, function (req, res) {
    var username = req.body.username1;
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    console.log(username);
    db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {

        // console.log(err);
        // console.log(row);
        // 没有注册了
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
var snake = [];
var win;
//存储整个地图
for (var i = 0; i < 16; i++) {
    map[i] = new Array()
    for (var j = 0; j < 24; j++) {
        map[i][j] = 0;
    }

}
score = [0, 0, 0];

var head = [
    [12, 12],
    [2, 12]
];
var startGame;
snake[0] = [head[0]];
snake[1] = [head[1]];
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
    // snake[0].length=0;
    // snake[1].length=0;
    for (var i = 0; i < snake.length; i++) {
        snake[i].length = 0
    }
    head = [
        [12, 12],
        [2, 12]
    ];
    snake[0] = [head[0]];
    snake[1] = [head[1]];
    score = [0, 0, 0];
    y = Math.ceil(((Math.random() * 24) % 24) - 1);
    x = Math.ceil(((Math.random() * 16) % 16) - 1);
    map[x][y] = 5;
    destination = [65, 65, 65];
    tempdest = [65, 65, 65];
}
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
var key_num = [0, 0];

function getmap(num) {
    var len = []
    len[num] = snake[num].length;
    var tem = [
        [0, 0],
        [0, 0]
    ];

    tem[num][0] = snake[num][len[num] - 1][0];
    tem[num][1] = snake[num][len[num] - 1][1];
    for (var i = len[num] - 1; i > 0; i = i - 1) {
        snake[num][i][0] = snake[num][i - 1][0];
        snake[num][i][1] = snake[num][i - 1][1];
    }


    // console.log(destination[num], tempdest);
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


        key_num[num]++;
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


    // snake[num][snake[num].length][1]= ;
    snake[num][0] = head[num];
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 24; j++) {
            if (map[i][j] != 5 && map[i][j] == num + 1) {
                map[i][j] = 0;
            }
        }

    }

    if (head[num][0] < 0 || head[num][0] >= 16 || head[num][1] >= 24 || head[num][1] < 0) {
        console.log("失败");
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
    }
    for (var i = 0; i < snake[num].length; i++) {
        map[snake[num][i][0]][snake[num][i][1]] = num + 1;
        // console.log(snake[num][i][0], snake[num][i][1])
    }
}


var ready = 0;
app.post('/Ready', urlencodedParser, function (req, res) {
    ready++;
    console.log(ready, req.session.username);
    if (ready == 2) {
        startGame = setInterval(
            function move() {
                // console.log("move", head[num], snake[num]);
                getmap(0);
                getmap(1);
            }, 1000);
        res.send("ok");
    }
})
app.post('/stopgame', urlencodedParser, function (req, res) {
    clearInterval(startGame);
})
app.post('/startgame', urlencodedParser, function (req, res) {
    startGame = setInterval(
        function move() {
            // console.log("move", head[num], snake[num]);
            getmap(0);
            getmap(1);
        }, 1000);
})
app.post('/restart', urlencodedParser, function (req, res) {
    clearInterval(startGame);
    restart();
    startGame = setInterval(
        function move() {
            // console.log("move", head[num], snake[num]);
            getmap(0);
            getmap(1);
        }, 1000);
})

//重新设置地图得初值


app.post('/data', urlencodedParser, function (req, res) {
    // for (var i = 0;i<16;i++){
    //     for(var j = 0;j<24;j++){
    //         if(map[i][j]==1){
    //             console.log(i,j)

    //         }
    //     }
    // }
    var data = [{
        "score": score,
        "users": user,
        "map": map,
        "win": win,
        "head": head,
        "name": req.session.username
    }]
    res.send(data);
    // console.log(data, "data");
    // console.log("key;")
    // console.log(req.body.keynum);

})



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

var server = app.listen(8081, "127.0.0.1");

//     var host = server.address().address;
//     var port = server.address().port;

//     console.log("应用实例，访问地址为 http://%s:%s", host, port);

// })