# How to Manage Medium Posts in Git as Markdown Files

I wanted to create a tech blog that I can manage with **Markdown** and **GitHub**.
I’ve been considering **Medium** because it supports **Markdown** and is one of the most popular blogging platforms, which makes it an appealing choice.
For a simple and lightweight setup, I thought **Node.js** would be a great fit. Plus, it offers an official SDK (**medium-sdk-nodejs**), which seemed like the best option for my needs.

**Tech Stack**

- Node.js v20.xx
- TypeScript
- VSCode
- Git
- Notion

## Setting Up the Project

1. **Notion Setup**  
   First, I set up a **Notion** account to store images (though you can use a different service if you prefer).
2. **Create Git Repository**  
   Then, I created a new Git repository to keep everything version-controlled.
3. **Configure VSCode**  
   Next, I opened VSCode and configured a few basic settings, such as enabling "Format on Save" for a smoother workflow.
4. **VSCode Extension**  
   Next, install extension **Markdown All in One**
5. **Running Commands with Bash**  
   Finally, I ran the necessary commands using **Bash**.

**VSCode Extension**

I was trying to automatically add syntax highlighting for things like Node, Npm, Typescript and so on.
There are too many keywords required.I want to manage the post files as complete versions.So, what I found as a compromise was a VSCode extension.
There’s an extension called 'Markdown All in One', and getting familiar with it seems like it will improve efficiency moving forward.
Once all your work is done, try organizing and publishing your post in Markdown. In my previous tech blog, I wrote it directly, but writing it this way in Markdown feels more 'developer-like' and cool, so I decided to go with it.

**Running Commands with Bash**

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

**TypeScript Setup**

I wrote and executed the code in TypeScript, so I also installed the necessary dependencies. To run the code directly from the terminal, I needed to install `tsx` globally.
Additionally, I set up the JSON configuration and modified the script to run it using the `npm run dev` command.

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

## Let's Start

![NotionImage](https://img.notionusercontent.com/s3/prod-files-secure%2F6ab3efe6-44b5-4e5c-9d86-56543fb7f59d%2Fb3fd5609-9abd-401f-ac06-f649e63940e1%2Fimage.png/size/w=2000?exp=1728020105&sig=3VS1Sb0fxrRsGYHJs6MWHAitmkji6hIPxHm9sRJ30mc)

I'll create the folder and file structure as shown above. There will be two folders: `src` and `stories`.

- `src` folder will be used for creating and posting articles.
- `stories` folder will be used to store and manage all the articles.

First, I'll explain the `stories` part, as it’s the simpler of the two.

## What is `stories`?

I use the folder name as an ID to link `src` and `stories`.
For better readability, I make the title and folder name the same.

The `articleId` is a variable that stores the ID returned when the article is created. After creating the article, I assign this value to the `articleId` variable.  
The `title` refers to the article's title, and `tags` are the article's associated tags.

Here, the **title** is the most important piece of information.  
You can store images on a free blogging platform and reference them in your Markdown.  
I plan to use **Notion**, set to "private" so that only I can access it. This way, I can manage the storage in **Git** while still using images in my Markdown.

I thought it would be inconvenient to create a separate post just for images on **Medium**, so instead of creating a separate account for storing images, I prefer to manage everything with a single account.

In the main code, I use the folder name from `stories` to fetch the necessary information.

In other words, the **title** acts as both the article's title and the ID used to retrieve and post the article on the blog. It’s also used to reference the image in the blog from the Markdown.

Here’s how I set it up:

```typescript
const articleId = "";
const title = "How to manage Medium posts in Git as Markdown files";
const tags = ["medium", "git", "markdown", "typescript", "medium-sdk-nodejs"];
export default { articleId, title, tags };
```

Now that we've covered the `stories` part, let's move on to the execution part in `src`.

## Execution in `src`

There are three main sections: `main`, `interface`, and `mediumService`. Let's begin by taking a look at the `interface`.

### GenerateConfig

1. **accessToken**: Medium token
   - Your Medium API token for authentication.
2. **directoryName**:
   - The name of the directory, typically used to link the article or content.
3. **actionType**:

   - The type of action (e.g., "create", "update", etc.) to be performed on the article or content.

4. **publishStatus**:
   - The publish status of the article (e.g., "draft", "published").

"I’ve also created an interface to manage the publishing status and kept the values set in the article as an interface. This is the interface to be used when calling the config. The reason I didn’t use it directly from the config is that I wanted to minimize the code in the sections responsible for setting up and publishing the article, to improve readability."

Let me know if you'd like further adjustments!

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

get user api

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

get user post all

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

"For creation, we first set the directoryName as shown below, and then call it as is."

If you need more context or details added, feel free to let me know!

```typescript
const getMarkdownArticle = async (directoryName: string): Promise<string> => {
  const path = `stories/${directoryName}/article.md`;
  return await fs.readFile(path, "utf8");
};
```

"You can output the read information as shown below."

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

Feedback is always welcome."

### Git Repository

[My repository](h)

### Reference

[Medium SDK for Node.js](https://github.com/Medium/medium-sdk-nodejs)
[Medium API Docs](https://github.com/Medium/medium-api-docs)
[ChatGPT](https://chatgpt.com)
