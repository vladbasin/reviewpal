import { Button, Stack, Typography } from '@mui/material';
import { FillAreaGrid, useTypedNavigate } from '@reviewpal/web/ui';

export const NotFoundPage = () => {
  const navigate = useTypedNavigate();

  return (
    <FillAreaGrid center fullHeight>
      <Stack alignItems="center" spacing={2}>
        <Typography>Requested page was not found</Typography>
        <Button variant="outlined" onClick={() => navigate('root', {})}>
          Go to Home Page
        </Button>
      </Stack>
    </FillAreaGrid>
  );
};
