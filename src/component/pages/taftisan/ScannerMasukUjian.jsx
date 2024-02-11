import Navbar from "../../Navbar.jsx";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import gaya from "../gaya.css";

import { ClockIcon,BackwardIcon,FolderArrowDownIcon} from '@heroicons/react/24/solid'

import gagalSuara from './audio/gagal_suara5.mp3';   // Adjust the import path as necessary
import terlambatSuara from './audio/gagal_suara9.mp3';   // Adjust the import path as necessary
import suksesSuara from './audio/sukses_notif3.mp3';
import tidakDitemukanSuara from './audio/gagal_suara6.mp3';

import baseURL from "../../../config.js";
import {toast, ToastContainer} from "react-toastify";   // Adjust the import path as necessary
// import gagalSuara from './gagal_suara7.mp3';   // Adjust the import path as necessary

export const ScannerMasukUjian = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [prevSearchId, setPrevSearchId] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('gray');
    const [kurangList, setKurangList] = useState([]);
    const [foundedMurid, setfoundedMurid] = useState({});
    const searchBarRef = useRef(null);
    const gagalAudioRef = useRef(null);
    const suksesAudioRef = useRef(null);
    const terlambatAudioRef = useRef(null);
    const tidakDitemukanAudioRef = useRef(null);
    const gagalAudioTimeoutRef = useRef(null);
    const terlambatAudioTimeoutRef = useRef(null);

    const [modalBatasWaktu,setModalBatasWaktu] = useState(false)
    const [modalConfirmExit, setModalConfirmExit] = useState(false);
    const [isUjianDitutup, setIsUjianDiTutup] = useState(false);

    const [newDeadlineTime, setNewDeadlineTime] = useState("21:15");
    const [batasWaktuTutup, setbatasWaktuTutup] = useState("21:45");
    const [foundMuridList, setFoundMuridList] = useState([]);
    const [buttonPressedTime, setButtonPressedTime] = useState('');

    const wakeLockRef = useRef(null);

    const  navigate= useNavigate()
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseURL}/nilai/taftisan/all`);
            localStorage.setItem('dataTaftisan', JSON.stringify(response.data));
            searchBarRef.current.focus();

            toast.success('Data berhasil diambil dari server', {autoClose: 3000});

        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
        const now = new Date();
        // Format the date and time for UTC+7 timezone in Indonesian format
        const dateFormatter = new Intl.DateTimeFormat('id-ID', {
            timeZone: 'Etc/GMT-7',
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            hourCycle: 'h23'
        });


        const formattedDate = dateFormatter.format(now);

        // console.log(`Waktu dan Tanggal Saat Ini (UTC+7): ${formattedDate}`);
        setButtonPressedTime(`Terakhir Ambil data dari Server: ${formattedDate}`);
    };
    const transitionBackgroundColor = (finalColor) => {
        // Set to a neutral color first
        setBackgroundColor('gray');

        // Wait for a short duration before setting the final color
        setTimeout(() => {
            setBackgroundColor(finalColor);
        }, 100); // Adjust the duration (in milliseconds) as needed
    };

    const stopAndResetAudio = (audioRef, timeoutRef) => {
        if (audioRef && audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (timeoutRef && timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const stopSemuaAudio = () => {

            gagalAudioRef.current.pause();
            gagalAudioRef.current.currentTime = 0;


            terlambatAudioRef.current.pause();
            terlambatAudioRef.current.currentTime = 0;

    };



    const playGagalAudio = () => {
        stopSemuaAudio();
        gagalAudioRef.current.play();
        // gagalAudioTimeoutRef.current = setTimeout(() => {
        //     gagalAudioRef.current.pause();
        //     gagalAudioRef.current.currentTime = 0;
        // }, 10000); // Play for 10 seconds
    };

    const playTerlambatAudio = () => {
        stopSemuaAudio();
        terlambatAudioRef.current.play();
        // terlambatAudioTimeoutRef.current = setTimeout(() => {
        //     terlambatAudioRef.current.pause();
        //     terlambatAudioRef.current.currentTime = 0;
        // }, 10000); // Play for 10 seconds
    };





    const handleSearch = () => {

       try {


        const storedData = JSON.parse(localStorage.getItem('dataTaftisan'));
        const foundMurid = storedData.find(murid => murid.id_murid === searchId);
        const currentTime = new Date().toLocaleTimeString('it-IT', { hour12: false });
        const lateStatus = currentTime > newDeadlineTime;
        // console.log(foundMurid)
        if (foundMurid) {
            stopSemuaAudio()

            if (!foundMurid.sudah_lengkap) {
                transitionBackgroundColor('bg-red-500');
                // setBackgroundColor('bg-red-500');
                playGagalAudio();
                setKurangList(foundMurid.yang_kurang.map(item => item.nama_mapel));
            } else {
                transitionBackgroundColor(lateStatus ? 'bg-yellow-500' : 'bg-green-300');
                // setBackgroundColor(lateStatus ? 'bg-yellow-500' : 'bg-green-300');

                if (lateStatus) {

                    if (currentTime>batasWaktuTutup){
                        setIsUjianDiTutup(true)
                        tidakDitemukanAudioRef.current.play();
                        playTerlambatAudio()


                    }else {
                        playTerlambatAudio()
                    }
                } else {
                    suksesAudioRef.current.play();
                }
            }

            setPrevSearchId(searchId);
            setfoundedMurid(foundMurid);


            setFoundMuridList(prevList => [
                ...prevList,
                {
                    id_murid: foundMurid.id_murid,
                    nama_murid: foundMurid.nama_murid,
                    nama_kelas: foundMurid.nama_kelas,
                    waktu_masuk: currentTime,
                    keterangan: !foundMurid.sudah_lengkap ? 'DITOLAK' : (lateStatus ? 'TERLAMBAT' : 'TEPAT WAKTU')
                }
            ]);



        } else {
            stopSemuaAudio()
            toast.error('Murid tidak ditemukan, pastikan id murid valid', {autoClose: 6000})
            tidakDitemukanAudioRef.current.play();
        }
        setSearchId('');
        searchBarRef.current.focus();

} catch (error) {
           toast.error("Apakah Anda sudah mengambil data dari server?", {autoClose: 3000});
       }
    };

    const downloadCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "id_murid,nama_murid,nama_kelas,waktu_masuk,keterangan\n"; // CSV Header

        // Create a map to track the latest entry for each murid
        const latestMuridMap = new Map();

        // Iterate through foundMuridList in reverse to keep the latest entry for each murid
        foundMuridList.slice().reverse().forEach(murid => {
            if (!latestMuridMap.has(murid.id_murid)) {
                latestMuridMap.set(murid.id_murid, murid);
            }
        });

        // Generate CSV rows from the latest entries
        latestMuridMap.forEach(murid => {
            let row = `${murid.id_murid},${murid.nama_murid},${murid.nama_kelas},${murid.waktu_masuk},${murid.keterangan}`;
            csvContent += row + "\n";
        });

        //date ddmmmyyyy for download file name
        const date = new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}).split(' ').join('');


        // Trigger CSV download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${date}_daftar_murid.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setFoundMuridList([])
    };





    useEffect(() => {
        const audio = new Audio(gagalSuara);
        audio.preload = 'auto'; // This will preload the audio
        gagalAudioRef.current = audio;

        const audio_suk = new Audio(suksesSuara);
        audio_suk.preload = 'auto'; // This will preload the audio
        suksesAudioRef.current = audio_suk;

        const audio_ter = new Audio(terlambatSuara);
        audio_ter.preload = 'auto'; // This will preload the audio
        terlambatAudioRef.current = audio_ter;


         const audio_nf = new Audio(tidakDitemukanSuara);
        audio_nf.preload = 'auto'; // This will preload the audio
        tidakDitemukanAudioRef.current = audio_nf;


        setFoundMuridList([])







        const terlambat = (localStorage.getItem('waktuTerlambat'));
        if (terlambat) {
        setNewDeadlineTime(terlambat);}
        // console.log(terlambat)
        //// INI MENYEBABKAN TIDAK BISA HOT RELOAD / SEMACAM CONSOLE LOG TIDAK BISA
        const handleBeforeUnload = (event) => {
            const message = 'Are you sure you want to leave? Your data will be lost.';
            event.returnValue = message; // Standard for most browsers
            return message; // For some older browsers
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Cleanup the event listener when the component is unmounted
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

        // jaga agar tetap HIDUP LAYARNYA !!!1
        // if ('wakeLock' in navigator) {
        //     // Request a screen wake lock
        //     navigator.wakeLock.request('screen').then((lock) => {
        //         wakeLockRef.current = lock;
        //
        //         // Handle lock release when the component unmounts
        //         return () => {
        //             if (wakeLockRef.current) {
        //                 wakeLockRef.current.release();
        //                 wakeLockRef.current = null;
        //             }
        //         };
        //     });
        // }


    }, []);





    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                // Check if the clicked element is not the search bar or excluded elements
                if (!event.target.matches('.exclude-focus')) {
                    searchBarRef.current.focus();
                }
            }
        };

        // Add event listener
        document.addEventListener("click", handleClickOutside);

        return () => {
            // Clean up the event listener
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);



    const handlePrevSearch = () => {
        setSearchId(prevSearchId);  // Set search box to the previous searchId
        searchBarRef.current.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handledeadlineTime = (e) => {
        // console.log(e.target.value)
        setNewDeadlineTime(e.target.value)

    }





    return (


        <div className="bg-[#f4f4f4] min-h-screen">
            <div className="container mx-auto p-4">
                {/*<Prompt when={true} message="are you sure you want to leave this page?" />*/}

                <div className="flex items-center mb-2">
                    <input
                        ref={searchBarRef}
                        type="number"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className=" border border-gray-400 rounded py-3 px-5 text-lg focus:border-teal-600 focus:ring-teal-600"
                        placeholder="Cari Id_murid"
                    />
                    <button onClick={() => setSearchId('')} className="ml-2 bg-red-500 hover:bg-red-600 text-white text-lg font-bold py-3 px-3 rounded focus:outline-none">
                        Hapus
                    </button>


                </div>

                <div className="flex gap-2 items-center">

                    <button  onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg font-bold py-3 px-3 rounded focus:outline-none">
                        Cari
                    </button>

                    <button onClick={handlePrevSearch} className=" bg-gray-400 hover:bg-gray-700 text-white text-lg font-bold py-3 px-3 rounded focus:outline-none">
                        <BackwardIcon className="w-5 h-7" aria-hidden="true" />
                    </button>


                    <button onClick={()=> {
                        searchBarRef.current.focus()
                        stopSemuaAudio()
                    }}


                            className="bg-blue-400 hover:bg-gray-700 text-white text-lg font-bold py-3 px-4 rounded focus:outline-none"


                    >
                        Fokus
                    </button>

                    <button onClick={() =>{
                        setModalBatasWaktu(true)
                    }} className="bg-gray-400 hover:bg-gray-700 text-white text-lg font-bold py-3 px-3 rounded focus:outline-none">
                        <ClockIcon className="w-7 h-7" aria-hidden="true" />
                    </button>

                    <button onClick={fetchData} className=" bg-teal-500 hover:bg-teal-700 text-white text-md  py-3.5 px-4 rounded focus:outline-none focus:shadow-outline">
                        Ambil Data
                    </button>




                </div>
                <ToastContainer/>


                {!isLoading && (
                    <div   className={`mt-2 p-6  min-h-screen rounded shadow-xl ${backgroundColor}`}  style={{maxHeight: '90vh'}}>
                        <div className="flex flex-col md:flex-row md:items-start gap-8">
                            <div>
                                <h1 className={`text-2xl font-bold mb-2 ${backgroundColor === 'bg-green-300' || backgroundColor === 'bg-yellow-500' ? 'text-black' : 'text-white'}`}>{foundedMurid.nama_murid}</h1>
                                <h2 className="text-xl mb-4">{foundedMurid.nama_kelas}</h2>
                                <h3 className={`text-6xl font-extrabold mb-4 ${backgroundColor === 'bg-green-300' || backgroundColor === 'bg-yellow-500' ? 'text-black' : 'text-white'}`}>

                                    {backgroundColor === 'bg-green-300' ? 'DITERIMA!' : (backgroundColor === 'bg-yellow-500' ? 'ANDA TERLAMBAT' : 'DITOLAK!')}
                                    <br/>
                                    <br/>

                                    {isUjianDitutup && 'UJIAN DITUTUP!'}
                                </h3>
                            </div>
                            {backgroundColor === 'bg-red-500' && (
                                <div className="flex-1">
                                    <h4 className="text-xl text-white mb-1">id: {foundedMurid.id_murid}</h4>
                                    <h4 className="text-xl text-white mb-2">Kitab Yang Belum:</h4>
                                    <ul className="list-disc list-inside text-lg text-white">
                                        {kurangList.map((mapel, index) => (
                                            <li key={index} className="font-semibold">{mapel}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>




            <div className="container mx-auto p-4">
                <div className=" text-center">


                    <h1 className="ml-4 py-1.5 font-bold">Batas Waktu Terlambat: {newDeadlineTime}</h1>


                </div>

                {isLoading && <div className="text-teal-700 text-lg">Sedang mengambil data...</div>}

                {buttonPressedTime && !isLoading && (
                    <div className="text-center  text-gray-800 text-xs italic">
                        {buttonPressedTime}
                    </div>
                )}
            </div>


            <div className="flex space-x-20 justify-center pb-4">
                <button onClick={()=>setModalConfirmExit(true)} className=" bg-red-500 hover:bg-gray-900 text-white text-lg font-bold py-2 px-5 rounded focus:outline-none">
                    X
                </button>


                <button onClick={downloadCSV} className="bg-green-800 hover:bg-gray-700 text-white text-lg font-bold py-3 px-3 rounded focus:outline-none">
                    <FolderArrowDownIcon className="w-7 h-7" aria-hidden="true" />
                </button>

            </div>




            {modalBatasWaktu && (
                <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                    <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-95">
                        <button onClick={() => {setModalBatasWaktu(false)}}
                                className="m-4 modal-close text-white bg-red-600 text-l font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-900 hover:text-white">
                            X
                        </button>
                    </div>
                    <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-2" style={{maxHeight: '90vh'}}>
                        <div className="modal-content text-left ">
                            <div className="modal-content py-1 text-left px-1 pb-6">
                                <div className="flex justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">Tentukan Batas <br/> Waktu terlambat</p>
                                </div>
                                <input
                                    type="time"
                                    value={newDeadlineTime}
                                    onChange={(e) => handledeadlineTime(e)}
                                    className="text-xl font-bold bg-yellow-300 rounded py-4 px-4 mb-1 mt-1 custom-time-input"
                                />

                            </div>

                            <button
                                onClick={() => {setModalBatasWaktu(false)}}
                                className="mt-1  bg-red-600 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                            >
                                Batal
                            </button>

                            <button
                                onClick={() => {
                                    setNewDeadlineTime(newDeadlineTime);
                                    setModalBatasWaktu(false);
                                    localStorage.setItem('waktuTerlambat',newDeadlineTime);

                                }}
                                className="ml-6 bg-teal-700 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                            >
                                Simpan
                            </button>

                        </div>

                    </div>


                </div>
            )}



            {modalConfirmExit && (
                <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">

                    <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-4" style={{maxHeight: '90vh'}}>
                        <div className="modal-content text-left ">
                            <div className="modal-content py-1 text-left px-1 pb-6">
                                <div className="flex justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">Konfirmasi Keluar, apakah anda yakin?</p>
                                </div>

                            </div>

                            <button
                                onClick={() => {navigate('/taftisan'); setModalConfirmExit(false)}}
                                className="mt-1  bg-red-600 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                            >
                                Yakin
                            </button>

                            <button
                                onClick={() => {
                                    setModalConfirmExit(false);

                                }}
                                className="ml-6 bg-teal-700 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                            >
                                Batal
                            </button>

                        </div>

                    </div>


                </div>
            )}




        </div>





    )
}
