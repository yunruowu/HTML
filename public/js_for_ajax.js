/* 用于客户端和服务器的通信，利用ajax */
function fS(item) {
    var arr = eval(item);
    // alert(arr[0])
    for (var i = 0; i < arr.length; i++) {
        var oUl = document.getElementById('play1');
        var oLi = document.createElement('span');

        // oLi.innerHTML = '姓名：<span>' + arr[i].user + '</span> '
        // 性别：<span>' + arr[i].sex + '</span> 年龄：<span>' + arr[i].age + '</span>';
        oLi.innerHTML = '<span style:left: -10%>' + arr[i].user + '</span>';
        //将创建好的li元素插入到ul中
        oUl.appendChild(oLi);
    }

var snake2 = document.getElementById('map');
    var s_food = document.createElement('div');
    s_food.innerHTML = '<div id = food,left:40px;top:40px ></div>';
    alert("asss")
    var newnode = document.createElement("div");
    newnode.id = "snake1";
    newnode.className = "body";
    newnode.style.color = "black";
    newnode.style.top = 22220;
    newnode.style.left =30;
    newnode.style.width = 20 + "px";
    newnode.style.height = 20 + "px";
    newnode.style.position = "absolute;z-index:10";
    snake2.appendChild(s_food);

}
function fF(status) {
    alert("shibai");
}

function ajax(url) {
    var oAjax = new XMLHttpRequest();
    oAjax.open('GET', url, true);

    oAjax.send();
    oAjax.onreadystatechange = function () {
        if (oAjax.readyState == 4) {
            if (oAjax.status == 200) {
                // alert(oAjax.responseText)
                fS(oAjax.responseText);
            }
            else {
                if (fF) {
                    fF(oAjax.status);
                }
            }
        }
    };

}