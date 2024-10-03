<!-- pre image 설정해야하나 위처럼 -->

## 하게된 이유

github에서 관리하고 markdown으로 배포하는 방법을 하고싶었다

이전에 했던 건 마크다운을 지원하지않았다
google 의 Blogger도 사용하기 불편했다

그리고 medium을 해볼까 했는데 markdown지원 및 다른 sosial media에도 발행이 간단하여 앞으로 medium에서 하기로 했다

## 오랜만에 vscode

vscode를 실행해준다 fromat on save는 없으면 추가해준다

패키지는 아래처럼 3개 설치하면된다
어차피 필요할때만 실행하기때문에 메이저 버전만 고정한다

외에는 javascript를 사용하려했지만 typescript로 하는게 type형 선언도 그렇고 type없는 개발 이하고싶지않다
typescript를 깔자

medium sdk는 medium 공식 git에서 찾을수있다.

https://github.com/Medium/medium-api-docs
"axios": "^1.7.7",
"dotenv": "^16.4.5",
"medium-sdk": "^0.0.4"
