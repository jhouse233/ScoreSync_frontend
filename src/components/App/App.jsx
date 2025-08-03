import { useState } from 'react'

import './App.css'

import Header from '../Header/Header.jsx';
import Features from '../Features/Features.jsx';
import Introduction from '../Introduction/Introduction.jsx';

import EditorHeader from '../Editor/EditorHeader/EditorHeader.jsx';
import Toolbar from '../Editor/Toolbar/Toolbar.jsx';
import StaffCanvas from '../Editor/StaffCanvas/StaffCanvas.jsx';
import Keyboard from '../Editor/Keyboard/Keyboard.jsx';
import PianoInput from '../Editor/PianoInput/PianoInput.jsx';


function App() {

  const [isKeyBoardVisible, setIsKeyBoardVisible] = useState(false);

  const toggleKeyboard = () => {
    setIsKeyBoardVisible(prev => !prev);
  }

  return (
    <div className="page">
      <div className="page__content">
        <Header/>
        <Introduction/>
        <Features/>
        <EditorHeader />
        <Toolbar 
          isKeyBoardVisible={isKeyBoardVisible}
          toggleKeyboard={toggleKeyboard}
        />
        <StaffCanvas />
 
        {isKeyBoardVisible && (
          <div className="keyboard-overlay">
            <PianoInput onClose={toggleKeyboard} />
          </div>
        )}

      </div>
    </div>
  )
}

export default App;
