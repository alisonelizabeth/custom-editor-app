import * as monaco from "monaco-editor";

export const monarchLanguage = <monaco.languages.IMonarchLanguage>{
  defaultToken: 'invalid',
  keywords: [
    'COMPLETE', 'ADD',
  ],
  typeKeywords: ['TODO'],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-zA-Z_$][\w$]*/, {
        cases: {
          '@keywords': { token: 'keyword' },
          '@typeKeywords': { token: 'type' },
          '@default': 'identifier'
        }
      }],
      // whitespace
      { include: '@whitespace' },
      // strings for todos
      [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
      [/"/, 'string', '@string'],
    ],
    whitespace: [
      [/[ \t\r\n]+/, ''],
    ],
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ]
  },
}

export const languageConfiguration: monaco.languages.LanguageConfiguration = {
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
};
