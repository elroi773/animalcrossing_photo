// PagesWrapper.jsx
import { Routes, Route } from "react-router-dom";
import TakePhoto from "./Take_photo";
import Gallery from "./Gallery";

export default function PagesWrapper() {
  return (
    <Routes>
      <Route path="/take-photo" element={<TakePhoto />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
}
