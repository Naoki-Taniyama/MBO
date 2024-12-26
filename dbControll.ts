import mysql from "mysql2";

const DB = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "mbo_api_1",
  connectionLimit: 3,
  namedPlaceholders: true,
});

// テーブル作成
export const createTable = async () => {
  DB.query(
    "create table users(id integer, username varchar(255), password varchar(255))"
  );
  //結果を取得したい
  DB.query("delete from users");
  DB.query("drop if exists table users");
};

// ユーザー情報の取得
export const getUsers = async () => {
  const [rows] = await DB.promise().query("select * from users");
  return rows;
};

// ユーザー情報の登録
export const insertUser = async (username: string, password: string) => {
  await DB.promise().query("insert into users(username, password) values(:username, :password)", {
    username,
    password,
  });
};
