"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTimeInUTC = void 0;
const getCurrentTimeInUTC = () => {
    return new Date().toUTCString();
};
exports.getCurrentTimeInUTC = getCurrentTimeInUTC;
