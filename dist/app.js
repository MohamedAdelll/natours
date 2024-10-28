"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var tourRouter_1 = __importDefault(require("./Routers/tourRouter"));
app.use(express_1.default.json());
app.use('/api/v1/tours', tourRouter_1.default);
exports.default = app;
