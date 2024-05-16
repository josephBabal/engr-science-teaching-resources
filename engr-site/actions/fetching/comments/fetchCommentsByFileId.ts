"use server"

import { getFileById } from "@/database/data/files";
import dbConnect from "@/database/dbConnector";
import { formatTimeAgo } from "@/utils/formatting";
import { CommentFileData, FetchedCommentFileData } from "@/utils/types";



export const fetchCommentsByFileId = async (id: string): Promise<FetchedCommentFileData | null> => {
  try {
    const existingFile = getFileById(id);

    if (!existingFile) {
      console.error("File not found");
      return { failure: "File not found" };
    }


    const selectQuery = `
      SELECT fc.id, fc.fileId, fc.userId, fc.commentText, fc.uploadDate, u.name
      FROM FileComments_v2 AS fc 
      JOIN Users_v2 AS u ON fc.userId = u.id
      WHERE fc.fileId = ?`;

    const { results: comments, error } = await dbConnect(selectQuery, [id]);

    if (error) {
      console.error("An error occurred while fetching data:", error);
      return {
        failure: "Internal server error, error retrieving file comments from db",
      };
    }

    if (comments[0].length === 0) {
      return {
        success: []
      }
    }

    console.log("date: ", comments[0][0].uploadDate);
    
    const commentsTransformed = comments[0].map((comment: CommentFileData) => {
      const timeAgoDate = formatTimeAgo(comment.uploadDate.toString());
      return {
        ...comment,
        uploadDate: timeAgoDate

      } 
    })

    return { success: commentsTransformed };


  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};