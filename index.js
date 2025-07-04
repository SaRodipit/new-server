const mysql = require("mysql2");
const express = require("express");

const app = express();
const urlencodedParser = express.urlencoded({extended: false});

// Настройка подключения к базе данных
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "ChatBotTests",
  password: ""
});

// Middleware для обработки JSON
app.use(express.json());

// 1. Получить все items (GET)
app.get("/getAllItems", function(req, res) {
  pool.query("SELECT * FROM Items", function(err, data) {
    if(err) {
      console.log(err);
      return res.json(null);
    }
    res.json(data);
  });
});

// 2. Добавить новый item (POST)
app.post("/addItem", urlencodedParser, function(req, res) {
  if(!req.body) return res.sendStatus(400);
  
  const name = req.query.name || req.body.name;
  const desc = req.query.desc || req.body.desc;
  
  if(!name || !desc) return res.json(null);
  
  pool.query(
    "INSERT INTO Items (name, `desc`) VALUES (?, ?)", 
    [name, desc], 
    function(err, data) {
      if(err) {
        console.log(err);
        return res.json(null);
      }
      
      pool.query(
        "SELECT * FROM Items WHERE id = ?", 
        [data.insertId], 
        function(err, newItem) {
          if(err || !newItem.length) {
            console.log(err);
            return res.json({});
          }
          res.json(newItem[0]);
        }
      );
    }
  );
});

// 3. Удалить item (POST)
app.post("/deleteItem", urlencodedParser, function(req, res) {
  if(!req.body) return res.sendStatus(400);
  
  const id = req.query.id || req.body.id;
  
  if(!id || isNaN(id)) return res.json(null);
  
  pool.query(
    "SELECT * FROM Items WHERE id = ?", 
    [id], 
    function(err, item) {
      if(err) {
        console.log(err);
        return res.json(null);
      }
      
      if(!item.length) return res.json({});
      
      pool.query(
        "DELETE FROM Items WHERE id = ?", 
        [id], 
        function(err) {
          if(err) {
            console.log(err);
            return res.json(null);
          }
          res.json(item[0]);
        }
      );
    }
  );
});

// 4. Обновить item (POST)
app.post("/updateItem", urlencodedParser, function(req, res) {
  if(!req.body) return res.sendStatus(400);
  
  const id = req.query.id || req.body.id;
  const name = req.query.name || req.body.name;
  const desc = req.query.desc || req.body.desc;
  
  if(!id || isNaN(id) || !name || !desc) return res.json(null);
  
  pool.query(
    "SELECT * FROM Items WHERE id = ?", 
    [id], 
    function(err, item) {
      if(err) {
        console.log(err);
        return res.json(null);
      }
      
      if(!item.length) return res.json({});
      
      pool.query(
        "UPDATE Items SET name = ?, `desc` = ? WHERE id = ?", 
        [name, desc, id], 
        function(err) {
          if(err) {
            console.log(err);
            return res.json(null);
          }
          
          pool.query(
            "SELECT * FROM Items WHERE id = ?", 
            [id], 
            function(err, updatedItem) {
              if(err) {
                console.log(err);
                return res.json(null);
              }
              res.json(updatedItem[0]);
            }
          );
        }
      );
    }
  );
});

// Запуск сервера
app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});