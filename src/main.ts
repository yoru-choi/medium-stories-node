import dotenv from "dotenv";
import { GenerateConfig } from "./interface";
import { getMediumPost, createMediumPost } from "./mediumService";

dotenv.config();

// mediumToken: process.env.PROD_MEDIUM_TOKEN!, TEST_MEDIUM_TOKEN
const generateConfig: GenerateConfig = {
  accessToken: process.env.TEST_MEDIUM_TOKEN!, //set token
  directoryName: "How to manage Medium posts in Git as Markdown files", //select post
  actionType: "create", // what to do
  publishStatus: "draft", // how to set post
};

switch (generateConfig.actionType) {
  case "get":
    getMediumPost(generateConfig);
    break;
  case "create":
    createMediumPost(generateConfig);
    break;
  case "update":
    console.log(
      [
        "You would create a post in Markdown format.",
        "Then, check the content of the post created on Medium and copy it.",
        "After that, paste it into the post you want to edit.",
      ].join("\n")
    );
    break;
  default:
    console.log("nothing run");
}
