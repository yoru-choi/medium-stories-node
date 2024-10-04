export interface GenerateConfig {
  accessToken: string;
  directoryName: string;
  actionType: "get" | "create" | "update"; // get, create (not exist update, delete api)
  publishStatus: "draft" | "public" | "unlisted"; // 발행 상태
}

export interface PostConfig {
  postId?: string;
  title: string;
  tags: string[];
}
