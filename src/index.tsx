import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Editor } from './components';

const App = () => <Editor languageId="javascript" />;

ReactDOM.render(<App />, document.getElementById('container'));
