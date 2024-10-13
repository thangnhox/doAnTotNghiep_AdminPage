import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd';
import MainRouter from './routers/MainRouter';
import AuthRouter from './routers/AuthRouter';

function App() {

  return (
    <div className="App">
      <AuthRouter />
    </div>
  );
}

export default App;
