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