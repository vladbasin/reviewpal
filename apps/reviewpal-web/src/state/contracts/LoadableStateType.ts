export type LoadableStateType = {
  status: LoadableStateStatusType;
  error?: string;
};

export type LoadableStateStatusType = 'idle' | 'loading' | 'success' | 'error';
