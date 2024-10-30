import { Dialog, DialogContent } from '@mui/material';
import { modalContentContainerStyle, useModalEvents } from '@reviewpal/web/ui';
import type { Result } from '@vladbasin/ts-result';
import type { PropsWithChildren, ReactNode, SyntheticEvent } from 'react';
import { Fragment, useCallback, useMemo, useState } from 'react';

export type ModalPropsType<TOptions, TResult> = PropsWithChildren<{
  Presenter: string;
  onRender: (options?: TOptions) => {
    handler: Result<TResult>;
    content: ReactNode;
  };
  mode?: 'dialog' | 'empty';
  fullScreen?: boolean;
  wrapContent?: boolean;
}>;

type DialogState = {
  id: string;
  content: ReactNode;
};

export const Modal = <TOptions, TResult>(props: ModalPropsType<TOptions, TResult>): ReactNode => {
  const { onRender, wrapContent, mode } = props;

  const [dialogs, setDialogs] = useState<DialogState[]>([]);

  const hide = useCallback((id: string) => {
    setDialogs((d) => d.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (id: string, options?: TOptions) => {
      const { handler, content } = onRender(options);

      setDialogs((d) => [
        ...d,
        {
          id,
          content,
        },
      ]);

      return handler;
    },
    [onRender]
  );

  useModalEvents<TOptions, TResult>(props.Presenter, hide, show);

  const Wrapper = useMemo(() => (wrapContent === false ? Fragment : DialogContent), [wrapContent]);
  const wrappedProps = useMemo(() => (wrapContent === false ? {} : { sx: modalContentContainerStyle }), [wrapContent]);

  const handleBackdropClick = useCallback((e: SyntheticEvent<object, Event>) => e.preventDefault(), []);

  return (
    <>
      {dialogs.map((dialog) => (
        <Fragment key={dialog.id}>
          {mode === 'empty' ? (
            dialog.content
          ) : (
            <Dialog
              id={dialog.id}
              open
              fullScreen={props.fullScreen}
              disableEscapeKeyDown
              onBackdropClick={handleBackdropClick}
            >
              <Wrapper {...wrappedProps}>{dialog.content}</Wrapper>
            </Dialog>
          )}
        </Fragment>
      ))}
    </>
  );
};
