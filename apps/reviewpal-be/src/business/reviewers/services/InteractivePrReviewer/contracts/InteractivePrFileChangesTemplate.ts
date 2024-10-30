export type InteractivePrFileChangesTemplatePlaceholdersType = {
  filename: string;
  status: string;
  patch: string;
};

export const InteractivePrFileChangesTemplate = `-----------------------
Filename: {{filename}}
Status:{{status}}
Changes (patch):
{{patch}}`;
