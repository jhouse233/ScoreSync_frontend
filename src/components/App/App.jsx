import { useState } from 'react'

import './App.css'

import Header from '../Header/Header.jsx';
import Features from '../Features/Features.jsx';
import Introduction from '../Introduction/Introduction.jsx';

import EditorHeader from '../Editor/EditorHeader/EditorHeader.jsx';
import Toolbar from '../Editor/Toolbar/Toolbar.jsx';



function App() {

  return (
    <div className="page">
      <div className="page__content">
        <Header/>
        <Introduction/>
        <Features/>
        <EditorHeader />
        <Toolbar />


      </div>
    </div>
  )
}

export default App;
