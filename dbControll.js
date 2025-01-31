"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.insertUser = exports.getUsers = exports.createTable = exports.dropTable = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const DB = mysql2_1.default.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mbo_api_1",
    connectionLimit: 3,
    namedPlaceholders: true,
});
// 前回のテーブル情報を削除
const dropTable = async () => {
    DB.query("drop table if exists users");
};
exports.dropTable = dropTable;
// テーブル作成
const createTable = async () => {
    DB.query("create table users(id integer NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY (id))");
};
exports.createTable = createTable;
// ユーザー情報の取得
const getUsers = async () => {
    const [rows] = await DB.promise().execute("select * from users");
    console.dir(rows);
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
// ユーザー情報の削除
const deleteUser = async (id) => {
    const [result] = await DB.promise().query("delete from users where id = :id", { id });
    return result.affectedRows;
};
exports.deleteUser = deleteUser;
