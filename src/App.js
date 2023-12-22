
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataMurid from "./component/pages/data_murid/DataMurid.jsx";
import Beranda from "./component/pages/Beranda.jsx";
import { Auth } from "./component/pages/Auth.jsx";
import AuthRedirect from '../src/component/pages/AuthRedirect.jsx';
import RekapNilai from "./component/pages/RekapNilai.jsx";
import {Informasi} from "./component/pages/Informasi.jsx"; // Import komponen baru

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AuthRedirect />} /> {/* Gunakan di sini */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/beranda" element={<Beranda />} />
                    <Route path="/data-murid" element={<DataMurid />} />
                    <Route path="/rekap-nilai" element={<RekapNilai />} />
                    <Route path="/informasi" element={<Informasi />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

// <div className="App">
//   <header className="App-header">
//     <img src={logo} className="App-logo" alt="logo" />
//     <p>
//       Edit <code>src/App.js</code> and save to reload.
//     </p>
//     <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//     >
//       Learn React
//     </a>
//   </header>
// </div>
