import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    <div className="App">
      <h1>Video Processing App</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="video/*" />
        <button type="submit" disabled={isLoading || !file}>
          {isLoading ? 'Processing...' : 'Process Video'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default App
