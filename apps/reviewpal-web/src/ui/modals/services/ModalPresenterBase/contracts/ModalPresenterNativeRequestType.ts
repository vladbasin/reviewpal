export type ModalPresenterNativeRequestType<TOptions> = {
  Presenter: string;
  command: 'show' | 'hide';
  id: string;
  autoHide: boolean;
  options?: TOptions;
};
