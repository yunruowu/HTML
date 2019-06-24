
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
            $("#repeat_password").val('') ;
            oUl.appendChild(oLi);
            $("#error").css("color","red");
        }
    });
    $("#repeat_password").mouseenter(function(){
        $("#error").hide();
    });
});
