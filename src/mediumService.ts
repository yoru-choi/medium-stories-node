import axios, { AxiosResponse } from "axios";
import { promises as fs } from "fs";
import { PostCreationConfig, PostConfig } from "./interface";

const mediumApiBaseUrl: string = "https://api.medium.com/v1";

// Retrieve user information from Medium using a integration token
const getMediumUserId = async (token: String): Promise<string> => {
  const userResponse: AxiosResponse = await axios.get(
    `${mediumApiBaseUrl}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return userResponse.data.data.id;
};

const getMarkdownPost = async (folderName: string): Promise<string> => {
  const path = `stories/${folderName}/post.md`;
  return await fs.readFile(path, "utf8");
};

async function getPost(
  userId: string,
  generateConfig: PostCreationConfig
): Promise<void> {
  try {
    const response: AxiosResponse = await axios.get(
      `${mediumApiBaseUrl}/users/${userId}/publications`,
      {
        headers: {
          Authorization: `Bearer ${generateConfig.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Post got successfully:", response.data);
  } catch (err: any) {
    console.error(
      "Error getting post:",
      err.response ? err.response.data : err.message
    );
  }
}

async function createPost(
  userId: string,
  markdownPost: string,
  generateConfig: PostCreationConfig
): Promise<void> {
  try {
    const contentFormat: string = "markdown";
    const postConfig: PostConfig = await import(
      `../stories/${generateConfig.folderName}/config.ts`
    ).then((data) => {
      return data.default;
    });
    const response: AxiosResponse = await axios.post(
      `${mediumApiBaseUrl}/users/${userId}/posts`,
      {
        title: postConfig.title,
        contentFormat: contentFormat,
        content: markdownPost,
        publishStatus: generateConfig.publishStatus,
        tags: postConfig.tags,
      },
      {
        headers: {
          Authorization: `Bearer ${generateConfig.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Post created successfully:", response.data);
  } catch (err: any) {
    console.error(
      "Error creating post:",
      err.response ? err.response.data : err.message
    );
  }
}

export const getMediumPost = async (generateConfig: PostCreationConfig) => {
  const userId = await getMediumUserId(generateConfig.accessToken);
  await getPost(userId, generateConfig);
};

export const createMediumPost = async (generateConfig: PostCreationConfig) => {
  const userId = await getMediumUserId(generateConfig.accessToken);
  const markdownPost = await getMarkdownPost(generateConfig.folderName);
  await createPost(userId, markdownPost, generateConfig);
};

//
// const emphasizedPost = emphasizeWords(markdownPost);
// const emphasizeWords = (markdown: string): string => {
//   const wordsToEmphasize = ["npm", "github", "medium"];

//   // 코드 블록을 구분하기 위해 줄 단위로 텍스트를 분리
//   const lines = markdown.split("\n");

//   return lines
//     .map((line) => {
//       // 코드 블럭 내부인지 확인
//       if (line.startsWith("```")) {
//         return line; // 코드 블럭은 그대로 반환
//       }

//       // 코드 블럭이 아닌 경우, 단어를 강조 처리
//       wordsToEmphasize.forEach((word) => {
//         if (line.includes(word)) {
//           line = line.replace(word, `**${word}**`);
//         }
//       });

//       return line;
//     })
//     .join("\n");
// };

// export const updateMediumPost = async (generateConfig: GenerateConfig) => {
//   const userId = await getMediumUserId(generateConfig.accessToken);
//   const markdownPost = await getMarkdownPost(generateConfig.folderName);
//   await updatePost(userId, markdownPost, generateConfig);
// };

// async function updatePost(
//   userId: string,
//   markdownPost: string,
//   generateConfig: GenerateConfig
// ): Promise<void> {
//   try {
//     const postConfig: PostConfig = await import(
//       `../stories/${generateConfig.folderName}/config.ts`
//     ).then((data) => {
//       return data.default;
//     });

//     // 글 게시 API 호출
//     const response: AxiosResponse = await axios.put(
//       `${mediumApiBaseUrl}/users/${userId}/posts/${postConfig.postId}`,
//       {
//         title: postConfig.title,
//         contentFormat: "markdown", // Content 포맷: html 또는 markdown
//         content: markdownPost,
//         publishStatus: generateConfig.publishStatus,
//         tags: postConfig.tags,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${generateConfig.accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Post updated successfully:", response.data);
//   } catch (err: any) {
//     console.error(
//       "Error updating post:",
//       err.response ? err.response.data : err.message
//     );
//   }
// }

// const postConfig: PostConfig = await import(
//   `../stories/${generateConfig.folderName}/config.ts`
// ).then((data) => {
//   return data.default;
// });
//  `${mediumApiBaseUrl}/users/${userId}/posts/${postId}`,
