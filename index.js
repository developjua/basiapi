const express = require("express");
const fs = require("fs");



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post('/login', (req, res) => {
    const readStream = fs.createReadStream('users.json');
    let data = '';
    readStream.on('data', (chunk) => {
      data += chunk;
    });
   
    readStream.on('end', () => {
      const users = JSON.parse(data);
      if (users[req.query.username] && users[req.query.username].email === req.query.email) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('credentials not availabe please signup');
      }
    });
  });
  
 app.post('/signup', (req, res) => {
    const readStream = fs.createReadStream('users.json');
    let data = '';
    readStream.on('data', (chunk) => {
      data += chunk;
    });
    readStream.on('end', () => {
      const users = JSON.parse(data);
      if (users[req.query.username]) {
        res.status(409).send('Username already exists');
      } else {
        console.log(req.query)
        console.log(users)
        users[req.query.username] = req.query;
        const writeStream = fs.createWriteStream('users.json');
        writeStream.write(JSON.stringify(users));
        writeStream.end();
        res.status(201).send('User created successfully');
      }
    });
  });
  
  app.get('/user/:username', (req, res) => {
    const readStream = fs.createReadStream('users.json');
    let data = '';
    readStream.on('data', (chunk) => {
      data += chunk;
    });
    readStream.on('end', () => {
      const users = JSON.parse(data);
      if (users[req.params.username]) {
        res.status(200).json(users[req.params.username]);
      } else {
        res.status(404).send('User not found');
      }
    });
  });


const listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
