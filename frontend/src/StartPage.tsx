import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo_black.png';
import SymphonicLogo from './assets/symphonic_logo.png';
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
            <div className="tag" style={{marginBottom:'24px'}}>
                <img src={SymphonicLogo} alt="Symphonic Logo" style={{ width: '24px'}}/>
                Powered by Symphonic
            </div>
            <div className="videoContainer">
                <img src={Tmp}/>
                    <button className="button purple" onClick={goToNextPage}> <img src={Record} alt="Record button"/>Record video</button>
            </div>
            <h3>Speak, Even When You Can’t.</h3>
        </div>
    );
}

export default StartPage;
