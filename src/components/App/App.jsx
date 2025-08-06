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
import LoginPage from '../Login/LoginPage/LoginPage.jsx';
import RegisterPage from '../Register/RegisterPage/RegisterPage.jsx';
import DashboardPage from '../Editor/Dashboard/DashboardPage/DashboardPage.jsx';
import EditorLayout from '../Editor/EditorLayout/EditorLayout.jsx';

function App() {

  // const [activeModal, setActiveModal] = useState(null);

  const [isKeyBoardVisible, setIsKeyBoardVisible] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const toggleKeyboard = () => {
    setIsKeyBoardVisible(prev => !prev);
  }

  return (
    <div className="page">
      <div className="page__content">
        <Header/>
        <Introduction/>
        <Features/>
        <LoginPage />
        <RegisterPage />
        <DashboardPage />
        <EditorLayout 
          isKeyBoardVisible={isKeyBoardVisible}
          toggleKeyboard={toggleKeyboard}
        />
 
        {isKeyBoardVisible && (
          <div className="keyboard-overlay">
            <div className="keyboard-scroll">
              <PianoInput onClose={toggleKeyboard} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App;
