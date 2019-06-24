
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

var cookieParser = require('cookie-parser')
var util = require('util');
app.use(cookieParser())

var session = require('express-session');



var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//   
var path = require('path');
// console.log(path)
app.use(express.static(path.join(__dirname, 'public')));
// var dir = __dirname+'/public/';
// // app.use('/public', express.static('public'));

// app.use('/public', express.static('public'));

function hash(str){
    let md5 = crypto.createHash('md5');
    md5.update(str); // update数据
    let result = md5.digest('hex'); // 十六进制输出
    return result;

}



app.use(session({
    secret: 'dev',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1*1000 } //30 天免登陆
}));




app.get('/', function (req, res) {
    console.log("zhuye")
    if(req.session.username){  //判断session 状态，如果有效，则返回主页，否则转到登录页面
        res.render('index.html',{username : req.session.username});
    }else{
        res.redirect('login');
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
    console.log("zhuye")
    // if(req.session.username){  //判断session 状态，如果有效，则返回主页，否则转到登录页面
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
    res.sendFile(dir +'login.html')
});


//注册一个账户，如果已经存在进行登录
app.post("/register",  urlencodedParser, function (req, res) {
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
            console.log(__dirname)
            res.sendFile(dir +'login.html')
        }
        // 未注册 
        else {
            db.serialize(function () {
                //向数据库写入注册信息
                console.log("用户不存在,注册新用户！");
                ped = hash(pwd);
                db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, pwd]);
                console.log("注册成功！")
            });
            res.sendFile(dir +'login.html')
        }
        db.close();
    });
    // res.send(" 用户已注册");
})


app.get('/login',function(req,res){
    console.log("get login")
    res.sendFile( __dirname + "/public/" + "login.html" );
})



app.post("/login", urlencodedParser,function (req, res) {
    var username = req.body.username;
    var pwd = req.body.password;
    pwd = hash(pwd);
    console.log("Register:", username, pwd);
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
            if(row.password==pwd){
                // res.send("登录成功");
                
                // res.sendFile('/HTML/snake/theme.css');
                // res.sendFile('/HTML/snake/fun.js');
                console.log(__dirname)
                // res.sendFile(dir +'index.html');?
                req.session.username = username;
                res.render('/');
            }
            else{
                res.send("登录失败:密码错误！");
            }
        }
        db.close();
    });
})

var server = app.listen(8081, function () {
 
    var host = server.address().address
    var port = server.address().port
   
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
   
  })