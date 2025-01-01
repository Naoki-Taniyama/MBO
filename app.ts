import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "./middleware/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { createTable, dropTable, getUsers, insertUser } from "./dbControll";

const testUser: userType = {
  id: 2,
  username: "testusername1",
  password: "testpassword1",
};

dropTable();
createTable();
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
  const users = await getUsers();
  console.log("users=====", users);
  res.json(users);
});

//ユーザー情報の登録
app.post("/user", authenticateToken, (req, res) => {
  const { username, password } = req.body;
  insertUser(username, password);
  res.json({ message: "ユーザーを登録しました" });
});

//ユーザー情報の削除
app.delete("/user/:id", authenticateToken, (req, res) => {
  const userId = Number(req.params.id);
  //userIdに該当するユーザーのindexを取得
  const index = users.findIndex((user) => user.id === userId);

  //バリデーション
  if (userId === undefined) {
    res.status(400).json({ error: "idは必須です" });
    return;
  }
  if (index === -1) {
    res.status(404).json({ error: "ユーザーが存在しません" });
    return;
  }
  users.splice(index, 1);
  res.json({ message: `ユーザーid${userId}を削除しました` });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
