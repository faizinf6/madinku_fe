import Navbar from "../../Navbar.jsx";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import gagalSuara from './gagal_suara5.mp3';   // Adjust the import path as necessary
import suksesSuara from './sukses_notif3.mp3';   // Adjust the import path as necessary
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
    const gagalAudioTimeoutRef = useRef(null);


    const [buttonPressedTime, setButtonPressedTime] = useState('');

    const  navigate= useNavigate()
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://192.168.0.3:5000/nilai/taftisan/all');
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

        if (foundMurid) {
            stopAndResetAudio(gagalAudioRef, gagalAudioTimeoutRef);


            const finalColor = foundMurid.sudah_lengkap ? 'green' : 'red';
            transitionBackgroundColor(finalColor);

            if (!foundMurid.sudah_lengkap) {
                playGagalAudio();
                setKurangList(foundMurid.yang_kurang.map(item => item.nama_mapel));
            } else {
                stopAndResetAudio(gagalAudioRef, gagalAudioTimeoutRef); // Stop gagal audio if playing
                suksesAudioRef.current.play();
            }

            setPrevSearchId(searchId);  // Save the current searchId before clearing it
            setfoundedMurid(foundMurid);
            console.log(foundMurid)
        } else {
            alert('Murid tidak ditemukan');
        }
        setSearchId('');  // Clear the search box after each search
        searchBarRef.current.focus();
    };




    useEffect(() => {
        const audio = new Audio(gagalSuara);
        audio.preload = 'auto'; // This will preload the audio
        gagalAudioRef.current = audio;

        const audio_suk = new Audio(suksesSuara);
        audio_suk.preload = 'auto'; // This will preload the audio
        suksesAudioRef.current = audio_suk;
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


        <div>
            <div className="container mx-auto  p-4"  style={{ backgroundColor: backgroundColor, minHeight: '100vh' }}>

                <div className="flex ">

                    <button onClick={fetchData} className="bg-teal-500 text-white p-2 rounded exclude-focus text-xs">
                        Ambil Data
                    </button>

                    {isLoading && <div className="text-center p-4">Sedang mengambil data...</div>}

                    {buttonPressedTime && !isLoading&& (
                        <div className="pl-4 mt-2 text-white italic text-xs">
                            {buttonPressedTime}
                        </div>
                    )}
                </div>


                <div className="mt-4 ">
                    <div className="text-left">
                        <input
                            ref={searchBarRef}
                            type="number"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="border p-2 rounded"
                            placeholder="Cari Id_murid"
                        />
                        <button onClick={handleSearch} className="bg-yellow-400 text-black p-2 ml-2 rounded exclude-focus">
                            Cari
                        </button>
                        <button onClick={handlePrevSearch} className="bg-gray-500 text-white p-2 ml-2 rounded exclude-focus">
                            ^
                        </button>

                        {!isLoading && backgroundColor === 'green' && (
                            <div className="mb-4 font-extrabold text-white text-6xl">
                                <h1>{foundedMurid.nama_murid}</h1>
                                <h1>{foundedMurid.nama_kelas}</h1>
                                <h1>DITERIMA!</h1>
                            </div>
                        )}

                        {!isLoading && backgroundColor === 'red' && (
                            <div className="mt-4">
                                <div className="mb-4">
                                    <h1 className="font-extrabold text-white text-2xl whitespace-nowrap">
                                        {foundedMurid.nama_murid}
                                    </h1>
                                    <h1>{foundedMurid.nama_kelas}</h1>
                                    <h1 className="mt-2 py-1.5  font-extrabold text-white text-6xl whitespace-nowrap ">DITOLAK!</h1>
                                </div>
                                <h2 className="text-white">Kitab Yang Belum:</h2>
                                <ul>
                                    {kurangList.map((mapel, index) => (
                                        <li key={index} className="text-white list-disc list-inside font-extrabold">{mapel}</li>
                                    ))}
                                </ul>
                            </div>
                        )}


                    </div>
                </div>
            </div>

            <button onClick={()=>navigate("/taftisan")} className="px-4 bg-black text-white p-2 rounded exclude-focus">
               X
            </button>

        </div>

    )
}
