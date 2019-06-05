var d_i = 0;
var d_j = 0;
var destination = 'D';
// var start = 0;
function getspeed(){
	var level_d = document.getElementById('seltable');
    var index = level_d.selectedIndex;
    var val = level_d.options[index].value;
    if (val == "Easy"){
        return 20;
    }
    if (val == "Middle"){
        return 100;
	}
    if (val == "Hard"){
       	return 20;
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
        if(destination =='S')
        {
            destination =='S'
        }
        else{
            destination ='W';
        }
    }
    if (ekey==65){
        // console.log("AAA");
        if(destination =='D')
        {
            destination =='D'
        }
        else{
            destination ='A';
        }
        // destination ='A';
    }
    if (ekey==83){
        // console.log("SSS");
        if(destination =='W')
        {
            destination =='W'
        }
        else{
            destination ='S';
        }
        // destination ='S';
    }
    if (ekey==68){
        // console.log("DDD");
        if(destination =='A')
        {
            destination =='A'
        }
        else{
            destination ='D';
        }
        // destination= 'D';
    }
    else{
        // console.log("mmmm");
        destination = destination;
    }
}
function move(){
    var b = document.getElementById('snake'); 
    // console.log("1111");
    var pre_i = d_i;
    var pre_j = d_j;
    if (destination=='D'){
        // b.style.left = (d_i%24)*20+'px';
        // b.style.top = (d_j%16)*20+'px';
        if (d_i == 23){
            end();
            alert("over");  
        }else{
            d_i = (d_i+1)%24;
        }   
       
    }
    if (destination=='S'){
        // b.style.left = (d_i%24)*20+'px';
        // b.style.top = (d_j%16)*20+'px';
        
        if (d_j == 15)        {
            end();
            alert("over");
     
        }else{
            d_j = (d_j+1)%16;
        } 
        
    }
    if (destination=='A'){
        // b.style.left = (d_i%24)*20+'px';
        // b.style.top = (d_j%16)*20+'px';
        if (d_i == 0){
            end();
            alert("over");  
        }else{
            d_i = (d_i-1)%24;
        }   
        // if (d_i == 23)
        //     d_j = (d_j+1)%16;   
        // d_i = (d_i-1)%24+24;
    }
    if (destination=='W'){
        if (d_j == 0){
            end();
            alert("over");
        }else{
            d_j = (d_j-1)%16;
        } 
        
        
        // console.log(d_j);
    }
    b.style.left = (d_i%24)*20+'px';
    b.style.top = (d_j%16)*20+'px';
    var food_d = document.getElementById('food');
    f_i = food_d.style.left;
    f_j = food_d.style.top;
    // console.log(b);
    console.log(food_d.style.left);
    if((pre_j%16)*20+'px'==f_j){
        if((pre_i%24)*20+'px'==f_i){
            food_d.style.left = Math.ceil(((Math.random()*24)%24)-1)*20+'px';
            food_d.style.top = Math.ceil(((Math.random()*16)%16)-1)*20+'px';
            console.log("dsdsd");
            console.log(food_d.style.left);
        }
    }




}
var sta_or_end = 0;
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
    if(sta_or_end==0)
    {
        startVar = window.setInterval("move()",getspeed());
        sta_or_end = 1;
    }
}
function end(){
    if(sta_or_end==1){

        clearInterval(startVar);
        sta_or_end = 0;
    }
    
}

