import { useNavigate } from 'react-router-dom';
import Header from './Header';
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
            <Header />
            <div className="videoContainer">
                <img src={Tmp}/>
                <button className="button purple" onClick={goToNextPage} style={{width:'100%'}}>
                        <img src={Record} alt="Record button"/>
                        Record video
                </button>
            </div>
            <h3>Speak, Even When You Can’t.</h3>
        </div>
    );
}

export default StartPage;
