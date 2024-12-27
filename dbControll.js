"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUser = exports.getUsers = exports.createTable = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const DB = mysql2_1.default.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mbo_api_1",
    connectionLimit: 3,
    namedPlaceholders: true,
});
// テーブル作成
const createTable = async () => {
    DB.query("delete if exists from users");
    DB.query("drop if exists table users");
    DB.query("create table users(id integer NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY (id))");
};
exports.createTable = createTable;
// ユーザー情報の取得
const getUsers = async () => {
    const [rows] = await DB.promise().query("select * from users");
    return rows;
};
exports.getUsers = getUsers;
// ユーザー情報の登録
const insertUser = async (username, password) => {
    await DB.promise().query("insert into users(username, password) values(:username, :password)", {
        username,
        password,
    });
};
exports.insertUser = insertUser;
