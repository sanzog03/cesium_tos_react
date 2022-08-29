import React from 'react';
import './App.css';
import FCXViewer from './modules/cesium';

function App() {
  return (
    <div className="App">
      <React.StrictMode>
        <FCXViewer/>
      </React.StrictMode>
    </div>
  );
}

export default App;
