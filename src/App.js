import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Top from './page/Top';
import ImageEdit from './component/imageEdit';
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/" element={<ImageEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
