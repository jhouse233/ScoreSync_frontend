import { useState } from 'react'

import './App.css'

import Header from '../Header/Header.jsx';
import Features from '../Features/Features.jsx';
import Introduction from '../Introduction/Introduction.jsx';

function App() {

  return (
    <div className="page">
      <div className="page__content">
        <Header/>
        <Introduction/>
        <Features/>


      </div>
    </div>
  )
}

export default App;
