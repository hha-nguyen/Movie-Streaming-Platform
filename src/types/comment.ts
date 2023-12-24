export interface Comment {
  content: string;
  createdAt: string;
  user: {
    displayName: string;
    photoURL: string | null;
  };
}
