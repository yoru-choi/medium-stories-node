# How to Manage Medium Posts in Git as Markdown Files

I wanted to create a tech blog that I can manage with **Markdown** and **GitHub**.
I’ve been considering **Medium** because it supports **Markdown** and is one of the most popular blogging platforms, which makes it an appealing choice.
For a simple and lightweight setup, I thought **Node.js** would be a great fit. Plus, it offers an official SDK (**medium-sdk-nodejs**), which seemed like the best option for my needs.

**Tech Stack**

- Node.js v22.9.0
- TypeScript
- VSCode
- Git
- Notion

## Setting Up the Project

1. **Notion Setup**  
   First, I set up a **Notion** account to store images (though you can use a different service if you prefer).
   If you use Notion, you need to set it to publish mode for the image address to have no expiration.
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
There are too many keywords required. I wanted to manage the post files more easily.
So, what I found as a compromise was a VSCode extension.
There’s an extension called 'Markdown All in One', and getting familiar with it seems like it will improve efficiency moving forward.

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

![NotionImage](https://qlqjs674.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6ab3efe6-44b5-4e5c-9d86-56543fb7f59d%2Fb3fd5609-9abd-401f-ac06-f649e63940e1%2Fimage.png?table=block&id=115930ff-582f-80b9-997b-dfaa46fa3cc8&spaceId=6ab3efe6-44b5-4e5c-9d86-56543fb7f59d&width=710&userId=&cache=v2)

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
I plan to use **Notion**. This way, I can manage the storage in **Git** while still using images in my Markdown.
I thought about another way, so instead of creating a separate account for storing images, I prefer to manage everything with a single account.

In other words, **title** serves as the ID used for the page title of motion, which stores the title of the article and the Git folder name and image.

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

**GenerateConfig**

1. **accessToken**: Medium token
   Your Medium API token for authentication.
2. **directoryName**:
   The name of the directory, typically used to link the article or content.
3. **actionType**:
   The type of action (e.g., "create", "update", etc.) to be performed on the article or content.
4. **publishStatus**:
   The publish status of the article (e.g., "draft", "published").

I’ve also created an interface to manage the publishing status and kept the values set in the article as an interface. This is the interface to be used when calling the config. The reason I didn’t use it directly from the config is that I wanted to minimize the code in the sections responsible for setting up and publishing the article, to improve readability.

Let me know if you'd like further adjustments!

```typescript
export interface GenerateConfig {
  accessToken: string;
  directoryName: string;
  actionType: "get" | "create"; // get, create (not exist update, delete api)
  publishStatus: "draft" | "public" | "unlisted";
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
        Authorization: `Bearer ${token}`,
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

For creation, we first set the directoryName as shown below, and then call it as is.
If you need more context or details added, feel free to let me know!

```typescript
const getMarkdownArticle = async (directoryName: string): Promise<string> => {
  const path = `stories/${directoryName}/article.md`;
  return await fs.readFile(path, "utf8");
};
```

You can output the read information as shown below.

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
    //
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

**Why I Blog**

1. To have a reference for myself later.
2. To share knowledge in an easily understandable way.

There are several ways to make information easier to understand, but one challenge is that code highlighting doesn’t work natively on Medium. If I replace code with images, it becomes difficult to copy, and embedding something like **GitHub Gist** or **CodePen** makes the posting process more tedious. So, if code highlighting is necessary, readers can directly check the Git repository.

Once everything is ready, try organizing and publishing your post in Markdown. In my previous tech blog, I used to write directly on the platform, but using Markdown feels more 'developer-like' and professional, so I decided to stick with it.

Feedback is always welcome.

**Git Repository**
[Medium Git Repository](https://github.com/yoru-choi/medium-stories-node/tree/dev)
[This Post Git Repository](https://github.com/yoru-choi/medium-stories-node/blob/dev/stories/How%20to%20manage%20Medium%20posts%20in%20Git%20as%20Markdown%20files/post.md)
**Reference**
[Medium SDK for Node.js](https://github.com/Medium/medium-sdk-nodejs)
[Medium API Docs](https://github.com/Medium/medium-api-docs)
