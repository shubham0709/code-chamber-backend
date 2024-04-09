"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSnippet = void 0;
const authMiddleware_1 = require("../middleware/authMiddleware");
const snippet_1 = require("../models/snippet");
const dateUtils_1 = require("./dateUtils");
const updateSnippet = async (token, snippetId, key, payload) => {
    try {
        const decodedToken = await (0, authMiddleware_1.verifyToken)(token);
        let x = await snippet_1.snippetModel.findOneAndUpdate({ _id: snippetId }, {
            $set: {
                [key]: payload,
                "metaData.lastUpdatedAt": (0, dateUtils_1.getCurrentTimeInUTC)(),
                "metaData.lastUpdatedBy": decodedToken,
            },
        }, { new: true });
        console.log({ x });
    }
    catch (err) { }
};
exports.updateSnippet = updateSnippet;
