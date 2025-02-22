"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.insertUser = exports.getUsers = exports.createTable = exports.dropTable = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const client_1 = require("@prisma/client");
const DB = mysql2_1.default.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "mbo_api_1",
    connectionLimit: 3,
    namedPlaceholders: true,
});
const prisma = new client_1.PrismaClient();
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
    const users = await prisma.user.findMany();
    return users;
};
exports.getUsers = getUsers;
// ユーザー情報の登録
const insertUser = async (username, password) => {
    const user = await prisma.user.create({
        data: {
            name: username,
            password: password,
        },
    });
};
exports.insertUser = insertUser;
// ユーザー情報の削除
const deleteUser = async (id) => {
    const user = await prisma.user.delete({ where: { id: id } });
    return user;
};
exports.deleteUser = deleteUser;
