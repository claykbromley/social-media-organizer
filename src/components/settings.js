import { React, useState } from 'react';
import '../App.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { toggleDarkMode } from '../services/api.js'

function Settings ({ setOpenSettings, user, logout }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode")==='enabled');

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains('Modal')) {setOpenSettings(false)}
  };
  
  return (
    <div className='Modal' onClick={handleOutsideClick}>
      <div className='settings-modal'>
        <div style={{display:'flex', justifyContent:'right'}}>
          <button className='close-settings' onClick={() => setOpenSettings(false)}>&times;</button>
        </div>
        <div style={{display:'flex', justifyContent:'center'}}>
          <h3 style={{margin:0}}>{user}</h3>
        </div>
        <div className='settings-list'>
          <button onClick={() => {toggleDarkMode(); setDarkMode(!darkMode)}}>
            {darkMode?<MdLightMode style={{ marginRight: '10px' }}/>:
            <MdDarkMode style={{ marginRight: '10px' }}/>}
            {darkMode?"Light":"Dark"} Mode</button>
          <button onClick={logout}><FaSignOutAlt style={{ marginRight: '10px' }}/> Sign Out</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;