
//存储蛇的位置
var snake = [];
var map = [];
var usernum ;
var username = [];
$(document).ready(function(){
    $("#repeat_password").mouseleave(function(){
    // alert($("#repeat_password").val());
        if ( ($("#repeat_password").val() != $("#password").val())
            &&$("#repeat_password").val()!='' )
        {
            var oUl =document.getElementById("add");
            // alert($("#repeat_password").val() );
            // alert($("#password").val() );
            var oLi = document.createElement('div');
            oLi.innerHTML="<div id  = 'error'>两次密码不一致！</div>";
            $("#rwepeat_password").val('') ;
            oUl.appendChild(oLi);
            $("#error").css("color","red");
        }
    });
    $("#repeat_password").mouseenter(function(){
        $("#error").hide();
    });
    $("body").keyup(function(event){
        $.post(
            '/Keys',
            {keynum: event.which},
            function(data,status){
                map = data[0].map;
                username = data[0].name;
                users = data[0].users;
                score = data[0].score;
                win = data[0].win;
                if(win!=undefined){
                    alert(win);
                }
                for(var i = 0;i<users.length;i++){
                    if(users[i]==username){
                        usernum = i;
                    }
                }
                // var outp = document.getElementById("#out1");
                // outp.innerHTML = score[i]+"分"
                $("#out1").empty();
                $("#out2").empty();
                $("#out1").append (score[0]+"分");
                $("#out2").append (score[1]+"分");
                console.log(i,score[usernum]);
                
            }
          );
    });
    // $("body").keyup(function(event){
    //     $.post(
    //         '/test',
    //         {keynum: event.which},
    //         function(data,status){
    //             map = data;
    //             console.log(map[0].map);
    //         }
    //       );
    // });
    $("#ready").click(function add(){
        // alert("OK");
        // for (var i = 0;i<2;i++){
        //     for(var j = 0;j<5;j++){
        //         if(map[i][j]==1){
        //             var addH = " <div id = 'food' style='left:"+i*20+"px;top:" +j*20+"px;'></div>"
        //             $("#map").append(addH)
        //         }
        //     }
        // }
        // var addH = " <div id = 'food' style='left:"+Math.ceil(((Math.random() * 24) % 24) - 1) * 20+"px;top:" +
        // Math.ceil(((Math.random() * 16) % 16) - 1) * 20+"px;'></div>"
        // $("#map").append(addH);
        // var x = Math.ceil(((Math.random() * 24) % 24) - 1) * 20;
        // var y = Math.ceil(((Math.random() * 16) % 16) - 1) * 20;
        // snake.push([x,y]);
        // addH = "<div id = 'snake' style='left:"+x+"px;top:" +y+"px;'></div>";
        // $("#map").append(addH);
        $.post(
            '/Ready',
            // function(data,status){
            //     map = data[0].map;
            //     username = data[0].name;
            //     users = data[0].users;
            //     score = data[0].score;
            //     for(var i = 0;i<users.length;i++){
            //         if(users[i]==username){
            //             usernum = i;
            //         }
            //     }
            //     // var outp = document.getElementById("#out1");
            //     // outp.innerHTML = score[i]+"分"
            //     $("#out1").empty();
            //     $("#out2").empty();
            //     $("#out1").append (score[0]+"分");
            //     $("#out2").append (score[1]+"分");
            //     console.log(i,score[usernum]);
                
            // }
          );
    });
    
    
});

function move(){
    // console.log("sss")
    $.post(
        '/data',
        function(data,status){
            map = data[0].map;
            win = data[0].win;
                if(win!=undefined){
                    alert(win);
                }
            $(".body1").remove();
            $(".body2").remove();
            $("#snake1").remove();
            for (var i = 0;i<16;i++){
                for(var j = 0;j<24;j++){
                    if(map[i][j]==1){
                        // console.log("snake1")
                        var addH = " <div id = 'ssss' class = 'body1' style='left:"+j*20+"px;top:" +i*20+"px;'></div>"
                        $("#map").append(addH);
                    }
                    if(map[i][j]==2){
                        // console.log("snake2")
                        var addH = " <div id = 'ssss' class = 'body2' style='left:"+j*20+"px;top:" +i*20+"px;'></div>"
                        $("#map").append(addH);
                    }
                    
                    if(map[i][j]==5){
                        // console.log(i,j)
                        var addH = " <div id = 'snake1'  style='left:"+j*20+"px;top:" +i*20+"px;'></div>"
                        $("#map").append(addH);
                    }
                    // else{
                    //     var addH = " <div id = 'snake1' style='left:"+j*20+"px;top:" +i*20+"px;'></div>"
                    //     $("#map").append(addH);
                    // }
                }
            }
        }
      );
}

setInterval('move()', 50);
