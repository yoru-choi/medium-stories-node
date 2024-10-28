go 시작하는법

init을 할때는 root폴더명으로 지정하자
git과 동일한 title을 사용한다는의미다

go mod init example

vscode launch 를 사용하면 아래와같이 하자 디버그 모드로 실행할수있게

      "program": "${workspaceFolder}/src/main.go",
      "cwd": "${workspaceFolder}/src"

go

의존성은

go get mongodb 이런식으로

go get go.mongodb.org/mongo-driver/mongo

go http
go get github.com/gin-gonic/gin

go grpc

go tcp

는 안쓰는 의존성 삭제
go mod tidy
