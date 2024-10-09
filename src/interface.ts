export interface PostCreationConfig {
  accessToken: string;
  directoryName: string;
  actionType: "get" | "create" | "update"; // get, create (not exist update, delete api)
  publishStatus: "draft" | "public" | "unlisted";
}

export interface PostConfig {
  postId?: string;
  title: string;
  tags: string[];
}
