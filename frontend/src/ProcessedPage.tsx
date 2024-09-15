import { useNavigate } from 'react-router-dom';
import Logo from './assets/logo_black.png';
import SymphonicLogo from './assets/symphonic_logo.png';
import Tmp from './assets/test_image.png';
import Record from './assets/record.png';
import Download from './assets/download.svg';
import './App.css';

function ProcessedPage() {
  const handleRecordNewVideo = () => {
    console.log('Record new video');
  }

  const handleDownloadVideo = () => {
    console.log('Download video');
  }
  return (
    <div className="container">
            <img src={Logo} alt="Logo" style={{ width: '118px', marginBottom:'60px'}}/>
            <div className="tag" style={{marginBottom:'24px'}}>
                <img src={SymphonicLogo} alt="Symphonic Logo" style={{ width: '24px'}}/>
                Powered by Symphonic
            </div>
            <div className="videoContainer">
                <img src={Tmp}/>
                <div style={{display:"flex"}}>
                  <button className="button purple" onClick={handleRecordNewVideo}> 
                    <img src={Record} alt="Record new video"/>
                    Record video
                  </button>
                  <button className="button black" onClick={handleDownloadVideo}> 
                    <img src={Download} alt="Download video"/>
                    Download video
                  </button>
                </div>
            </div>
            <h3>Speak, Even When You Can’t.</h3>
        </div>
  );
}

export default ProcessedPage;
