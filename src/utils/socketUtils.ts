import { verifyToken } from "../middleware/authMiddleware";
import { snippetModel } from "../models/snippet";
import { getCurrentTimeInUTC } from "./dateUtils";

export const updateSnippet = async (
  token: string,
  snippetId: string,
  key: string,
  payload: {
    [key: string]: any;
  }
) => {
  try {
    const decodedToken = await verifyToken(token);
    let x = await snippetModel.findOneAndUpdate(
      { _id: snippetId },
      {
        $set: {
          [key]: payload,
          "metaData.lastUpdatedAt": getCurrentTimeInUTC(),
          "metaData.lastUpdatedBy": decodedToken,
        },
      },
      { new: true }
    );
    console.log({ x });
  } catch (err) {}
};
