
import '../../App.css';
import Navbar from "../Navbar.jsx";
import { PencilSquareIcon,TableCellsIcon,PresentationChartBarIcon,ClipboardDocumentListIcon,UserGroupIcon} from '@heroicons/react/24/solid'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import DataMurid from "./data_murid/DataMurid.jsx";
import {useEffect, useState} from "react";


function App() {
    const [admin, setAdmin] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user)
        if (user) {
            setAdmin(user);
        }
    }, []);
    return (
        <div>
            <Navbar/>


            <a href="http://192.168.0.3:3000/data-murid">
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
            <a href="http://192.168.0.3:3000/rekap-nilai">
                <div className="mr-3 ml-3 mt-3 p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
                    <div className="shrink-0">
                        <TableCellsIcon className="h-10 w-10" aria-hidden="true" color="orange" />

                    </div>

                    <div>
                        <div className="text-xl font-medium text-black">Rekap Nilai</div>
                        <p className="text-slate-500">Catat, lihat dan edit nilai Ujian semester/Rapot Murid disini</p>
                    </div>

                </div>
            </a>
            {
                admin.super_admin &&
                <a href="http://192.168.0.3:3000/informasi">
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

            <h1>Selamat datang, {admin.nama || 'Pengguna'}</h1>
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
