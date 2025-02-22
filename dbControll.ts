import mysql from "mysql2";
import { PrismaClient } from "@prisma/client";

const DB = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "mbo_api_1",
  connectionLimit: 3,
  namedPlaceholders: true,
});
const prisma = new PrismaClient();

// 前回のテーブル情報を削除
export const dropTable = async () => {
  DB.query("drop table if exists users");
};
// テーブル作成
export const createTable = async () => {
  DB.query(
    "create table users(id integer NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY (id))"
  );
};

// ユーザー情報の取得
export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

// ユーザー情報の登録
export const insertUser = async (username: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      name: username,
      password: password,
    },
  });
};

// ユーザー情報の削除
export const deleteUser = async (id: number) => {
  const user = await prisma.user.delete({where: {id: id}});
  return user;
}
