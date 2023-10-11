let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let mysql = require("mysql");
let connData = {
  host : "localhost",
  user : "root",
  password : "",
  database : "testDB",
};

app.get("/svr/employees",function(req,res) {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees";
  connection.query(sql,function(err,result) {
    if(err) console.log("Error in Database",err);
    else res.send(result);
  });
});

app.get("/svr/employee/:empCode",function(req,res) {
  let code = +req.params.empCode;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees WHERE empCode=?";
  connection.query(sql,code,function(err,result) {
    if(err) console.log(err);
    else res.send(result);
  });
});

app.get("/svr/employees/department/:dept",function(req,res) {
  let dept = "" + req.params.dept;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees WHERE department=?";
  connection.query(sql,dept,function(err,result) {
    if(err) console.log(err);
    else res.send(result);
  });
});

app.get("/svr/employees/designation/:desg",function(req,res) {
  let desg = "" + req.params.desg;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees WHERE designation=?";
  connection.query(sql,desg,function(err,result) {
    if(err) console.log(err);
    else res.send(result);
  });
});

app.get("/svr/employees/gender/:gender",function(req,res) {
  let gender = "" + req.params.gender;
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM employees WHERE gender=?";
  connection.query(sql,gender,function(err,result) {
    if(err) console.log(err);
    else res.send(result);
  });
});

app.post("/svr/employee",function(req,res) {
  let body = req.body;
  let params = [body.empCode,body.name,body.department,body.designation,body.salary,body.gender];
  let connection = mysql.createConnection(connData);
  let sql = "INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES(?,?,?,?,?,?);";
  connection.query(sql,params,function(err,result) {
    if(err) console.log(err);
    else {
      console.log(result);
      let sql = "SELECT * FROM employees WHERE empCode=?";
      connection.query(sql,result.insertId,function(err,result) {
        if(err) console.log("Error in Database",err);
        else res.send(result);
      });
    }
  });
});

app.put("/svr/employee/:empCode",function(req,res) {
  let code = +req.params.empCode;
  let body = req.body;
  let arr = [body.name,body.department,body.designation,body.salary,body.gender,code];
  let connection = mysql.createConnection(connData);
  let sql1 = "UPDATE employees SET name=?,department=?,designation=?,salary=?,gender=? WHERE empCode=?";
  connection.query(sql1,arr,function(err,result) {
    if(err) console.log(err);
    else {
      let sql2 = "SELECT * FROM employees WHERE empCode=?";
      connection.query(sql2,code,function(err,result) {
        if(err) console.log(err);
        else res.send(result);
      });
    }
  });
});

app.delete("/svr/employees/:empCode",function(req,res) {
  let code = +req.params.empCode;
  let connection = mysql.createConnection(connData);
  let sql = "DELETE FROM employees WHERE empCode=?";
  connection.query(sql,code,function(err,result) {
    if(err) console.log(err);
    else {
      console.log(result);
      res.send(result);
    }
  });
});