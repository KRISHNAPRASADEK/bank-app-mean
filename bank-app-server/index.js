//import express inside here
const express = require("express");
// import cors
const cors = require("cors");

//create server app using express
const server = express();

//import jsonwebtoken
const jwt = require("jsonwebtoken");

//import dataservices
const dataService = require("./services/dataServices");

//use cors to define origin
server.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// to parse a json data
server.use(express.json());

//set up port for server app
server.listen(3000, () => {
  console.log("server started at 3000");
});

// application specific middleware
const appMiddleware = (req, res, next) => {
  console.log("inside application middleware");
  next();
};

server.use(appMiddleware);

// bankapp front end request resolving

//token verify middleware
const jwtMiddleware = (req, res, next) => {
  console.log("inside router specific middleware");
  //get token from req headers
  const token = req.headers["access-token"];
  console.log(token);
  try {
    //verify token
    const data = jwt.verify(token, "abcd");
    req.fromAcno = data.currentAcno;
    console.log("valid token");
    next();
  } catch {
    console.log("invalid token");
    res.status(401).json({
      message: "Please Login!",
    });
  }
};

//register api call

server.post("/register", (req, res) => {
  console.log("inside register api");
  console.log(req.body);
  //async
  dataService
    .register(req.body.uname, req.body.acno, req.body.pswd)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//login api call

server.post("/login", (req, res) => {
  console.log("inside login api");
  console.log(req.body);
  //async
  dataService.login(req.body.acno, req.body.pswd).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// get balance api call

server.get("/getBalance/:acno", jwtMiddleware, (req, res) => {
  console.log("inside getBalance api");
  console.log(req.params.acno);
  //async
  dataService.getBalance(req.params.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// deposit api call

// jwtmiddleare used to verify token during login
server.post("/deposit", jwtMiddleware, (req, res) => {
  console.log("inside deposit api");
  //async
  dataService.deposit(req.body.acno, req.body.amount).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// fund transfer api
server.post("/fundTransfer", jwtMiddleware, (req, res) => {
  console.log("inside fundtransfer api");
  console.log(req.body);
  dataService
    .fundTransfer(req, req.body.toAcno, req.body.pswd, req.body.amount)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

// transaction history
server.get("/all-transactions", jwtMiddleware, (req, res) => {
  console.log("inside getalltransactions api");
  dataService.getAllTransactions(req).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// requests are defined here
