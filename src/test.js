
const fs = require("fs")


console.log("")
// 게시할 글의 HTML 내용
var htmlContent = ""

fs.readFile('src/the_little_prince_summary.md', 'utf8', (err, data) => {
  if (err) {
      console.error('Error reading the file:', err);
      return;
  }
  
  htmlContent = data; // 상위 스코프의 변수에 할당

  // 이제 htmlContent를 사용하여 Medium API에 게시할 수 있습니다.
  console.log(htmlContent);
});


    // "test":"node src/maintwo.js"