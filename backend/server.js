import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

const Users = [];
const Accounts = [];
const Sessions = [];

//routes endpoints

app.post("/users", (req, res) => {
  const { username, password } = req.body;
  const newUser = { username, password };
  Users.push(newUser);
  const newAccount = { username, balance: 0 };
  Accounts.push(newAccount);
  // res.send("User created successfully." + JSON.stringify(newAccount));
  res.status(201).json({ message: "User created successfully." });
  console.log(Users, Accounts);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = Users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    const otp = generateOTP();
    Sessions.push({ username, otp });
    res.status(200).json({ otp });
  } else {
    res.status(401).json({ message: "Invalid username or password." });
  }
  console.log(Users, Sessions);
});

app.post("/accounts", (req, res) => {
  const { otp, amount } = req.body;
  const session = Sessions.find((session) => session.otp === otp);
  if (session) {
    const accountIndex = Accounts.findIndex(
      (account) => account.username === session.username
    );
    if (accountIndex !== -1) {
      Accounts[accountIndex].balance += parseInt(amount);
      res.status(200).json({ message: "Deposit successful." });
    } else {
      res.status(404).json({ message: "Account not found." });
    }
  } else {
    res.status(401).json({ message: "Invalid OTP." });
  }
  console.log(otp, amount);
});

app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
