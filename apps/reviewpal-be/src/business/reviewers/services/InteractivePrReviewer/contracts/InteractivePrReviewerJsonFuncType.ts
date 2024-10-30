import type { JSONSchemaType } from 'ajv';
import type { ObjectSchema } from 'yup';
import { array, number, object, string } from 'yup';

export type InteractivePrReviewerJsonFuncType = {
  codeSuggestions: {
    filename: string;
    lineNumber: number;
    lineIdSubstring: string;
    suggestion: string;
  }[];
};

export const InteractivePrReviewerJsonFuncTypeSchema: ObjectSchema<InteractivePrReviewerJsonFuncType> = object({
  codeSuggestions: array()
    .of(
      object({
        filename: string().required(),
        lineNumber: number().required(),
        lineIdSubstring: string().required(),
        suggestion: string().required(),
      })
    )
    .required(),
});

export const InteractivePrReviewerJsonFuncDescription = 'Save code suggestions for a PR review';

export const InteractivePrReviewerJsonFuncSchema: JSONSchemaType<InteractivePrReviewerJsonFuncType> = {
  type: 'object',
  properties: {
    codeSuggestions: {
      type: 'array',
      items: {
        type: 'object',
        description: 'An array of code suggestions, describing the code suggestions for a PR review',
        properties: {
          filename: { type: 'string', description: 'The name of the file' },
          lineNumber: { type: 'number', description: 'The line number of the code suggestion inside this file' },
          lineIdSubstring: {
            type: 'string',
            description: 'Substring of the line with code suggestion that uniquely identifies the line',
          },
          suggestion: { type: 'string', description: 'The content of the suggestion in markdown format' },
        },
        required: ['filename', 'lineNumber', 'lineIdSubstring', 'suggestion'],
      },
    },
  },
  required: ['codeSuggestions'],
};
