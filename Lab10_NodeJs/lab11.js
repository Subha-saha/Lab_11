const express = require("express");
var cors = require("cors");
const fs = require("fs");
var mysql = require('mysql2');

// connecting to database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Subha@123',
  database: 'library'
});


connection.connect((err) => {
  if (err) { console.log("DB Connection Failed."); return }

  // Initializing Express Server
  const app = express();
  app.use(cors({
    origin: "*",
  }));


  //Routes/Apis
  app.use("/readFile", async (req, res) => {
    res.end(await fs.readFileSync("./data.json"))
  });


  // display
  app.get("/library", (req, res) => {
    connection.query("SELECT * FROM readers;", (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // search
  app.get("/library/:user_id", (req, res) => {
    if (!req.params.user_id) {
      res.json({ error: "Id required" })
      return
    }
    var tnro = req.params.user_id
    connection.query("SELECT * FROM library WHERE user_id = " + tnro, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // // add 
  app.get("/email_id", (req, res) => {
    if (!req.query.email_id) {
      res.json({ error: "Email_ID required" })
      return
    }

    if (!req.query.First_name) {
      res.json({ error: "First Name not filled" })
      return
    }
    if (!req.query.Last_name) {
      res.json({ error: "Last name not filled" })
      return
    }
    if (!req.query.user_id) {
      res.json({ error: "User ID needed" })
      return
    }
    if (!req.query.Phone_no) {
      res.json({ error: "Phone number invalid" })
      return
    }
    if (!req.query.Address) {
      res.json({ error: "Address required" })
      return
    }

    connection.query(`INSERT INTO library(email_id,First_name,Last_name,user_id,Phone_no,Address) ` +
      `VALUES(${req.query.email_id},'${req.query.First_name}','${req.query.Last_name}','${req.query.user_id}','${req.query.Phone_no}','${req.query.Address}')`,
      (err, results, fields) => {
        if (err) return res.json({ error: err.message })
        res.json(results)
      })
  })

  // // update
  app.get("/updatename", (req, res) => {
    if (!req.query.First_name) {
      res.json({ error: "First_name required" })
      return
    }
  
    var First_name = req.query.First_name
    var Last_name = req.query.Last_name
    connection.query(`UPDATE readers SET First_name = '${First_name}' WHERE Address ='Odisha'`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })

  // delete
  app.get("/deleteuser", (req, res) => {
    if (!req.query.user_id) {
      res.json({ error: "User id required" })
      return
    }

    var fno = req.query.user_id
    connection.query(`DELETE FROM library WHERE user_id = ${user_id}`, (err, results, fields) => {
      if (err) return res.json({ error: err.message })
      res.json(results)
    })
  })


  //Port
  const port = 8000;

  //Starting a server
  app.listen(port, () => {
    console.log(`* SERVER STARTED AT PORT ${port} *`);
  });

})