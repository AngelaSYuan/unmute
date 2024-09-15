import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Tmp from './assets/test_image.png';
import Record from './assets/record.png';
import axios from 'axios';
import { useState } from 'react';
import './App.css';


function StartPage() {
    const navigate = useNavigate(); // Hook to programmatically navigate to a route

    const [file, setFile] = useState<File | null>(null)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRecording, setIsRecording] = useState(false);

    const handleRecording = () => { 
        if (!isRecording) {
            setIsRecording(true);
            return;
        }
        setIsRecording(false);
        // TODO: handleSubmit
        navigate('/processed'); // Navigate to Page 2
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
        setFile(event.target.files[0])
        setMessage('') // Clear previous messages
        }
    }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      setMessage('Please select a file')
      return
    }

    setIsLoading(true)
    setMessage('Processing video...')

    const formData = new FormData()
    formData.append('video', file)

    console.log('Sending request to backend...')
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/process_video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Response received:', response.data)
      setMessage(response.data.result || 'Video processed successfully')
    } catch (error) {
      console.error('Error details:', error)
      if (axios.isAxiosError(error)) {
        setMessage(`Error: ${error.response?.data || error.message}`)
      } else {
        setMessage('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

    return (
        <div className="container">
            <Header />
            <div className="videoContainer">
                <img src={Tmp}/>
                {!isRecording && <button className="button purple" onClick={handleRecording} style={{width:'100%'}}>
                        <img src={Record} alt="Record button"/>
                        Record video
                </button>}
                {isRecording && <button className="button red" onClick={handleRecording} style={{width:'100%'}}>
                    <img src={Record} alt="Record button"/>
                    Stop recording
                </button>}
                <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="video/*" />
                <button type="submit" disabled={isLoading || !file}>
                {isLoading ? 'Processing...' : 'Process Video'}
                </button>
            </form>
            {message && <p>{message}</p>}
            </div>
            <h3>Speak, Even When You Can’t.</h3>
        </div>
    );
}

export default StartPage;
