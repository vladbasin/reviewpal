import { Stack, Step, StepLabel, Stepper } from '@mui/material';
import {
  InteractivePrReviewerBoard,
  InteractivePrReviewerForm,
  InteractivePrReviewerSummary,
  InteractivePrReviewerWizardStepActions,
} from '@reviewpal/web/ui';
import { useState, useCallback, useMemo } from 'react';

const Steps = ['Configure', 'Review & Comment', 'Done'];
const ConfigureStepIndex = 0;
const ReviewAndCommentStepIndex = 1;
const DoneStepIndex = 2;

export const InteractivePrReviewerWizard = () => {
  const [activeStep, setActiveStep] = useState(0);

  const isBackAllowed = activeStep > 0;
  const isDone = activeStep === DoneStepIndex;
  const isConfigure = activeStep === ConfigureStepIndex;
  const handleNext = useCallback(
    () => (isDone ? setActiveStep(ConfigureStepIndex) : setActiveStep(activeStep + 1)),
    [activeStep, isDone]
  );
  const handleBack = useCallback(() => isBackAllowed && setActiveStep(activeStep - 1), [activeStep, isBackAllowed]);
  const nextLabel = useMemo(() => (isDone ? 'Start over' : 'Next'), [isDone]);

  const stepActions = useMemo(
    () =>
      isConfigure ? null : (
        <InteractivePrReviewerWizardStepActions
          onBack={handleBack}
          onNext={handleNext}
          isNextAllowed
          isBackAllowed={isBackAllowed}
          nextLabel={nextLabel}
        />
      ),
    [isBackAllowed, nextLabel, handleBack, handleNext, isConfigure]
  );

  return (
    <Stack spacing={4}>
      <Stepper activeStep={activeStep}>
        {Steps.map((label, index) => (
          <Step key={label} completed={activeStep > index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === ConfigureStepIndex && <InteractivePrReviewerForm onSuccess={handleNext} />}
      {activeStep === ReviewAndCommentStepIndex && <InteractivePrReviewerBoard />}
      {activeStep === DoneStepIndex && <InteractivePrReviewerSummary />}
      {stepActions}
    </Stack>
  );
};
