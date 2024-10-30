import { Button, Stack } from '@mui/material';

type InteractivePrReviewerWizardStepActionsPropsType = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextAllowed: boolean;
  isBackAllowed: boolean;
};

export const InteractivePrReviewerWizardStepActions = ({
  onBack,
  onNext,
  nextLabel,
  backLabel,
  isNextAllowed,
  isBackAllowed,
}: InteractivePrReviewerWizardStepActionsPropsType) => {
  return (
    <Stack direction="row" justifyContent="flex-end" spacing={2}>
      {isBackAllowed && (
        <Button variant="outlined" onClick={onBack}>
          {backLabel ?? 'Back'}
        </Button>
      )}
      {isNextAllowed && (
        <Button variant="contained" onClick={onNext}>
          {nextLabel ?? 'Next'}
        </Button>
      )}
    </Stack>
  );
};
