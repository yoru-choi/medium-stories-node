import dotenv from "dotenv";
import { GenerateConfig } from "./interface";
import {
  getMediumPost,
  createMediumPost,
  updateMediumPost,
} from "./mediumService";

dotenv.config();

const generateConfig: GenerateConfig = {
  mediumToken: process.env.TEST_MEDIUM_TOKEN!, //set token
  postFolderName:
    "Handling Multipart Form-Data and JSON Body Simultaneously in a Single API Request with Swagger", //select post
  pushType: "get", // what to do
  publishStatus: "draft", // how to set post
};

if (generateConfig.pushType === "get") {
  getMediumPost(generateConfig);
} else if (generateConfig.pushType === "create") {
  createMediumPost(generateConfig);
} else if (generateConfig.pushType === "update") {
  updateMediumPost(generateConfig);
} else {
  console.log("nothing run");
}
