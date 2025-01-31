import mysql from "mysql2";

const DB = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "mbo_api_1",
  connectionLimit: 3,
  namedPlaceholders: true,
});

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
  const [rows] = await DB.promise().execute("select * from users");
  console.dir(rows);
  return rows;
};

// ユーザー情報の登録
export const insertUser = async (username: string, password: string) => {
  await DB.promise().query(
    "insert into users(username, password) values(:username, :password)",
    {
      username,
      password,
    }
  );
};

// ユーザー情報の削除
export const deleteUser = async (id: number): Promise<Number> => {
  const [result] = await DB.promise().query("delete from users where id = :id", { id });
  return (result as any).affectedRows;
};
