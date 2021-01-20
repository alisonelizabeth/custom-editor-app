import * as monaco from "monaco-editor";

export const monarchLanguage = <monaco.languages.IMonarchLanguage>{
  defaultToken: 'invalid',
  keywords: [
    'COMPLETE', 'ADD', 'DELETE',
  ],
  typeKeywords: ['TODO'],
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  tokenizer: {
    root: [
      [/[a-zA-Z_$][\w$]*/, {
        cases: {
          '@keywords': { token: 'keyword' },
          '@typeKeywords': { token: 'type' },
          '@default': 'identifier'
        }
      }],
      { include: '@whitespace' },
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
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
