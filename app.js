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
const dbControll_1 = require("./dbControll");
const testUser = {
    id: 2,
    username: "testusername1",
    password: "testpassword1",
};
(0, dbControll_1.createTable)();
console.dir();
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
    const users = (0, dbControll_1.getUsers)();
    res.json(users);
});
//ユーザー情報の登録
app.post("/user", auth_1.authenticateToken, (req, res) => {
    const { username, password } = req.body;
    (0, dbControll_1.insertUser)(username, password);
    res.json({ message: "ユーザーを登録しました" });
});
//ユーザー情報の削除
app.delete("/user/:id", auth_1.authenticateToken, (req, res) => {
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
