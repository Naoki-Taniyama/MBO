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
  DB.query("delete if exists from users");
  DB.query("drop if exists table users");

  DB.query(
    "create table users(id integer NOT NULL AUTO_INCREMENT, username varchar(255), password varchar(255), PRIMARY KEY (id))"
  );
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
