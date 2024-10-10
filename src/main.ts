import dotenv from "dotenv";
import { PostCreationConfig } from "./interface";
import { getMediumPost, createMediumPost } from "./mediumService";

dotenv.config();

// You only need to modify this part and run it to deploy
// TEST_MEDIUM_TOKEN, PROD_MEDIUM_TOKEN
const postCreationConfig: PostCreationConfig = {
  accessToken: process.env.PROD_MEDIUM_TOKEN!, // set token
  folderName: "How to manage Medium posts in Git as Markdown files", // set folder name
  actionType: "create", // what to do
  publishStatus: "draft",
};

switch (postCreationConfig.actionType) {
  case "get":
    getMediumPost(postCreationConfig);
    break;
  case "create":
    createMediumPost(postCreationConfig);
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
