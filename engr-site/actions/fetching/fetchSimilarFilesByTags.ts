"use server";

import dbConnect from "@/database/dbConnector";
import { processFile } from "@/utils/helpers";
import { FileData, FetchedFile, FetchedFilesDataArray } from "@/utils/types";

type fetchSimilarFilesByTagsProps = {
  fileId: string;
  tags?: string[];
};

export const fetchSimilarFilesByTags = async ({
  fileId,
  tags,
}: fetchSimilarFilesByTagsProps): Promise<FetchedFilesDataArray> => {
  console.log(tags);
  const tagsString = tags?.map((tag) => `'${tag}'`).join(",");
  console.log(tagsString);

  console.log(JSON.stringify(tags).replace("[", "").replace("]", ""));

  try {
    const selectQuery = `
      SELECT f.FileId, f.FileName, f.S3Url, f.Description, f.UploadDate, f.Contributor,
        JSON_ARRAYAGG(t.TagName) AS TagNames
      FROM Files f
      JOIN FileTags ft ON f.FileId = ft.FileId
      JOIN Tags t ON ft.TagId = t.TagId
      WHERE t.TagName IN (${JSON.stringify(tags)
        .replace("[", "")
        .replace("]", "")})
        AND f.FileId != ?
      GROUP BY f.FileId
      LIMIT 3;`;

    const { results: filesResult, error } = await dbConnect(selectQuery, [
      fileId,
    ]);

    if (error) {
      console.error("Error retrieving data from the database:", error);
      return { failure: "Internal server error" };
    }

    if (filesResult[0].length > 0) {
      const formattedData: FetchedFile[] = await Promise.all(
        filesResult[0].map(async (file: FileData) => {
          const processedFile = await processFile(file);
          return processedFile;
        })
      );

      return { success: formattedData };
    } else {
      return { success: undefined };
    }

    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return {
      failure: "Internal server error, error retrieving modules from db",
    };
  }
};
