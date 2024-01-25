
import '../../App.css';
import Navbar from "../Navbar.jsx";
import { TableCellsIcon,PresentationChartBarIcon,ClipboardDocumentListIcon,UserGroupIcon,ClipboardDocumentCheckIcon} from '@heroicons/react/24/solid'
import {useNavigate} from "react-router-dom";

import {useEffect, useState} from "react";
import './gaya.css'
import Wave from 'react-wavify';

function App() {
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // console.log(user)
        if (user) {
            setAdmin(user);
        }
    }, []);
    return (
        <div>
            <Navbar/>

            <div className="relative mr-3 ml-3 mt-3 p-6 max-w-lg mx-auto bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl shadow-lg  items-center overflow-hidden">
                {/* Wave Animation */}
                <svg style={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                    <defs>
                        <linearGradient id="gradient" gradientTransform="rotate(90)">
                            <stop offset="20%" stopColor="#ffcba4" />
                            <stop offset="80%" stopColor="#ffb347" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Wave Animation */}
                <Wave fill='url(#gradient)'
                      paused={false}
                      options={{
                          height: 125,
                          amplitude: 20,
                          speed: 0.15,
                          points: 3
                      }}
                      className="shadow-xl absolute bottom-0 left-0 w-full"
                />

                {/* Overlay to make the wave appear rounded */}
                <div className="absolute border-black bottom-0 left-0 right-0 h-12  rounded-b-lg"></div>

                <h1 className="text-2xl italic text-center text-white z-10 relative  font-poppins">
                    Selamat datang,<br/> {admin.nama_admin || 'Pengguna'}!
                </h1>
            </div>






            <a onClick={()=>{navigate('/data-murid') }}>
                <div className="mr-3 ml-3 mt-3 p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
                    <div className="shrink-0">
                        <UserGroupIcon className="h-10 w-10" aria-hidden="true" color="orange" />

                    </div>

                    <div>
                        <div className="text-xl font-medium text-black">Data Murid</div>
                        <p className="text-slate-500">Tambah, Hapus dan Edit Data Murid disini </p>
                    </div>

                </div>
            </a>

            {/*dibawah ini jangan dihapus yaaa*/}
            {/*<a href="http://192.168.0.3:3000/">*/}
            {/*    <div className="mr-3 ml-3 mt-3 p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">*/}
            {/*        <div className="shrink-0">*/}
            {/*            <ClipboardDocumentListIcon className="h-10 w-10" aria-hidden="true" color="orange" />*/}

            {/*        </div>*/}

            {/*        <div>*/}
            {/*            <div className="text-xl font-medium text-black">Absensi</div>*/}
            {/*            <p className="text-slate-500">Catatan Absensi kegiatan belajar-mengajar Murid </p>*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*</a>*/}



            <a onClick={()=>{navigate('/rekap-nilai') }}>
                <div className="mr-3 ml-3 mt-3 p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
                    <div className="shrink-0">
                        <TableCellsIcon className="h-10 w-10" aria-hidden="true" color="orange" />

                    </div>

                    <div>
                        <div className="text-xl font-medium text-black">Rekap Nilai</div>
                        <p className="text-slate-500">Catat, lihat dan edit nilai Ujian semester/Rapot Murid </p>
                    </div>

                </div>
            </a>
            <a onClick={()=>{navigate('/taftisan') }}>
                <div className="mr-3 ml-3 mt-3 p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
                    <div className="shrink-0">
                        <ClipboardDocumentCheckIcon className="h-10 w-10" aria-hidden="true" color="orange" />

                    </div>

                    <div>
                        <div className="text-xl font-medium text-black">Panel Ujian</div>
                        <p className="text-slate-500">Fungsi / Alat untuk Ujian semester Madrasah Diniyah Darussaadah </p>
                    </div>

                </div>
            </a>


            {

                <a onClick={()=>{navigate('/informasi') }}>
                    <div className="mr-3 ml-3 mt-3 p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
                        <div className="shrink-0">
                            <PresentationChartBarIcon className="h-10 w-10" aria-hidden="true" color="orange" />
                        </div>

                        <div>
                            <div className="text-xl font-medium text-black">Informasi</div>
                            <p className="text-slate-500">Jadwal pelajaran, Jadwal Masuk, Laporan Absensi bulanan dll </p>
                        </div>
                    </div>
                </a>
            }

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
