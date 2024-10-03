import axios, { AxiosResponse } from "axios"; // Axios는 HTTP 요청을 보내기 위한 라이브러리입니다.
import dotenv from "dotenv"; // .env 파일을 관리하기 위한 라이브러리
import fs from "fs";

// dotenv 설정 불러오기
dotenv.config();

// 배포할 때 사용할 파일 경로
const articleConfig = import(
  `../stories/Handling Multipart Form-Data and JSON Body Simultaneously in a Single API Request with Swagger/config`
);

// 글 작성과 업데이트 시 사용할 설정
interface GenerateConfig {
  pushType: "create" | "update"; // create 또는 update
  publishStatus: "draft" | "public" | "unlisted"; // 발행 상태
  state: "create" | "update"; // 상태
}

const generateConfig: GenerateConfig = {
  pushType: "update", // create 또는 update
  publishStatus: "draft", // 발행 상태: 'draft', 'public', 'unlisted'
  state: "update", // 상태: 'create' 또는 'update'
};

// Medium API 토큰과 URL
const integrationToken: string = process.env.TEST_MEDIUM_TOKEN!;
const mediumApiBaseUrl: string = "https://api.medium.com/v1";

// articleConfig에서 필요한 정보를 가져오기
const id: string = articleConfig.id;
const title: string = articleConfig.title;
const tags: string[] = articleConfig.tags;
const path: string = articleConfig.path;

// HTML 콘텐츠를 파일에서 읽기
let htmlContent: string = "";
fs.readFile(path, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  htmlContent = data; // 상위 스코프의 변수에 할당
  console.log(htmlContent); // HTML 콘텐츠 출력
});

// 글 작성 함수
async function createMediumPost(): Promise<void> {
  try {
    // 사용자 정보를 가져오는 API 호출
    const userResponse: AxiosResponse = await axios.get(
      `${mediumApiBaseUrl}/me`,
      {
        headers: {
          Authorization: `Bearer ${integrationToken}`, // Integration Token을 Authorization 헤더에 추가
          "Content-Type": "application/json",
        },
      }
    );

    // Medium 사용자 ID 추출
    const userId: string = userResponse.data.data.id;

    // 글 게시 API 호출
    const postResponse: AxiosResponse = await axios.post(
      `${mediumApiBaseUrl}/users/${userId}/posts`,
      {
        title: title,
        contentFormat: "markdown", // Content 포맷: html 또는 markdown
        content: htmlContent,
        publishStatus: generateConfig.publishStatus,
        tags: tags,
      },
      {
        headers: {
          Authorization: `Bearer ${integrationToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 결과 출력
    console.log("Post created successfully:", postResponse.data);
  } catch (error: any) {
    console.error(
      "Error creating post:",
      error.response ? error.response.data : error.message
    );
  }
}

// 글 업데이트 함수
async function updateMediumPost(
  updatedTitle: string,
  updatedHtmlContent: string,
  updatedTags: string[]
): Promise<void> {
  try {
    // 글 업데이트 API 호출
    const updateResponse: AxiosResponse = await axios.put(
      `${mediumApiBaseUrl}/posts/${id}`,
      {
        title: updatedTitle,
        contentFormat: "markdown", // Content 포맷: html 또는 markdown
        content: updatedHtmlContent,
        tags: updatedTags,
        publishStatus: generateConfig.publishStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${integrationToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Post updated successfully:", updateResponse.data);
  } catch (error: any) {
    console.error(
      "Error updating post:",
      error.response ? error.response.data : error.message
    );
  }
}

// createOrUpdate에 따라 글 작성 또는 업데이트 함수 호출
const createOrUpdate: string = "update"; // 이 값은 실제로 환경에 맞게 설정되겠죠.

if (createOrUpdate === "create") {
  createMediumPost();
} else if (createOrUpdate === "update") {
  const updatedTitle = "Updated Title"; // 실제 업데이트할 제목
  const updatedHtmlContent = "<p>Updated content</p>"; // 실제 업데이트할 HTML 콘텐츠
  const updatedTags = ["tag1", "tag2"]; // 실제 업데이트할 태그
  updateMediumPost(updatedTitle, updatedHtmlContent, updatedTags);
} else {
  console.log("nothing run");
}
