import Navbar from "../../Navbar.jsx";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import { ClockIcon} from '@heroicons/react/24/solid'

import gagalSuara from './audio/gagal_suara9.mp3';   // Adjust the import path as necessary
import terlambatSuara from './audio/gagal_suara5.mp3';   // Adjust the import path as necessary
import suksesSuara from './audio/sukses_notif3.mp3';
import TabelRapot from "../rekap_nilai/TabelRapot.jsx";
import baseURL from "../../../config.js";   // Adjust the import path as necessary
// import gagalSuara from './gagal_suara7.mp3';   // Adjust the import path as necessary

export const ScannerMasukUjian = () => {
    const [dataTaftisan, setDataTaftisan] = useState([]);
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
    const gagalAudioTimeoutRef = useRef(null);

    const [modalBatasWaktu,setModalBatasWaktu] = useState(false)
    const [isLate, setIsLate] = useState(false);

    const [newDeadlineTime, setNewDeadlineTime] = useState("20:45");
    const [foundMuridList, setFoundMuridList] = useState([]);
    const [buttonPressedTime, setButtonPressedTime] = useState('');

    const  navigate= useNavigate()
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseURL}/nilai/taftisan/all`);
            localStorage.setItem('dataTaftisan', JSON.stringify(response.data));
            setDataTaftisan(response.data);
            searchBarRef.current.focus();

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

    const playGagalAudio = () => {
        stopAndResetAudio(suksesAudioRef, null); // Stop sukses audio if playing
        gagalAudioRef.current.play();
        gagalAudioTimeoutRef.current = setTimeout(() => {
            gagalAudioRef.current.pause();
            gagalAudioRef.current.currentTime = 0;
        }, 10000); // Play for 10 seconds
    };



    const handleSearch = () => {
        const storedData = JSON.parse(localStorage.getItem('dataTaftisan'));
        const foundMurid = storedData.find(murid => murid.id_murid === searchId);
        const currentTime = new Date().toLocaleTimeString('it-IT', { hour12: false });
        const lateStatus = currentTime > newDeadlineTime;
        console.log(foundMurid)
        if (foundMurid) {
            stopAndResetAudio(gagalAudioRef, gagalAudioTimeoutRef);



            if (!foundMurid.sudah_lengkap) {
                setBackgroundColor('bg-red-500');
                playGagalAudio();
                setKurangList(foundMurid.yang_kurang.map(item => item.nama_mapel));
            } else {
                setBackgroundColor(lateStatus ? 'bg-yellow-500' : 'bg-green-300');

                if (lateStatus) {
                    terlambatAudioRef.current.play();
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
            alert('Murid tidak ditemukan');
        }
        setSearchId('');
        searchBarRef.current.focus();
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

        // Trigger CSV download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "murid_list.csv");
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

        setFoundMuridList([])

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





    return (


        <div className="bg-[#f4f4f4] min-h-screen">
            <div className="container mx-auto p-4">



                <div className="flex gap-4 items-center">
                    <input
                        ref={searchBarRef}
                        type="number"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="border border-gray-400 rounded py-3 px-5 w-full text-lg focus:border-teal-600 focus:ring-teal-600"
                        placeholder="Cari Id_murid"
                    />
                    <button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg font-bold py-3 px-6 rounded focus:outline-none">
                        Cari
                    </button>
                    <button onClick={handlePrevSearch} className="bg-gray-600 hover:bg-gray-700 text-white text-lg font-bold py-3 px-6 rounded focus:outline-none">
                        ^
                    </button>
                </div>


                {!isLoading && (
                    <div   className={`mt-2 p-6  min-h-screen rounded shadow-xl ${backgroundColor}`}  style={{maxHeight: '90vh'}}>
                        <div className="flex flex-col md:flex-row md:items-start gap-8">
                            <div>
                                <h1 className={`text-2xl font-bold mb-2 ${backgroundColor === 'bg-green-300' || backgroundColor === 'bg-yellow-500' ? 'text-black' : 'text-white'}`}>{foundedMurid.nama_murid}</h1>
                                <h2 className="text-xl mb-4">{foundedMurid.nama_kelas}</h2>
                                <h3 className={`text-6xl font-extrabold mb-4 ${backgroundColor === 'bg-green-300' || backgroundColor === 'bg-yellow-500' ? 'text-black' : 'text-white'}`}>
                                    {backgroundColor === 'bg-green-300' ? 'DITERIMA!' : (backgroundColor === 'bg-yellow-500' ? 'ANDA TERLAMBAT' : 'DITOLAK!')}
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

                    <button onClick={fetchData} className="bg-teal-500 hover:bg-teal-700 text-white text-md font-bold py-1.5 px-3 rounded focus:outline-none focus:shadow-outline">
                        Ambil Data
                    </button>
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
                <button onClick={() => navigate("/taftisan")} className=" bg-red-500 hover:bg-gray-900 text-white text-lg font-bold py-2 px-5 rounded focus:outline-none">
                    X
                </button>

                <button onClick={downloadCSV} className=" bg-black hover:bg-gray-900 text-white text-lg font-bold py-2 px-5 rounded focus:outline-none">
                    Simpan
                </button>

                <ClockIcon onClick={() =>setModalBatasWaktu(true)} className=" h-11 w-11  py-1 px-1 bg-yellow-500 hover:bg-gray-900 text-white text-lg  rounded focus:outline-none">
                </ClockIcon>


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
                                    onChange={(e) => setNewDeadlineTime(e.target.value)}
                                    className="text-xl font-bold bg-yellow-300 rounded py-4 px-4 mb-1 mt-1"
                                />

                            </div>

                            <button
                                onClick={() => {setModalBatasWaktu(false)}}
                                className="mt-1  bg-red-600 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                            >
                                Tutup
                            </button>

                            <button
                                onClick={() => {
                                    setNewDeadlineTime(newDeadlineTime);
                                    setModalBatasWaktu(false);
                                }}
                                className="ml-6 bg-teal-700 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                            >
                                Simpan
                            </button>

                        </div>

                    </div>


                </div>
            )}




        </div>





    )
}
