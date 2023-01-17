// register
const db = require("./db");
//import jsonwebtoken
const jwt = require("jsonwebtoken");

// differnt port n/w so async fn
const register = (uname, acno, pswd) => {
  console.log("Inside register function in dataservice");
  //find acno is in mongodb // db.users.findOne()
  return db.User.findOne({ acno }).then((result) => {
    console.log(result);
    if (result) {
      //acnt already exists
      return {
        statusCode: 403,
        message: "Account Already Exists",
      };
    } else {
      // to add new user
      const newUser = new db.User({
        username: uname,
        acno,
        password: pswd,
        balance: 0,
        transaction: [],
      });
      // to save new user in mongodb use save()
      newUser.save();
      return {
        statusCode: 200,
        message: "Registration Successful",
      };
    }
  });
};

//login
const login = (acno, pswd) => {
  console.log("Inside login function in dataservice");
  // check acno pswd in mongodb
  return db.User.findOne({
    acno,
    password: pswd,
  }).then((result) => {
    if (result) {
      //generate token
      const token = jwt.sign({ currentAcno: acno }, "abcd");
      return {
        statusCode: 200,
        message: "Login Successful",
        username: result.username,
        currentAcno: acno,
        token,
      };
    } else {
      return {
        statusCode: 403,
        message: "Invalid Account / Password",
      };
    }
  });
};

const getBalance = (acno) => {
  console.log("Inside getBalance function in dataservice");
  return db.User.findOne({
    acno,
  }).then((result) => {
    if (result) {
      return {
        statusCode: 200,
        balance: result.balance,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid Account",
      };
    }
  });
};

const deposit = (acno, amt) => {
  console.log("Inside deposit function in dataservice");
  let amount = Number(amt);

  return db.User.findOne({
    acno,
  }).then((result) => {
    if (result) {
      // acno is present in db
      result.balance += amount;

      // to update in mongodb
      result.save();
      return {
        statusCode: 200,
        message: `${amount} successfully deposited..`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid Account",
      };
    }
  });
};

//fundTransfer
const fundTransfer = (req, toAcno, pswd, amt) => {
  let amount = Number(amt);
  let fromAcno = req.fromAcno;
  return db.User.findOne({
    acno: fromAcno,
    password: pswd,
  }).then((result) => {
    console.log(result);
    if (result) {
      // debit account detailes

      let fromAcnoBalance = result.balance;

      if (fromAcnoBalance >= amount) {
        result.balance = fromAcnoBalance - amount;
        // credit account detailes
        return db.User.findOne({
          acno: toAcno,
        }).then((creditData) => {
          if (creditData) {
            // credit acno is present in db
            creditData.balance += amount;
            // to update in mongodb
            creditData.save();
            console.log(creditData);
            result.save();
            console.log(result);
            return {
              statusCode: 200,
              message: "Fund Transfered Successfully",
            };
          } else {
            return {
              statusCode: 401,
              message: "Invalid Credit Account Number",
            };
          }
        });
      } else {
        console.log(fromAcnoBalance + ", " + amount);
        return {
          statusCode: 403,
          message: "Insufficient Balance",
        };
      }
    } else {
      return {
        statusCode: 401,
        message: "Invalid Debit Account Number / Password",
      };
    }
  });
};

module.exports = {
  register,
  login,
  getBalance,
  deposit,
  fundTransfer,
};
