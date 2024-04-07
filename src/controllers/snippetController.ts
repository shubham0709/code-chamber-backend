import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { snippetModel, snippetStructure } from "../models/snippet";

const snippetController = express.Router();

//get all the public snippets
snippetController.get("/all", async (req, res) => {
  const publicSnippets = await snippetModel.find().sort({ "metaData.createdAt": -1 });
  return res.status(200).json(publicSnippets);
});

//upload or save a snippet
snippetController.post("/", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, _id } = req.user;
    const rawSnippet = {
      title: "",
      content: "",
      hashTags: [],
      isEditableByEveryone: true,
      settings: {
        language: "javascript",
      },
      metaData: {
        createdBy: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          _id: _id,
        },
        createdAt: new Date().toUTCString(),
        lastUpdatedBy: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          _id: _id,
        },
        lastUpdatedAt: new Date().toUTCString(),
      },
    };

    const verifySnippetStructure = snippetStructure.safeParse(rawSnippet);

    if (!verifySnippetStructure.success) {
      res.status(400).json(verifySnippetStructure);
      return;
    }
    const createdSnippet = await new snippetModel(rawSnippet).save();
    res.send(createdSnippet);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get snippet by id send if snippet is public / snippet.owner == user._id // snippet.editableBy contains user._id
snippetController.get("/:id", authMiddleware, async (req, res) => {
  const snippetId = req.params.id;
  if (snippetId == undefined) {
    return res.status(404).send("Not Found");
  }
  const { firstName, lastName, email, _id } = req.user;
  const foundSnippet = await snippetModel.findOne({ _id: snippetId });

  if (!foundSnippet) {
    return res.status(404).send("Not Found");
  }
  return res.status(200).send(foundSnippet);
});

//update snippet
snippetController.put("/:id", authMiddleware, async (req, res) => {});

//delete snippet by id
snippetController.delete("/:id", async (req, res) => {
  const snippetId = req.params.id;
  if (snippetId == undefined) {
    return res.status(404).send("Not Found");
  }
  const { firstName, lastName, email, _id } = req.user;
  const foundSnippet = await snippetModel.findOne({ _id: snippetId });
  if (!foundSnippet) {
    return res.status(404).send({ message: "Not Found" });
  }
  if (foundSnippet?.metaData?.createdBy?._id == _id) {
    const deleteSnippet = await snippetModel.findOneAndDelete({ _id: snippetId });
    return res.status(200).send(deleteSnippet);
  }
  return res.status(404).send({ message: "Not Found" });
});

//request to get edit access of a snippet by id
snippetController.post("/:id/request-edit", authMiddleware, async (req, res) => {
  const snippetId = req.params.id;

  if (snippetId == undefined) {
    return res.status(404).send("Not Found");
  }

  const { username, email, _id } = req.user;
  const foundSnippet = await snippetModel.findOne({ _id: snippetId });

  if (!foundSnippet) {
    return res.status(404).send("Not Found");
  }

  if (foundSnippet?.metaData?.createdBy?._id == _id) {
    const deleteSnippet = await snippetModel.findOneAndDelete({ _id: snippetId });
    return res.status(200).send(deleteSnippet);
  }
});

//handle edit request of a snippet by id
snippetController.post("/:id/edit-request/:requestId", authMiddleware, (req, res) => {});

export { snippetController };
