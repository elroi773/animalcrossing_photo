// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Intro from "./intro";
import TakePhoto from "./Take_photo";
import Gallery from "./Gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/take-photo" element={<TakePhoto />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
