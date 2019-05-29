document.onkeydown = function(e){
                console.log(e.keyCode);
                document.getElementById('demo').innerHTML = e.keyCode;
}

