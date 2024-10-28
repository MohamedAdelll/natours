"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_NAME = exports.DATABASE_URL = exports.DATABASE_USERNAME = exports.DATABASE_PASSWORD = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DATABASE_PASSWORD = (_a = process.env, _a.DATABASE_PASSWORD), exports.DATABASE_USERNAME = _a.DATABASE_USERNAME, exports.DATABASE_URL = _a.DATABASE_URL, exports.DATABASE_NAME = _a.DATABASE_NAME;
