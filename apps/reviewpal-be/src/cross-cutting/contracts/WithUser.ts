export type WithUser<T> = T & {
  userId: string;
  userName: string;
};
