

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

var util = require('util');
// app.use(cookieParser())

var session = require('express-session');


var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
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
    cookie: { maxAge: 1000 * 1000 } //30 天免登陆
}));




app.get('/', function (req, res) {

    console.log("通过主页登录");
    if (req.session.username) {  //判断session 状态，如果有效，则返回主页，否则转到登录页面
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
    console.log("从主页跳转：get login，跳转到post login")
    res.sendFile(__dirname + "/public/" + "login.html");
})

app.get('/main', function (req, res) {
    console.log("从主页跳转get main")
    res.sendFile(__dirname + "/public/" + "main.html");
})

var user = []
app.post("/login", urlencodedParser, function (req, res) {
    var username = req.body.username;
    var pwd = req.body.password;

    pwd = hash(pwd);
    console.log("lofgin:", username, pwd);
    var db = new sqlite3.Database('./DATAB/TESTDB.db');
    db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {
        console.log("sss");
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
                res.sendFile(dir + 'main.html');
                req.session.username = username;
                user[user.length] = username;
                // console.log(req.session.username);
            }
            else {
                res.send("登录失败:密码错误！");
            }
        }
        db.close();
    });
})




var destination = [65, 65];
var tempdest = [65, 65];
var map = new Array();
var snake = []
//存储整个地图
for (var i = 0; i < 16; i++) {
    map[i] = new Array()
    for (var j = 0; j < 24; j++) {
        map[i][j] = 0;
    }

}
map[12][14] = 1;
map[12][13] = 1;
map[12][12] = 1;
var head = [[12, 12], [2, 12]];

snake[0] = [head[0], [12, 13], [12, 14]];
snake[1] = [head[1],[2,13],[2,14]];
var y = Math.ceil(((Math.random() * 24) % 24) - 1);
var x = Math.ceil(((Math.random() * 16) % 16) - 1);
map[x][y] = 5;
app.post('/Keys', urlencodedParser, function (req, res) {
    // map [2][3] =1;
    res.send(map);
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
    var tem = [[0, 0], [0, 0]];

    tem[num][0] = snake[num][len[num] - 1][0];
    tem[num][1] = snake[num][len[num] - 1][1];
    for (var i = len[num] - 1; i > 0; i = i - 1) {
        snake[num][i][0] = snake[num][i - 1][0];
        snake[num][i][1] = snake[num][i - 1][1];
    }


    // console.log(destination[num], tempdest);
    if (key_num[num] == 0) {
        if (tempdest[num] == 68) {//→
            if (destination[num] == 65) {
                key_num[num] = 0;
            }
            else {
                destination[num] = tempdest[num];
            }
        }
        if (tempdest[num] == 65) {//→
            if (destination[num] == 68) {
                key_num[num] = 0;
            }
            else {
                destination[num] = tempdest[num];
            }
        }
        if (tempdest[num] == 87) {//→
            if (destination[num] == 83) {
                key_num[num] = 0;
            }
            else {
                destination[num] = tempdest[num];
            }
        }
        if (tempdest[num] == 83) {//→
            if (destination[num] == 87) {
                key_num[num] = 0;
            }
            else {
                destination[num] = tempdest[num];
            }
        }


        key_num[num]++;
    }
    if (destination[num] == 65) {//→


        head[num][0] = head[num][0];
        head[num][1] = head[num][1] - 1;

    }
    if (destination[num] == 68) {//←

        head[num][0] = head[num][0];
        head[num][1] = head[num][1] + 1;

    }
    if (destination[num] == 83) {//↑

        head[num][0] = head[num][0] + 1;
        head[num][1] = head[num][1];

    }
    if (destination[num] == 87) {//↓

        head[num][0] = head[num][0] - 1;
        head[num][1] = head[num][1];

    }
    key_num[num] = 0


    // snake[num][snake[num].length][1]= ;
    snake[num][0] = head[num];
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 24; j++) {
            if (map[i][j] != 5&&map[i][j]==num+1) {
                map[i][j] = 0;
            }
        }

    }
    console.log(head[num]);
    if (head[num][0] < 0 || head[num][0] >= 16 || head[num][1] >= 24 || head[num][1] < 0) {
        console.log("失败")
    }
    if (map[head[num][0]][head[num][1]] == 5) {//吃子
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

setInterval(
    function move() {
        // console.log("move", head[num], snake[num]);

        getmap(0);
        getmap(1);
    }

    , 1000);

app.post('/data', urlencodedParser, function (req, res) {
    // for (var i = 0;i<16;i++){
    //     for(var j = 0;j<24;j++){
    //         if(map[i][j]==1){
    //             console.log(i,j)

    //         }
    //     }
    // }
    res.send(map);
    // console.log("key;")
    // console.log(req.body.keynum);

})

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);

})