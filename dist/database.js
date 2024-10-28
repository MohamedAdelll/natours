"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var config_1 = require("./config");
var URL = config_1.DATABASE_URL === null || config_1.DATABASE_URL === void 0 ? void 0 : config_1.DATABASE_URL.replace('<password>', config_1.DATABASE_PASSWORD).replace('<username>', config_1.DATABASE_USERNAME).replace('<database_name>', config_1.DATABASE_NAME);
exports.default = mongoose_1.default
    .connect(URL)
    .then(function () { return console.log('db connection succesful'); })
    .catch(function (error) { return console.log(error); });
