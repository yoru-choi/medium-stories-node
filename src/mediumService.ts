import axios, { AxiosResponse } from "axios"; // Axios는 HTTP 요청을 보내기 위한 라이브러리입니다.
import { promises as fs } from "fs";
import { GenerateConfig, PostConfig } from "./interface";

const mediumApiBaseUrl: string = "https://api.medium.com/v1";

// get user info from medium by token
const getMediumUserId = async (token: String): Promise<string> => {
  const userResponse: AxiosResponse = await axios.get(
    `${mediumApiBaseUrl}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Integration Token을 Authorization 헤더에 추가
        "Content-Type": "application/json",
      },
    }
  );
  return userResponse.data.data.id;
};

const getMarkdownPost = async (directoryName: string): Promise<string> => {
  const path = `stories/${directoryName}/post.md`;
  return await fs.readFile(path, "utf8");
};

async function getPost(
  userId: string,
  generateConfig: GenerateConfig
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
  generateConfig: GenerateConfig
): Promise<void> {
  try {
    const contentFormat: string = "markdown";
    const postConfig: PostConfig = await import(
      `../stories/${generateConfig.directoryName}/config.ts`
    ).then((data) => {
      return data.default;
    });
    // 글 게시 API 호출
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

export const getMediumPost = async (generateConfig: GenerateConfig) => {
  const userId = await getMediumUserId(generateConfig.accessToken);
  await getPost(userId, generateConfig);
};

export const createMediumPost = async (generateConfig: GenerateConfig) => {
  const userId = await getMediumUserId(generateConfig.accessToken);
  const markdownPost = await getMarkdownPost(generateConfig.directoryName);
  await createPost(userId, markdownPost, generateConfig);
};

// export const updateMediumPost = async (generateConfig: GenerateConfig) => {
//   const userId = await getMediumUserId(generateConfig.accessToken);
//   const markdownPost = await getMarkdownPost(generateConfig.directoryName);
//   await updatePost(userId, markdownPost, generateConfig);
// };

// async function updatePost(
//   userId: string,
//   markdownPost: string,
//   generateConfig: GenerateConfig
// ): Promise<void> {
//   try {
//     const postConfig: PostConfig = await import(
//       `../stories/${generateConfig.directoryName}/config.ts`
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
//   `../stories/${generateConfig.directoryName}/config.ts`
// ).then((data) => {
//   return data.default;
// });
//  `${mediumApiBaseUrl}/users/${userId}/posts/${postId}`,
