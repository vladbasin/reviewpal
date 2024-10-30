import { Grid2, CircularProgress, Typography } from '@mui/material';
import type { LoadableStateType } from '@reviewpal/web/state';
import { FillAreaGrid, GenericAlert } from '@reviewpal/web/ui';

type LoadingStatePropsType = LoadableStateType;

export const LoadingState = ({ status, error }: LoadingStatePropsType) => {
  return status === 'success' ? null : (
    <FillAreaGrid center fullHeight>
      <Grid2>
        {status !== 'error' && <CircularProgress />}
        {error && (
          <GenericAlert variant="standard" severity="error">
            <Typography>{error}</Typography>
          </GenericAlert>
        )}
      </Grid2>
    </FillAreaGrid>
  );
};
