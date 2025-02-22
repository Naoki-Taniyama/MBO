import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "./middleware/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { createTable, dropTable, getUsers, insertUser, deleteUser } from "./dbControll";

const testUser: userType = {
  id: 2,
  username: "testusername1",
  password: "testpassword1",
};

// dropTable();
// createTable();
console.dir();
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const port = 3000;

type userType = {
  id: number;
  username: string;
  password: string;
};

//ユーザー情報
const users: userType[] = [];
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

//ログイン、トークンの発行
app.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (SECRET_KEY == null) {
    res.sendStatus(500);
    return;
  }
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.json({ message: "ユーザーネームかパスワードが違います" });
  }
});

//ユーザー情報の取得
app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    // console.log("users=====", users);
    res.json(users);  
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//ユーザー情報の登録
app.post("/user", authenticateToken, (req, res) => {
  try {
    const { username, password } = req.body;
    insertUser(username, password);
    res.json({ message: "ユーザーを登録しました" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//ユーザー情報の削除
app.delete("/user/:id", authenticateToken, async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const user = await deleteUser(userId);
    res.json({ message: `ユーザーを削除しました:${JSON.stringify(user)}`});
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
