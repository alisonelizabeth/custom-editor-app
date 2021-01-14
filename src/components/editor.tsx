import React, { useState, FunctionComponent } from 'react';
import MonacoEditor from 'react-monaco-editor';


interface Props {
  languageId: string
}

export const Editor: FunctionComponent<Props> = ({
  languageId
}) => {
  const [code, setCode] = useState<string>('// type your code...');

  const options = {
    selectOnLineNumbers: true
  };

  const editorDidMount = (editor: any) => {
    editor.focus();
  }

  const onChange = (newValue: any, e: any) => {
    // console.log('onChange', newValue, e);
  }

  return (
    <MonacoEditor
      width="800"
      height="600"
      language={languageId}
      theme="vs-dark"
      value={code}
      options={options}
      onChange={onChange}
      editorDidMount={editorDidMount}
    />
  );
};
