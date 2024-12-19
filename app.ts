import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "./middleware/auth";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;

app.use(express.json());

//ユーザー情報
const users: { id: number; username: string; password: string }[] = [];
//ユーザーID(作成するたびにインクリメント)
let currentId = 1;

const SECRET_KEY = "secret_key";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//ログイン、トークンの発行
app.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

//ユーザー情報の取得
app.get("/users", authenticateToken, (req, res) => {
  res.json(users);
});

//ユーザー情報の登録
app.post("/user", authenticateToken, (req, res) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).json({ error: "usernameとpasswordは必須です" });
  }
  const newUser = { id: currentId++, username, password };
  users.push(newUser);
  res.json(newUser);
});

//ユーザー情報の削除
app.delete("/user/{id}", authenticateToken, (req, res) => {
  const userId = Number(req.params.id);

  //バリデーション
  if (userId === undefined) {
    res.status(400).json({ error: "idは必須です" });
  }
  if (users[userId] === undefined) {
    res.status(404).json({ error: "ユーザーが存在しません" });
  }
  users.splice(userId, 1);
  res.json({ message: `ユーザーid${userId}を削除しました` });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
