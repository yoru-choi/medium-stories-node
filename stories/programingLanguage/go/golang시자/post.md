go 시작하는법

init을 할때는 root폴더명으로 지정하자
git과 동일한 title을 사용한다는의미다

go mod init root폴더명

go get -u github.com/gin-gonic/gin //웹 연결 프레임워크
go get go.mongodb.org/mongo-driver/mongo // 몽고디비 라이브러리

안쓰는 의존성 삭제
go mod tidy

swag init 를 통해 openapi 설정을 넣는다
