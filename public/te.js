var ws = require("ws"); // 加载ws模块;

// 启动websocket服务器
var wsServer = new ws.Server({
    host: "127.0.0.1",
    port: 8081,
});
console.log('WebSocket sever is listening at port localhost:8183');

// 建立连接，监听客户端请求，绑定对应事件;
function on_server_client_comming (wsObj) {
    console.log("request comming");
    websocket_add_listener(wsObj);
}
wsServer.on("connection", on_server_client_comming);

// 各事件处理逻辑
function websocket_add_listener(wsObj) {
    wsObj.on("message", function(data) {
        console.log("request data:"+data);
        setTimeout(()=>{ //收到请求，回复
            wsObj.send("1秒延时，收到了，正在处理");
        },1000);
        /*****
         * 处理业务逻辑
         */
        setTimeout(()=>{ //完成请求，回复
            wsObj.send("3秒延时，返回数据，关闭连接");
            wsObj.close()
        },3000);
    });

    wsObj.on("close", function() {
        console.log("request close");
    });

    wsObj.on("error", function(err) {
        console.log("request error", err);
    });
}
