에자일

도커에서

아마존 리눅스 2023 에서 했다

dnf install -y docker로 설치한다

systecmctl start 랑 enable해준다

udo docker search nginx
nginx설치할수있는지 체크한다

docker pull nginx:latest

sudo docker images로 pull했는지 체크한다

pull한 nginx이미지를 사용하여 내 서버에서 run할 이미지 하나를 만들어준다
sudo docker run --name mynginx -p 7070:70 -d nginx:latest

아래에서 내가 생성한 images의 설정 경로로 접근가능하다 여기서 nginx 설정을 조절하자
sudo docker exec -it mynginx /bin/bash

nginx를 설치했으니

docker file을 만들어보자

`vi Dockerfile`를 해준다

```docker
FROM openjdk:17
WORKDIR /app

# JAR 파일을 컨테이너 내부로 복사합니다.
COPY deploy/build/libs/coconeapphub-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

```

이미지를 위처럼 등록한다

`docker build -t myjava .`
빌드하면

`docker images` 를 하면 레포지토리 명이 보인다

아래 코드를 실행하자 이미지를 가지고 런하는 친구는 runmyjava로 만들어주자

런하는 곳까지 올리면 컨테이너 라고한다

`sudo docker run --name runmyjava -p 443:443 myjava2:latest`

run을 하는경우 성공하는 경우와 실패하는 경우가 있다 실패하는

jar파일 업로드를 해 여기서 images에 등록하고 잘 실행되나 테스트 해보자

문제가 없다면 이제 jenkins에서 이짓을 해보자

run에 실패하는경우
docker ps -a 로 검색하면 실행 종료된 docker도 나오기때문에 docker rm `container id` 로 삭제해주자

aws configure가 필요한 경우 직접 설정하여 넣어주면 실행가능하다

docker run -e AWS_ACCESS_KEY_ID=asdfasdf -e AWS_SECRET_ACCESS_KEY=asfasfdasdfasdf -e AWS_REGION=ap-northeast-1 --name runmyjava4 -p 6060:60 myjava2:latest

위처럼하여 nginx, java를 실행했다면 그다음은 jenkins에서 위와같은 방식을 사용해 배포가 되게끔하고싶다
즉 build파일을 배포하는게 아니라 images파일을 배포하고 restart하는 방식을 채택하고싶다

먼저 docker가 설치되어 container를 재기동하는건 변함없다 이걸 하고 jenkins에서 요청하는거 하고 그거 테스트 끝나면 다음주에 리펙토링 핑계대면서 전체적으로 손한번 보면 마무리 될듯
그리고 수정할거있으면 수정요청하고

바로 된다고하지말고 알아도 봐본다고 하기
어떻게될지 모름

nginx

    access_log  /var/log/nginx/access.log  main;

    client_max_body_size 1000M;
    sendfile            on;
    tcp_nopush          on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       443;
        listen       [::]:443;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

`sudo docker run --name mynginx2 -p 443:443 nginx:latest`

sudo docker exec -it mynginx2 /bin/bash

1. 실행 중인 모든 컨테이너 중지
   bash
   Copy code
   sudo docker stop $(docker ps -q)
2. 모든 컨테이너 삭제
   bash
   Copy code
   sudo docker rm $(docker ps -a -q)

docker의 docker 파일에 대해 엄청난걸 깨달아버렸다.

FROM node14
이거부터 시작하하는 도커파일의

COPY는 진짜 파일의 내용을 복사한다는거였다.

해당 디렉토리에 해당위치에 카피해서 실행한다 이제야 도커를 조금 이해했다.
