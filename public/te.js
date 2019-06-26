var express = require('express');
var app = express();

app.use(express.static('public'));
app.post('/test', urlencodedParser,function(){
    res.send("sss")
}
)
app.listen(8081, () => {
    console.log('start: 5000')
})