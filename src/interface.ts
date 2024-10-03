export interface GenerateConfig {
  mediumToken: string;
  postFolderName: string;
  pushType: "get" | "create" | "update"; // create 또는 update
  publishStatus: "draft" | "public" | "unlisted"; // 발행 상태
}

export interface PostConfig {
  postId?: string;
  title: string;
  tags: string[];
}
