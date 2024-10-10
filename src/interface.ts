export interface PostCreationConfig {
  accessToken: string; // Notion integration token
  folderName: string; // Title of the post
  actionType: "get" | "create" | "update"; // Action type: get, create (no update or delete API available)
  publishStatus: "draft" | "public" | "unlisted"; // Publish status from Medium
}

export interface PostConfig {
  postId?: string; // Medium article ID when using the medium-node-sdk to post
  title: string; // Title of the post
  tags: string[]; // Tags associated with the post
}
