import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo_black.png';
// import SymphonicLogo from './assets/symphonic_logo.png';
import PoweredBySymphonic from './assets/powered_by.png';
import Tmp from './assets/test_image.png';
import Record from './assets/record.png';
import './App.css';

function StartPage() {
    const navigate = useNavigate(); // Hook to programmatically navigate to a route

    const goToNextPage = () => {
        navigate('/processed'); // Navigate to Page 2
    };

    return (
        <div className="container">
            <img src={Logo} alt="Logo" style={{ width: '118px'}}/>
            {/* <div>
                <img src={SymphonicLogo} alt="Symphonic Logo" style={{ width: '24px'}}/>
                <p>Powered by Symphonic</p>
            </div> */}
            <img src={PoweredBySymphonic} alt="Powered by Symphonic" style={{ width: '271px'}}/>
            <div className="videoContainer">
                <img src={Tmp}/>
                    <button className="purpleButton" onClick={goToNextPage}> <img src={Record} alt="Record button"/>Record video</button>
            </div>
            <h3>Speak, Even When You Can’t.</h3>
        </div>
    );
}

export default StartPage;
