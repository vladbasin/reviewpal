import { AddCircle } from '@mui/icons-material';
import { Grid2, IconButton } from '@mui/material';
import type { AsyncDataTableFooterOptionsType } from '@reviewpal/web/ui';
import { TitledPageContainer, useTitle, withAuth } from '@reviewpal/web/ui';
import type { Maybe } from '@vladbasin/ts-types';
import type { ComponentType, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { isNil } from 'lodash';

type CrudAdminPagePropsType<TItemTarget> = {
  title: string;
  DataTableComponent: ComponentType<{
    onItemClick: (target: TItemTarget) => void;
    footer: (options: AsyncDataTableFooterOptionsType<TItemTarget>) => ReactNode;
  }>;
  FormComponent?: ComponentType<{
    target: Maybe<TItemTarget>;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (item?: TItemTarget) => void;
    onDelete?: (item: TItemTarget) => void;
  }>;
};

export const CrudAdminPage = withAuth(
  ['admin'],
  <IItemTarget,>({ title, DataTableComponent, FormComponent }: CrudAdminPagePropsType<IItemTarget>) => {
    useTitle(title);

    const [selectedTarget, setSelectedTarget] = useState<Maybe<IItemTarget>>();
    const [isManageDialogOpen, setIsMangeDialogOpen] = useState<boolean>(false);

    const handleUserClick = useCallback((target: IItemTarget) => {
      setSelectedTarget(target);
      setIsMangeDialogOpen(true);
    }, []);

    const handleManageDialogClose = useCallback(() => {
      setIsMangeDialogOpen(false);
      setSelectedTarget(undefined);
    }, []);

    const handleCreate = useCallback(() => {
      setSelectedTarget(undefined);
      setIsMangeDialogOpen(true);
    }, []);

    return (
      <TitledPageContainer
        title={title}
        adornment={
          <IconButton size="small" onClick={handleCreate}>
            <AddCircle />
          </IconButton>
        }
      >
        <Grid2>
          <DataTableComponent
            onItemClick={handleUserClick}
            footer={({ onEdit, onDelete }) =>
              !isNil(FormComponent) && (
                <FormComponent
                  target={selectedTarget}
                  isOpen={isManageDialogOpen}
                  onClose={handleManageDialogClose}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              )
            }
          />
        </Grid2>
      </TitledPageContainer>
    );
  }
) as <IItemTarget>(props: CrudAdminPagePropsType<IItemTarget>) => ReactNode;
