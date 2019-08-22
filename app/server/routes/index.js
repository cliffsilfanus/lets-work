const express = require("express");
const app = express();
const models = require("../models");
const logger = require("morgan");
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

app.post("/logout", (req, res) => {
  try {
    req.session.destroy();
    return res.json({ success: true });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

app.get("/user/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const userExists = await models.User.findOne({ username });

    if (userExists) {
      return res.json({
        success: true,
        userId: userExists._id,
        message: `User ${username} exists!`
      });
    } else {
      return res.json({
        success: false,
        message: `User ${username} does not exist!`
      });
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

// Combines the common practice GET /me route within GET /dashboard
app.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json({
        success: false,
        message: "No user is currently logged in."
      });
    }
    const { fname, lname, username } = req.session.user;
    const boards = await models.Board.find({
      users: req.session.user._id
    }).populate("users", "username -_id");

    // Adjusts boards to only contain an array of usernames instead of
    // array of objects of usernames
    const adjustedBoards = boards.map(board => {
      // Obtain an array of just strings (usernames)
      const arrUsernames = board.users.map(user => {
        return user.username;
      });

      // Creates a new Board object with an array of usernames (not
      // including the current user)
      return Object.assign({}, board._doc, {
        users: arrUsernames.slice(0, arrUsernames.length - 1)
      });
    });

    return res.json({
      success: true,
      fname,
      lname,
      username,
      boards: adjustedBoards
    });
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

app.post("/dashboard", async (req, res) => {
  try {
    const { name, users } = req.body;

    const board = new models.Board({
      name,
      owner: req.session.user._id,
      users: [...users, req.session.user._id],
      projects: []
    });

    await board.save();

    return res.json({
      success: true,
      message: `Board "${name}" successfully created!`
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

app.get("/dashboard/:boardId", async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const board = await models.Board.findById(boardId).populate("projects");

    if (board) {
      const { projects } = board;

      return res.json({
        success: true,
        message: `Board ${boardId} successfully loaded!`,
        projects
      });
    }

    return res.json({ success: false, message: `Board ${boardId} not found!` });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

// Creates a new project for board
app.post("/dashboard/:boardId", async (req, res) => {
  try {
    const boardId = req.params.boardId;
    const { name } = req.body;

    const board = await models.Board.findById(boardId).populate("projects");

    const project = new models.Project({
      name,
      headers: [],
      tasks: []
    });

    await project.save();

    board.projects = [...board.projects, project];

    await board.save();

    return res.json({
      success: true,
      message: `Project ${name} successfully created!`,
      projects: board.projects
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

app.post("/dashboard/:projectId/column", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { addedColumn } = req.body;

    const project = await models.Project.findById(projectId).populate("tasks");

    project.headers = [...project.headers, addedColumn];
    // project.tasks.map(taskObj => {
    //   const columnKey = addedColumn.toLowerCase();
    //   return { ...taskObj, [columnKey]: "" };
    // });

    console.log(project);

    await project.save();

    return res.json({
      success: true,
      message: `Column ${addedColumn} successfully added!`,
      project
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

app.post("/dashboard/:projectId/row", async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await models.Project.findById(projectId).populate("tasks");

    // Creates default task with no values
    let task = new models.Task({ name: "", status: "", priority: "" });
    await task.save();
    project.tasks.push(task);

    console.log(project);

    await project.save();

    return res.json({
      success: true,
      message: `Row successfully added!`,
      project
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

app.get("/projects/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await models.Project.findById(projectId).populate("tasks");

    return res.json({
      success: true,
      project
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.json({
      success: false,
      message: `Something went wrong on our end! Please try again!`
    });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("Listening on %s", port);
});
