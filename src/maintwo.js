const axios = require('axios'); // Axios는 HTTP 요청을 쉽게 보내기 위한 라이브러리입니다.
const dotenv = require("dotenv").config();

 // Integration Token을 사용하여 API 요청을 보낼 때 필요한 토큰
const integrationToken = process.env.MEDIUM_TOKEN
// Medium에서 제공하는 API 기본 URL
const mediumApiBaseUrl = 'https://api.medium.com/v1';

// 게시할 글의 HTML 내용
var htmlContent = ""

fs.readFile('the_little_prince_summary.md', 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading the file:', err);
      return;
  }
  
  const htmlContent = data;

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
        title: 'A New Post Using Integration Token',
        contentFormat: 'html', // Content 포맷: html 또는 markdown
        content: htmlContent,
        publishStatus: publishStatus
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
