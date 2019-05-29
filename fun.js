
var w_i = 0;
var w_j = 0;
var a_i = 0;
var a_j = 0;
var s_i = 0;
var s_j = 0;
var d_i = 0;
var d_j = 0;
var destination = 'D';
// var start = 0;
function getspeed(){
	var level_d = document.getElementById('seltable');
    var index = level_d.selectedIndex;
    var val = level_d.options[index].value;
    if (val == "Easy"){
        return 200;
    }
    if (val == "Middle"){
        return 100;
	}
    if (val == "Hard"){
       	return 50;
    }
    else{
        return 400;
    }
}
var ekey = 87;
document.onkeydown =  function getDestination(evt){
    ekey = evt.keyCode;
    if (ekey==87){
        // console.log("wwww");
        destination ='W';
    }
    if (ekey==65){
        // console.log("AAA");
        destination ='A';
    }
    if (ekey==83){
        // console.log("SSS");
        destination ='S';
    }
    if (ekey==68){
        // console.log("DDD");
        destination= 'D';
    }
    else{
        // console.log("mmmm");
        destination = destination;
    }
}
function move(){
    var b = document.getElementById('snake'); 
    // console.log("1111");
    if (destination=='D'){
        b.style.left = (d_i%24)*20+'px';
        b.style.top = (d_j%16)*20+'px';
        
        if (d_i == 23)
            d_j = (d_j+1)%16;   
        d_i = (d_i+1)%24;
    }
    if (destination=='S'){
        b.style.left = (d_i%24)*20+'px';
        b.style.top = (d_j%16)*20+'px';
        
        if (d_j == 16)
            d_i = (d_i+1)%24;   
        d_j = (d_j+1)%16;
    }
    if (destination=='A'){
        b.style.left = (d_i%24)*20+'px';
        b.style.top = (d_j%16)*20+'px';
        
        if (d_i == 23)
            d_j = (d_j+1)%16;   
        d_i = (d_i-1)%24+24;
    }
    if (destination=='W'){
        b.style.left = (d_i%24)*20+'px';
        b.style.top = (d_j%16)*20+'px';
        
        if (d_j == 16)
            d_i = (d_i+1)%24;   
        d_j = (d_j-1)%16+16;
        // console.log(d_j);
    }
    var food_d = document.getElementById('food');
    f_j = food_d.style.left;
    f_i = food_d.style.top;
    // console.log(b);
    console.log(food_d.style.left);
    if((d_j%16)*20+'px'==f_j){
        if((d_i%24)*20+'px'==f_i){
            console.log("chi");
        }
    }




}
function start(){
    // var level_d = document.getElementById('seltable');
    // var index = levelu_d.selectedIndex;
    // var val = level_d.options[index].value;
    // if (val == "Easy"){
    //     startVar = window.setInterval("move()",200);
    // }
    // if (val == "Middle"){
    //     startVar = window.setInterval("move()",100);
    // }
    // if (val == "Hard"){
    //     startVar = window.setInterval("move()",50);
        // }
        
    startVar = window.setInterval("move()",getspeed());
}
function end(){
    clearInterval(startVar);
}

