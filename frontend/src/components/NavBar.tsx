import {NavLink} from 'react-router-dom'
import { useState } from 'react';
import SettingsModal from './SettingsModal';
export default function NavBar(){
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

    return(
      <>
      <nav className="flex justify-center gap-5">
        <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={'/'}>All Entries</NavLink>
        <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={'/create'}>New Entry</NavLink>
        <button 
          onClick={openSettings}
          className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
          > 
          Settings
          </button>
      </nav>
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
      </>

    )
}