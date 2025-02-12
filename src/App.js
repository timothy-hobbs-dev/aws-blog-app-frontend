// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MyPics from './components/MyPics';
import AllPics from './components/AllPics';
import RecycleBin from './components/RecycleBin';
import Landing from './components/Landing';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/start" element={<Landing />}/>
            <Route path="/" element={<AllPics />} />
            <Route path="/my-pics" element={<MyPics />} />
            <Route path="/recycle-bin" element={<RecycleBin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;