import React, { useState, FunctionComponent } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface Props {
  languageId: string
}

export const Editor: FunctionComponent<Props> = ({
  languageId
}) => {
  const [code, setCode] = useState<string>('');

  const options = {
    selectOnLineNumbers: true
  };

  const editorDidMount = (editor: any) => {
    editor.focus();
  }

  return (
    <MonacoEditor
      width="800"
      height="600"
      language={languageId}
      theme="vs-dark"
      value={code}
      options={options}
      editorDidMount={editorDidMount}
    />
  );
};
