import mongoose from "mongoose";
import { z } from "zod";
import { allModels } from ".";

const snippetStructure = z.object({
  title: z.string(),
  content: z.string(),
  hashTags: z.array(z.string()),
  isEditableByEveryone: z.boolean(),
  settings: z.object({
    language: z.string(),
  }),
  metaData: z.object({
    createdBy: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      _id: z.string(),
    }),
    createdAt: z.string(),
    lastUpdatedBy: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      _id: z.string(),
    }),
    lastUpdatedAt: z.string(),
  }),
});

const snippetSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    createdAt: { type: String, required: true },
    lastUpdatedBy: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    lastUpdatedAt: { type: String, required: true },
  },
});

const snippetModel = mongoose.model(allModels.Snippet, snippetSchema);

export { snippetModel, snippetStructure };
