import { useNavigate } from 'react-router-dom';
import Tmp from './assets/test_image.png';
import Record from './assets/record.png';
import Download from './assets/download.svg';
import Header from './Header';
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
            <Header/>
            <div className="videoContainer">
                <img src={Tmp}/>
                <div style={{display:"flex", width:'100%'}}>
                  <button className="button purple" onClick={handleRecordNewVideo} style={{width:'50%'}}> 
                    <img src={Record} alt="Record new video"/>
                    Record new video
                  </button>
                  <button className="button black" onClick={handleDownloadVideo} style={{width:'50%'}}> 
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
