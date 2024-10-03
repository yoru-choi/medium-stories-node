import dotenv from "dotenv";
import { GenerateConfig } from "./interface";
import { getMediumPost, createMediumPost } from "./mediumService";

dotenv.config();

// mediumToken: process.env.PROD_MEDIUM_TOKEN!, //set token
const generateConfig: GenerateConfig = {
  mediumToken: process.env.TEST_MEDIUM_TOKEN!, //set token
  postFolderName:
    "Handling Multipart Form-Data and JSON Body Simultaneously in a Single API Request with Swagger", //select post
  pushType: "update", // what to do
  publishStatus: "draft", // how to set post
};

if (generateConfig.pushType === "get") {
  getMediumPost(generateConfig);
} else if (generateConfig.pushType === "create") {
  createMediumPost(generateConfig);
  // } else if (generateConfig.pushType === "update") {
  //   updateMediumPost(generateConfig);
} else {
  console.log("nothing run");
}
