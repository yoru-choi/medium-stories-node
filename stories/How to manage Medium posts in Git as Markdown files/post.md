# Intro

### What I want to do

저는 블로그 포스트를 작성하고, 그것을 GitHub에서 Markdown 파일로 관리하고 싶습니다. Medium은 Markdown을 지원하고, 주요 블로그 플랫폼으로서 매력적이기 때문에 주의 깊게 지켜보고 있었습니다. 가볍고 간편한 개발 환경을 위해 Node.js가 적합할 것 같았고, 공식 SDK도 제공하므로 가장 적합한 선택인 것 같았습니다.

I want to write blog posts, but manage them as Markdown files on GitHub.
I’ve been keeping an eye on Medium because it supports Markdown and is a major blog platform, which makes it appealing.
For a lightweight and easy development setup, I thought Node.js would be a good fit, and since it provides an official SDK, it seemed like the most suitable option.

### Spec

node v 20.xx
typescript
vscode
git
notion

## 사용해야 할것들을 준비하자

I prepare a Notion account to store images (you can use something else if you prefer).
Then, I create a Git repository.
Next, I open VSCode and make sure to configure basic settings like enabling "Format on Save" for a cleaner workflow.

Finally, I run the necessary commands using Bash.

notion account를 준비합니다. 이미지를 저장하기위함입니다 (다른걸쓰셔도 좋습니다)
git repository를 만들어줍니다
vscode를 실행해줍니다.
Format on save같은건 기본적으로 설정해준다. 있으면 깔끔하니까

필요한 것들을 bash로 실행해줍니다

```bash
npm --init
npx tsc --init

npm i axios
npm i dotenv
npm i medium-sdk

npm i -D tsx
npm i -D @types/dotenv
npm i -D typescript
```

"I write and execute the code in TypeScript, so I also install the necessary dependencies. If I want to run it from the terminal, I can install tsx globally."

Let me know if you'd like any further adjustments!

typescript로 코드를 작성후 실행하기때문에 관련 의존성도 install한다
terminal에서 실행하고싶다면 tsx는 global에서 install해도된다.

나는 아래처럼 설정했다

```json
{
  "name": "medium-stories-node",
  "version": "1.0.0",
  "description": "I wanna handle medium on git",
  "main": "src/main_ts.ts",
  "type": "module",
  "author": "yoru_choi",
  "license": "ISC",
  "scripts": {
    "dev": "tsx src/main.ts"
  },
  "dependencies": {
    "axios": "^1.7.7",
    "dotenv": "^16.4.5",
    "medium-sdk": "^0.0.4"
  },
  "devDependencies": {
    "@types/dotenv": "^6.1.1",
    "tsx": "^4.19.1",
    "typescript": "^5.6.2"
  }
}
```

## 이제 코드를 작성해봅시다

![NotionImage](https://img.notionusercontent.com/s3/prod-files-secure%2F6ab3efe6-44b5-4e5c-9d86-56543fb7f59d%2Fb3fd5609-9abd-401f-ac06-f649e63940e1%2Fimage.png/size/w=2000?exp=1728020105&sig=3VS1Sb0fxrRsGYHJs6MWHAitmkji6hIPxHm9sRJ30mc)

위와같은 구조로 폴더와 파일 구조를 만들어줍니다
src와 stories 라는 폴더를 만들어줍니다
src는 게시글을 게시하기위한 용도 이고 stories에서 모든 글을 관리합니다

먼저 간단한 부분인 strories를 설명하겠습니다

### stories 란

I use the folder name as the ID to link src and stories.
For readability, I set the title and the folder name to be the same.
The articleId is a variable that stores the ID from the return value when the article is created, so after creating it, I assign the return value to this variable.
The title is the title of the article, and tags are the article's tags.

Here, the title is the most important piece of information.
You can store images in a blog platform you can use for free and reference them in Markdown.
I plan to use Notion and set it to "private" so only I can view it.
This way, I can manage Git's storage while using images in Markdown.

I thought it would be inconvenient to create a separate post just for images on Medium, so rather than making another account for images, I prefer to manage everything with a single account.

In the main code, I use the folder name from stories to fetch the necessary information.

In other words, the title serves as both the article's title and the ID to retrieve and post the article on the blog, as well as for calling the image in the blog from the Markdown.
I have set it up as follows:

src와 stories를 연결해줄 id값으로 폴더명을 사용합니다
저는 읽기쉽게 title과 폴더명을 동일하게 설정했습니다
articleId는 생성했을때 return값에서 보이기때문에 생성후 리턴값을 넣어주는 변수입니다
title은 글제목입니다
tags는 기사의 태그입니다

여기서 title은 중요한 정보입니다
본인이 무료로 사용할수있는 블로그에 이미지를 저장하고 markdown으로 호출해줄 예정입니다
저는 notion 사용할 예정이고 본인만 보기를 설정하려합니다.
그러면 markdown에서 image를 가져다쓰면서 git의 용량을 관리할수있습니니다

medium에서 이미지용 글을 별도로 만든다면 보기 불편하다고 생각했고
다른 이미지용 어카운트를 만들기보단 하나의 어카운트로 관리하고싶었습니다

main에서는 stories의 폴더명을 이용해 정보를 가져옵니다

즉 제목은 글의 제목이기도 하지만 이미지를 호출하는 블로그와 main에서 해당 글을 조회, 게시 하기위한 id입니다
아래와 같이 설정했습니다

```typescript
const articleId = "";
const title = "How to manage Medium posts in Git as Markdown files";
const tags = ["medium", "git", "markdown", "typescript", "medium-sdk-nodejs"];

export default { articleId, title, tags };
```

이제 stories의 설명이 끝났습니다.

### src쪽의 실행부분

main, interface, mediumService가 있습니다 먼저 interface를 봐줍니다

#### GenerateConfig

1. **accessToken**: Medium token
   - Your Medium API token for authentication.
2. **directoryName**:
   - The name of the directory, typically used to link the article or content.
3. **actionType**:

   - The type of action (e.g., "create", "update", etc.) to be performed on the article or content.

4. **publishStatus**:
   - The publish status of the article (e.g., "draft", "published").

그리고 발행 상태를 관리할 interface와
article에서 설정했던 값도 interface로 남겼습니다

config를 호출할때 사용할 interface입니다
config에서 부터 사용하지않은 이유는 글을 설정하고 배포하는쪽에 코드는 최대한 줄여 가독성을 높이고 싶었습니다

```typescript
export interface GenerateConfig {
  accessToken: string;
  directoryName: string;
  actionType: "get" | "create" | "update"; // get, create (not exist update, delete api)
  publishStatus: "draft" | "public" | "unlisted"; // 발행 상태
}

export interface ArticleConfig {
  articleId?: string;
  title: string;
  tags: string[];
}
```

이제 main을 볼차례입니다
아래와같습니다
env로 token값을 호출하고 article을 get, post를 할수있습니다

글작성이 끝나면 유저는 설정해야하는 부분은 generateConfig만 수정후 실행하면되는 방식입니다
update와 delete는 medium에서 지원하지않기때문에 고민해본결과 수정이 하고싶으면 본인이 원하는 만큼 draft로 발행하고
만족스러운 수정안이 나오면 복사 붙여넣기를 하는 방법이 유일했습니다

위와같이 설정이 끝났으면 호출하는 곳으로 갑니다

최하단에 아래와같이 설정합니다
Now, let's look at the main part.
In this setup, the token value is retrieved from the environment (env), and you can perform both get and post actions on articles.

Once the article is written, the user only needs to modify the generateConfig and run it to execute the action.

Since Medium does not support update or delete operations, after some consideration, I concluded that the only way to modify an article is to publish it as a draft as many times as needed, and once satisfied with the changes, simply copy and paste the content.

Once the configuration is set up as described, we move on to the part where the calls are made.

At the very bottom, you need to set it up like this:

```typescript
export const getMediumArticle = async (generateConfig: GenerateConfig) => {
  const userId = await getMediumUserId(generateConfig.accessToken);
  await getArticle(userId, generateConfig);
};

export const createMediumArticle = async (generateConfig: GenerateConfig) => {
  const userId = await getMediumUserId(generateConfig.accessToken);
  const markdownArticle = await getMarkdownArticle(
    generateConfig.directoryName
  );
  await createArticle(userId, markdownArticle, generateConfig);
};
```

유저조회

```typescript
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
```

//TODO 나중에 다시 확인 조회가안된다
아래와같이 해당 유저의 게시글을 전체조회합니다.

```typescript
async function getArticle(
  userId: string,
  generateConfig: GenerateConfig
): Promise<void> {
  try {
    const response: AxiosResponse = await axios.get(
      `${mediumApiBaseUrl}/users/${userId}/publications`,
      {
        headers: {
          Authorization: `Bearer ${generateConfig.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Article got successfully:", response.data);
  } catch (err: any) {
    console.error(
      "Error getting article:",
      err.response ? err.response.data : err.message
    );
  }
}
```

생성의 경우에는 아래처럼 directoryName를 먼저 설정한대로 하고 그대로 호출합니다

```typescript
const getMarkdownArticle = async (directoryName: string): Promise<string> => {
  const path = `stories/${directoryName}/article.md`;
  return await fs.readFile(path, "utf8");
};
```

읽어온 정보를 아래와같이 출력하면됩니다

```typescript
async function createArticle(
  userId: string,
  markdownArticle: string,
  generateConfig: GenerateConfig
): Promise<void> {
  try {
    const contentFormat: string = "markdown";
    const articleConfig: ArticleConfig = await import(
      `../stories/${generateConfig.directoryName}/config.ts`
    ).then((data) => {
      return data.default;
    });
    // 글 게시 API 호출
    const response: AxiosResponse = await axios.post(
      `${mediumApiBaseUrl}/users/${userId}/articles`,
      {
        title: articleConfig.title,
        contentFormat: contentFormat,
        content: markdownArticle,
        publishStatus: generateConfig.publishStatus,
        tags: articleConfig.tags,
      },
      {
        headers: {
          Authorization: `Bearer ${generateConfig.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Article created successfully:", response.data);
  } catch (err: any) {
    console.error(
      "Error creating article:",
      err.response ? err.response.data : err.message
    );
  }
}
```

모든 작업이 끝났다면 본인의 글을 markdown으로 정리하고 배포해보세요
이전 기술블로그에서는 직접 작성하였었지만 markdown으로 이런식으로 작성하는게 개발자로서 더 힙하게 느껴져서
이렇게 하게되었습니다

의견은 언제든 환영합니다

### Git Repository

[Medium SDK for Node.js](https://github.com/Medium/medium-sdk-nodejs)

### Reference

[Medium SDK for Node.js](https://github.com/Medium/medium-sdk-nodejs)
[Medium API Docs](https://github.com/Medium/medium-api-docs)
[ChatGPT](https://chatgpt.com)
