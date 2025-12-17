import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import ScoreProvider  from '../../contexts/ScoreContext.jsx';
import './App.css'

import Header from '../Header/Header.jsx';
import Features from '../Features/Features.jsx';
import Introduction from '../Introduction/Introduction.jsx';

import LoginPage from '../Login/LoginPage/LoginPage.jsx';
import RegisterPage from '../Register/RegisterPage/RegisterPage.jsx';
import DashboardPage from '../Editor/Dashboard/DashboardPage/DashboardPage.jsx';
import EditorLayout from '../Editor/EditorLayout/EditorLayout.jsx';
import EditorPage from '../Editor/EditorLayout/EditorPage.jsx';

import DesktopOnly from '../DesktopOnly/DesktopOnly.jsx';

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
        <Routes>
          <Route
            path='/'
            element={
              <>
                <Introduction/>
                <Features/>
              </>
            }
          />
          {/* Auth Pages */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          {/* Dashboard */}
          <Route path='/dashboard' element={<DashboardPage />} />

          {/* Desktop-only message page */}
          <Route path='/desktop-only' element={<DashboardPage />} />
          
          {/* Editor */}
          <Route
            path='/editor'
            element={
                <EditorPage
                  isKeyBoardVisible={isKeyBoardVisible}
                  toggleKeyboard={toggleKeyboard}
                />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App;
