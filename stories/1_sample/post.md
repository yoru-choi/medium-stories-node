![Description](https://img.notionusercontent.com/s3/prod-files-secure%2F6ab3efe6-44b5-4e5c-9d86-56543fb7f59d%2Fc3b86c80-eaba-4a31-971d-868a2b179849%2Ftest2.jpg/size/w=1420?exp=1727749267&sig=VX63E66yaxZvLTyfE2Db1fyK5g_lgajo6O10Oikoyq0)

<!-- pre image 설정해야하나 위처럼 -->

## What is the mongoDb

amplify는 먼저 aws 에 접속한다

amplify를 검색하고 create new repoistory를 한다
생성을 하면 아래와 같이 이미지가 나온다

sourceCode를 저장할 플랫폼을 선택하라고 나온다
codeCommit을 선택했다

이유
사내에서는 gitLab을 사용하지만 gitLab의 엔터프라이즈 버전 url은 접근할수가 없다
저장소는 codeCommit을 거쳐가는 형식으로 jenkins에서 gitLab을 clone하고 codeCommit에 synk후 push하는 구조이다
CICD를 한번 생성하지만 gitLab을 사용하기 위한 방법이다.
다른 저장소를 사용하는것보다 codeCommit은 aws에서 관리를 맡게 되므로 backend에서 gitLab과 github등의 저장소를 혼용하는 방향은 피하고싶었다

그렇게 배포하고

route53에서 DNS를 설정하고 amplify에 적용하면 백엔드에서 요청할 부분은 끝났다
front의 요청이 있을경우 amplify hosing의 build setting에서 amplify.yml파일의 변경사항을 적용하면된다.
