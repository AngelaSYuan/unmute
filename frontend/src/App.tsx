import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import ProcessedPage from './ProcessedPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/processed" element={<ProcessedPage />} />
      </Routes>
    </Router>
  );
}

export default App;

