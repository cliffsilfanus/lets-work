const express = require("express");
const app = express();
const models = require("../models");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const server = require("http").Server(app);
const bcrypt = require("bcrypt");
const cors = require("cors");
// const io = require("socket.io")(server);

/* Middleware Setup */

app.use(logger("dev"));
const whitelist = ["http://localhost:8080"];
app.use(
  cors({
    origin: function(origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allows session info to be stored in MongoDB
app.use(
  session({
    secret: process.env.SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    proxy: true,
    saveUninitialized: true,
    resave: true
  })
);

// Helper function: runs middleware only at specified paths
const unless = (path, middleware) => {
  return (req, res, next) => {
    if (path.includes(req.path)) {
      return next();
    }
    return middleware(req, res, next);
  };
};

// Checks to see if user has an existing session
const validateSession = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({ success: false, message: "not logged in" });
    return;
  } else {
    next();
  }
};

// Checks existing session unless user is in following paths
app.use(unless(["/", "/login", "/signup"], validateSession));

app.post("/signup", async (req, res) => {
  // Checks if username exists in database
  try {
    const { fname, lname, username, password, repPassword } = req.body;
    let errorJson = { success: false, message: [] };

    if (password !== repPassword) {
      errorJson.message.push(`Passwords do not match`);
    }

    const userExists = await models.User.findOne({ username });
    if (userExists) {
      errorJson.message.push(`Username "${username}" already exists!`);
    }

    if (errorJson.message.length !== 0) return res.json(errorJson);

    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const user = new models.User({
      fname,
      lname,
      username,
      password: hashedPass
    });

    await user.save();

    return res.json({
      success: true,
      message: [`User "${username}" successfully created!`]
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: [`Something went wrong on our end! Please try again!`]
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await models.User.findOne({ username });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        req.session.user = user;
        return res.json({
          success: true,
          message: `User ${username} successfully logged in!`,
          userId: user._id
        });
      }
    }

    return res.json({
      success: false,
      message: `Email or password is incorrect`
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

app.get("/login", (req, res) => {
  console.log(req.session);
  if (!req.session.user) {
    return res.json({ session: false });
  }
  return res.json({ session: true, userId: req.session.user._id });
});

// app.get("/dashboard", async (req, res) => {
//   try {
//     const user = await models.User.findById(req.session._id);
//     const boards = await models.Board.find({ users: req.session._id });

//     boards = boards.map(board => {
//       return { id: board._id, name: board.name, users: board.users };
//     });

//     return res.json({ success: true, user, boards });
//   } catch (err) {
//     console.log(`Error: ${err}`);
//     return res.json({
//       success: false,
//       message: `Something went wrong on our end! Please try again!`
//     });
//   }
// });

const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("Listening on %s", port);
});
