var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mysql     =    require('mysql');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//mysql connections
var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'qp',
    debug    :  false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'public')));

//index page
app.get('/',function(req,res){
      console.log('index page directed');
      res.render('index');
});


//dumping data
function handle_database(req,res,data1) {
console.log('here');
pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }  

        console.log('connected as id ' + connection.threadId);
       
        connection.query('select * from question',function(err,rows){
            connection.release();
            if(!err) {
                console.log('done');
                var i;
                var duration = 0;
                var for_done = 0;
                data1 *= 60;


                //console.log("data1 is :"+ data1);
                //console.log("rows.length : "+rows.length);
/*rows.forEach(function(r){
  duration+=r.qduration;
});*/

                for(i=0;i<rows.length;i++){
                  duration += rows[i].qduration;
                  //console.log("duration is "+duration)
                  if(duration <= data1){
                    //console.log("duration = " + duration);                    
                  }
                  else{
                    for_done = 1;
                    break;
                  }
                  if(i==(rows.length-1)){
                    for_done = 1;
                  }

                }

                if(for_done==1){

                //i=i-1;                
                //console.log("i is : ", i);
                //console.log("duration is : ", duration);

                var data = [];

                for(j=0;j<i;j++){ 
                  var x= {};
                  x = rows[j];  
                  //console.log(x);               
                  data.push(x);
                  console.log(data.length);
                }  
                console.log(data);
                console.log(data[1].qtext);

                res.render('question_paper',{data  : data});

                }
                
          }

       });

        connection.on('error', function(err) {      
              //res.json({"code" : 100, "status" : "Error in connection database"});
              return;    
        });
  });
}







//getting data from index page and rendering question paper page

app.post('/question_paper',function(req,res){
   var data = req.body.duration;
   console.log("data of duration : " + data);
   handle_database(req,res,data);
 
});



app.listen(3010);

module.exports = app;
