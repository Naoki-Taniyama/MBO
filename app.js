"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mysql2_1 = __importDefault(require("mysql2"));
const connection = mysql2_1.default.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'users'
});
// 非同期使いたいのでasync関数を作成
const main = async () => {
    connection.query('drop table tab_a');
    connection.query('create table tab_a(col1 integer)');
    connection.query('insert into tab_a(col1) values(1)');
    //結果を取得したい
    const [rows] = await connection.promise().query('SELECT * FROM tab_a');
    console.dir(rows);
};
main();
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
const app = (0, express_1.default)();
const port = 3000;
//ユーザー情報
const users = [];
//ユーザーID(作成するたびにインクリメント)
let currentId = 1;
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
app.get("/health", (req, res) => {
    res.send("Hello World!");
});
//ログイン、トークンの発行
app.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    if (SECRET_KEY == null) {
        res.sendStatus(500);
        return;
    }
    if (username === "admin" && password === "admin") {
        const token = jsonwebtoken_1.default.sign({ username }, SECRET_KEY, { expiresIn: "30m" });
        res.json({ token });
    }
    else {
        res.json({ message: "ユーザーネームかパスワードが違います" });
    }
});
//ユーザー情報の取得
app.get("/users", (req, res) => {
    res.json(users);
});
//ユーザー情報の登録
app.post("/user", auth_1.authenticateToken, (req, res) => {
    const { username, password } = req.body;
    const newUser = { id: currentId++, username, password };
    users.push(newUser);
    res.json(newUser);
});
//ユーザー情報の削除
app.delete("/user/:id", auth_1.authenticateToken, (req, res) => {
    const userId = Number(req.params.id);
    //userIdに該当するユーザーのindexを取得
    const index = users.findIndex(user => user.id === userId);
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
