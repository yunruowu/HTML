var d_i = 0;
var d_j = 0;
var destination = 'D';
var score_play1 = 0;
// var start = 0;
function getspeed(){
	var level_d = document.getElementById('seltable');
    var index = level_d.selectedIndex;
    var val = level_d.options[index].value;
    if (val == "Easy"){
        return 200 - score_play1/5*50;
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

function tail_pos(head){
    var b = document.getElementsByClassName("body");
    // console.log(b);
    // var i =0 ;
   // console.log(b.length);
    var tail =[];
    if(b.length == 0){
        tail[0]=head.style.top;
        tail[1]=head.style.left;
    }else
    {
        
        tail[0]=b[0].style.top;
        tail[1]=b[0].style.left;
    }
    return tail;
}

function body(head){
    var b = document.getElementsByClassName("body");
    // console.log(b);
    var i =b.length-1;
    // var tail =[];
    for(;i>=0;i=i-1)
    {
        if (i==0)
        {
            b[0].style.left = head.style.left;        
            b[0].style.top = head.style.top;
        }else{
            b[i].style.left = b[i-1].style.left;        
            b[i].style.top = b[i-1].style.top;
        }
    }
}


function hit_body(head){
    var b = document.getElementsByClassName("body");
    var i = head.style.left;
    var j = head.style.top;
    if(b.length>3){
        var num=0;
        for(;num<b.length;num++){
            if(b[num].style.left == i){
                if(b[num].style.top == j){
                    end();
                alert("over");
                }
            }
        }
    }
}

function move(){
    console.log(getspeed(),score_play1)
    var b = document.getElementById('snake'); 
    // console.log("1111");
    var pre_i = d_i;
    var pre_j = d_j;
    var snakenode =[];
    var tail = tail_pos(b);
   // console.log("ssssssssssss");
  //  console.log(tail);
    
   // console.log(tail);
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

    hit_body(b);


    body(b);
    // body(b);
    b.style.left = (d_i%24)*20+'px';
    b.style.top = (d_j%16)*20+'px';
    var food_d = document.getElementById('food');
    var snake2 = document.getElementById('map');
    
    f_i = food_d.style.left;
    f_j = food_d.style.top;
    // console.log(b);
    // console.log(food_d.style.left);
    if((pre_j%16)*20+'px'==f_j){
        if((pre_i%24)*20+'px'==f_i){
            
           // console.log(f_j,f_i);
            
            //console.log(tail);
            score_play1++;
            food_d.style.left = Math.ceil(((Math.random()*24)%24)-1)*20+'px';
            food_d.style.top = Math.ceil(((Math.random()*16)%16)-1)*20+'px';
           // console.log("dsdsd");
           // console.log(food_d.style.left);
            snakenode.push(food_d);
            var newnode = document.createElement("div");
            newnode.id= "snake1";
            newnode.className = "body";
            newnode.style.color = "black";
            newnode.style.top = tail[0];
            newnode.style.left = tail[1];
            newnode.style.width =  20 +"px";
            newnode.style.height =  20 +"px";
            newnode.style.position="absolute;z-index:10";
            snake2.appendChild(newnode);
        }
    }
    var out1_play1 = document.getElementById("out1");
    out1_play1.innerHTML = score_play1 + "分";

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

