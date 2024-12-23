"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const SECRET_KEY = process.env.SECRET_KEY;
const authenticateToken = (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];
    if (SECRET_KEY == null) {
        res.sendStatus(500);
        return;
    }
    if (token == null) {
        res.sendStatus(401);
        return;
    }
    else {
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                res.sendStatus(403);
                return;
            }
            req.user = user;
            next();
        });
    }
};
exports.authenticateToken = authenticateToken;
