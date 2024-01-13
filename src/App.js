
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataMurid from "./component/pages/data_murid/DataMurid.jsx";
import Beranda from "./component/pages/Beranda.jsx";
import { Auth } from "./component/pages/auth/Auth.jsx";
import AuthRedirect from './component/pages/auth/AuthRedirect.jsx';
import RekapNilai from "./component/pages/rekap_nilai/RekapNilai.jsx";
import {Informasi} from "./component/pages/informasi/Informasi.jsx";
import PanelUjian from "./component/pages/taftisan/PanelUjian.jsx";
import {ProfilUser} from "./component/pages/ProfilUser.jsx";
import {ListMustahiq} from "./component/pages/informasi/list_mustahiq/ListMustahiq.jsx";
import {MuridBoyongPage} from "./component/pages/data_murid/MuridBoyongPage.jsx";
import {ScannerMasukUjian} from "./component/pages/taftisan/ScannerMasukUjian.jsx";
import {QRGenerator} from "./component/pages/taftisan/QRGenerator.jsx"; // Import komponen baru

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
                    <Route path="/taftisan" element={< PanelUjian/>} />
                    <Route path="/profil-pengguna" element={< ProfilUser/>} />
                    <Route path="/list-mustahiq" element={< ListMustahiq/>} />
                    <Route path="/murid-boyong" element={< MuridBoyongPage/>} />
                    <Route path="/masuk-ujian" element={< ScannerMasukUjian/>} />
                    <Route path="/buat-qr" element={< QRGenerator/>} />
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
