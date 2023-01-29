const express = require("express");
const session = require("express-session");
const store = new session.MemoryStore();
const app = express();

app.use(
  session({
    secret: "some secret",
    cookie: { maxAge: 30000 },
    saveUninitialized: false,
    resave: true,
    store,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const users = [
  { name: "jame", age: 30 },
  { name: "john", age: 21 },
  { name: "kelvin", age: 20 },
];

const posts = [{ title: "My favorite foods" }, { title: "My favorite games" }];

app.use((req, res, next) => {
  console.log(store);
  console.log(`${req.method} - ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send({
    msg: "Hello World",
    user: {},
  });
});

app.post("/", (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).send("Created user");
});

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.get("/users/:name", (req, res) => {
  const { name } = req.params;
  const user = users.find((user) => user.name === name);
  if (user) res.status(200).send(user);
  else res.status(404).send("Not found");
});

app.get("/posts", (req, res) => {
  const { title } = req.query;
  if (title) {
    const post = posts.find((post) => post.title === title);
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(404).send("Not Found");
    }
  }
  res.status(200).send(posts);
});

function validationAuthToken(req, res, next) {
  const { authorization } = req.headers;
  if (authorization && authorization === "123") {
    next();
  } else {
    res.status(403).send({ msg: "Forbidden. Incorrect Credentials" });
  }
}

app.post("/posts", validationAuthToken, (req, res) => {
  const post = req.body;
  posts.push(post);
  res.status(201).send(posts);
});

function validateCookie(req, res, next) {
  const { cookies } = req;
  if ("session_id" in cookies) {
    console.log("Session ID Exists.");
    if (cookies.session_id === "123456") {
      next();
    } else {
      res.status(403).send({ msg: "Not Authenticated." });
    }
  } else {
    res.status(403).send({ msg: "Not Authenticated." });
  }
}

app.get("/signin", (req, res) => {
  res.cookie("session_id", "123456");
  res.status(200).json({ msg: "Logged In." });
});

app.get("/protected", validateCookie, (req, res) => {
  res.status(200).json({ msg: "You are Authorized!" });
});

app.post("/login", (req, res) => {
  console.log(req.sessionID);
  const { username, password } = req.body;
  if (username && password) {
    if (req.session.authenticated) {
      res.json(req.session);
    } else {
      if (password === "123") {
        req.session.authenticated = true;
        req.session.user = {
          username,
          password,
        };
        res.json(req.session);
      } else {
        res.status(403).json({ msg: "Bad Credentials." });
      }
    }
  } else {
    res.status(403).json({ msg: "Bad Credentials." });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
