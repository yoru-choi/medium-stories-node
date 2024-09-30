const axios = require('axios'); // Axios는 HTTP 요청을 쉽게 보내기 위한 라이브러리입니다.
const dotenv = require("dotenv").config();
const fs = require("fs")

 // Integration Token을 사용하여 API 요청을 보낼 때 필요한 토큰 미디엄 토큰은 내 개인 저장소에 별도관리하면서 env로 빼다 쓰자
const integrationToken = process.env.TEST_MEDIUM_TOKEN
// Medium에서 제공하는 API 기본 URL
const mediumApiBaseUrl = 'https://api.medium.com/v1';


// 여기만큼은 내가 직접 설정해야한다 업로드 할 파일명과 태그들
const fileName = "Handling Multipart Form-Data and JSON Body Simultaneously in a Single API Request with Swagger.md"
const title = "이부분 어떻게할지 고민"
const tags = ["qqq", "www"]


const path = `stories/${fileName}`
fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading the file:', err);
      return;
  }
  
  htmlContent = data; // 상위 스코프의 변수에 할당

  // 이제 htmlContent를 사용하여 Medium API에 게시할 수 있습니다.
  console.log(htmlContent);
});



// 글 작성 함수
async function createMediumPost() {
  try {
    // 사용자 정보를 가져오는 API 호출
    const userResponse = await axios.get(`${mediumApiBaseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${integrationToken}`, // Integration Token을 Authorization 헤더에 추가
        'Content-Type': 'application/json'
      }
    });

    // Medium 사용자 ID 추출
    const userId = userResponse.data.data.id;


    //
const publishStatus =     'draft' // 발행 상태: 'draft', 'public', 'unlisted'

    // 글 게시 API 호출
    const postResponse = await axios.post(
      `${mediumApiBaseUrl}/users/${userId}/posts`,
      {
        title: 'A New Post Using Integration Token3',
        contentFormat: 'markdown', // Content 포맷: html 또는 markdown
        content: htmlContent,
        publishStatus: publishStatus,
        tags:tags
      },
      {
        headers: {
          Authorization: `Bearer ${integrationToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 결과 출력
    console.log('Post created successfully:', postResponse.data);
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
  }
}

// 글 작성 함수 호출
createMediumPost();
