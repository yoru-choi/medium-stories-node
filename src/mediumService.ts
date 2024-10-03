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

const getMarkdownPost = async (postFolderName: string): Promise<string> => {
  const path = `stories/${postFolderName}/article.md`;
  return await fs.readFile(path, "utf8");
};

async function getPost(generateConfig: GenerateConfig): Promise<void> {
  try {
    const postConfig: PostConfig = await import(
      `../stories/${generateConfig.postFolderName}/config.ts`
    ).then((data) => {
      return data.default;
    });

    const response: AxiosResponse = await axios.get(
      `${mediumApiBaseUrl}/posts/${postConfig.postId}`,
      {
        headers: {
          Authorization: `Bearer ${generateConfig.mediumToken}`,
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
    const postConfig: PostConfig = await import(
      `../stories/${generateConfig.postFolderName}/config.ts`
    ).then((data) => {
      return data.default;
    });
    // 글 게시 API 호출
    const response: AxiosResponse = await axios.post(
      `${mediumApiBaseUrl}/users/${userId}/posts`,
      {
        title: postConfig.title,
        contentFormat: "markdown", // Content 포맷: html 또는 markdown
        content: markdownPost,
        publishStatus: generateConfig.publishStatus,
        tags: postConfig.tags,
      },
      {
        headers: {
          Authorization: `Bearer ${generateConfig.mediumToken}`,
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

async function updatePost(
  markdownPost: string,
  generateConfig: GenerateConfig
): Promise<void> {
  try {
    const postConfig: PostConfig = await import(
      `../stories/${generateConfig.postFolderName}/config.ts`
    ).then((data) => {
      return data.default;
    });

    // 글 게시 API 호출
    const response: AxiosResponse = await axios.put(
      `${mediumApiBaseUrl}/posts/${postConfig.postId}`,
      {
        title: postConfig.title,
        contentFormat: "markdown", // Content 포맷: html 또는 markdown
        content: markdownPost,
        publishStatus: generateConfig.publishStatus,
        tags: postConfig.tags,
      },
      {
        headers: {
          Authorization: `Bearer ${generateConfig.mediumToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Post updated successfully:", response.data);
  } catch (err: any) {
    console.error(
      "Error updating post:",
      err.response ? err.response.data : err.message
    );
  }
}

export const getMediumPost = async (generateConfig: GenerateConfig) => {
  await getPost(generateConfig);
};

export const createMediumPost = async (generateConfig: GenerateConfig) => {
  const userId = await getMediumUserId(generateConfig.mediumToken);
  const markdownPost = await getMarkdownPost(generateConfig.postFolderName);
  await createPost(userId, markdownPost, generateConfig);
};

export const updateMediumPost = async (generateConfig: GenerateConfig) => {
  const markdownPost = await getMarkdownPost(generateConfig.postFolderName);
  await updatePost(markdownPost, generateConfig);
};
