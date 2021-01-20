import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Editor } from './components';
import { setupLanguage } from './language';

setupLanguage();

const App = () => <Editor languageId="todoLang" />;

ReactDOM.render(<App />, document.getElementById('container'));
