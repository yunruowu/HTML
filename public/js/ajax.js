function ajax(url, fnSucc, fnFaild) {
    console.log("ssssssss")
    var oAjax = new XMLHttpRequest();
    alert(url)
    oAjax.open('GET', url, true);
    oAjax.send();
    oAjax.onreadystatechange = function () {
        if (oAjax.readyState == 4) {
            if (oAjax.status == 200) {
                fnSucc(oAjax.responseText);
            }
            else {
                if (fnFaild) {
                    console.log(this.status)
                    fnFaild(oAjax.status);
                }
            }
        }
    };
}