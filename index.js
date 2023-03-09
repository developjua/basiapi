const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.urlencoded(extended = false));

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const usersData = fs.readFileSync('users.json');
  const users = JSON.parse(usersData);

  const user = users.find((u) => u.email === email);

  if (!user) {

    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }


  res.send('login succesful');
});



app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }
  if (password.length > 8) {
    return res.status(400).json({ message: 'Password must be at most 8 characters long' });
  }
  fs.access('users.json', fs.constants.F_OK, (err) => {
    if (err) {
    
      const newUser = { id: 1, name, email, password };
      const usersData = JSON.stringify([newUser]);
      fs.writeFileSync('users.json', usersData);
      return res.status(201).json({ message: 'User created successfully' });
    }
    const usersData = fs.readFileSync('users.json');
    const users = JSON.parse(usersData);

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const userId = users.length + 1;

    const newUser = { id: userId, name, email, password };
    users.push(newUser);
    const updatedUsersData = JSON.stringify(users);
    fs.writeFileSync('users.json', updatedUsersData);
    res.status(201).json({ message: 'User created successfully' });
  });
});

app.get('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const usersData = fs.readFileSync('users.json');
  const users = JSON.parse(usersData);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const userDetails = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  res.json(userDetails);
});

 

const listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
