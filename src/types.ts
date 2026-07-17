export interface Member {
  id: string;
  name: string;
  avatar: string; // 首字母或emoji
  url: string;
  color: string; // 品牌主色
}

export interface Message {
  id: string;
  senderId: string; // 'me' 或成员 id
  type: "text" | "image";
  content: string; // 文本内容或图片 DataURL
  mentionedIds?: string[]; // 被@的成员 id
  timestamp: number;
}

export interface FloatWindowState {
  memberId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  zIndex: number;
}
