"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.snippetStructure = exports.snippetModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const _1 = require(".");
const snippetStructure = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    hashTags: zod_1.z.array(zod_1.z.string()),
    isEditableByEveryone: zod_1.z.boolean(),
    settings: zod_1.z.object({
        language: zod_1.z.string(),
    }),
    metaData: zod_1.z.object({
        createdBy: zod_1.z.object({
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
            email: zod_1.z.string(),
            _id: zod_1.z.string(),
        }),
        createdAt: zod_1.z.string(),
        lastUpdatedBy: zod_1.z.object({
            firstName: zod_1.z.string(),
            lastName: zod_1.z.string(),
            email: zod_1.z.string(),
            _id: zod_1.z.string(),
        }),
        lastUpdatedAt: zod_1.z.string(),
    }),
});
exports.snippetStructure = snippetStructure;
const snippetSchema = new mongoose_1.default.Schema({
    title: { type: String, required: false },
    content: { type: String, required: false },
    hashTags: [String],
    isEditableByEveryone: { type: Boolean, default: true },
    settings: {
        language: { type: String, default: "" },
    },
    fileName: String,
    metaData: {
        createdBy: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
        },
        createdAt: { type: String, required: true },
        lastUpdatedBy: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
        },
        lastUpdatedAt: { type: String, required: true },
    },
});
const snippetModel = mongoose_1.default.model(_1.allModels.Snippet, snippetSchema);
exports.snippetModel = snippetModel;
