export const getCodeLanguageFromFilename = (filename: string): string => filename.split('.').pop() ?? 'text';
