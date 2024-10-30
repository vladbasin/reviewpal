export type InteractivePrCommentTemplatePlaceholdersType = {
  content: string;
  onBehalfOf: string;
};

export const InteractivePrCommentTemplate = `>on behalf of **{{onBehalfOf}}** (via **Review Pal**)
{{content}}`;
