// QRGenerator.jsx
import React, {useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Navbar from "../../Navbar.jsx";
import QRCard from './QRCard';
import axios from "axios";
import baseURL from "../../../config.js";
import {toast, ToastContainer} from "react-toastify";
import QRCode from "qrcode.react";
import logo from "../../../logo_ppds.png";

export const QRGenerator = () => {
    const [idMuridInput, setIdMuridInput] = useState(''); // For storing the input

    const [isLoadingQr, setIsLoadingQr] = useState(false);

    const handleGenerateSingleQr = async () => {
        setIsLoadingQr(true);
        const dataMurid = JSON.parse(localStorage.getItem('dataTaftisan') || '[]');
        const murid = dataMurid.find(m => m.id_murid === idMuridInput);

        if (murid) {
            const qrCardElement = document.createElement('div');

            qrCardElement.style.width = `${50 * 3.7795275591}px`;
            qrCardElement.style.height = `${80 * 3.7795275591}px`;



            document.body.appendChild(qrCardElement);

            // qrCardElement.style.width = `${50 * 3.7795275591}px`;
            // qrCardElement.style.height = `${80 * 3.7795275591}px`;



            ReactDOM.render(<QRCard idMurid={murid.id_murid} namaMurid={murid.nama_murid} kelas_murid={murid.nama_kelas} marginLeft={0}  />, qrCardElement);

            // Wait for the component to finish rendering
            await new Promise((resolve) => setTimeout(resolve, 500));

            const canvas = await html2canvas(qrCardElement, {
                scale: 1,
                logging: true,
                useCORS: true
            });

            // Trigger download
            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const link = document.createElement('a');
            link.download = `qr_code_${murid.id_murid}.png`;
            link.href = image;
            link.click();

            ReactDOM.unmountComponentAtNode(qrCardElement);
            qrCardElement.parentNode.removeChild(qrCardElement);
            setIsLoadingQr(false);
        } else {
            toast.error('Murid Tidak Ditemukan, Pastikan id_murid Valid');
            toast.warning("Apakah anda sudah mengambil data dari server?");
            setIsLoadingQr(false);
        }
    };

    const handleGeneratePdf = async () => {
        setIsLoadingQr(true)
        const dataMurid = JSON.parse(localStorage.getItem('dataTaftisan') || '[]');
        if (dataMurid) {
        const cardsPerRow = 2;
        const rowsPerPage = 5; // 16 cards per F4 page
        const cardsPerPage = cardsPerRow * rowsPerPage;
        const mmToPx = 3.7795275591; // Conversion factor from mm to pixels
        const segmentSize = 100; // Jumlah data per segmen

        for (let segment = 0; segment < Math.ceil(dataMurid.length / segmentSize); segment++) {
            let canvases = [];
            for (let page = segment * segmentSize; page < Math.min((segment + 1) * segmentSize, dataMurid.length); page += cardsPerPage) {
                const pageContainer = document.createElement('div');
                pageContainer.className = 'flex flex-wrap';
                pageContainer.style.width = `${210 * mmToPx}px`;
                pageContainer.style.height = `${330 * mmToPx}px`;
                document.body.appendChild(pageContainer);

                for (let i = 0; i < cardsPerPage; i++) {
                    const muridIndex = page + i;
                    if (muridIndex < dataMurid.length) {
                        const murid = dataMurid[muridIndex];
                        const qrCardElement = document.createElement('div');
                        qrCardElement.className = 'flex';
                        qrCardElement.style.width = `${100 * mmToPx}px`;
                        qrCardElement.style.height = `${60 * mmToPx}px`;
                        ReactDOM.render(<QRCard idMurid={murid.id_murid} namaMurid={murid.nama_murid} kelas_murid={murid.nama_kelas} marginLeft={1} />, qrCardElement);
                        pageContainer.appendChild(qrCardElement);
                    }
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));

                const canvas = await html2canvas(pageContainer, {
                    scale: 2,
                    logging: true,
                    useCORS: true,
                    width: pageContainer.offsetWidth,
                    height: pageContainer.offsetHeight
                });

                canvases.push(canvas);

                ReactDOM.unmountComponentAtNode(pageContainer);
                pageContainer.parentNode.removeChild(pageContainer);
            }

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: [210, 330]
            });

            canvases.forEach((canvas, index) => {
                if (index > 0) {
                    pdf.addPage([210, 330]);
                }
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 330);
            });

            pdf.save(`qr-cards-part${segment + 1}.pdf`);
        }


        } else {
            toast.error('Murid Tidak Ditemukan, Pastikan id_murid Valid');
            toast.warning("Apakah anda sudah mengambil data dari server?");
        }
        setIsLoadingQr(false)


    };




    const [isLoading, setIsLoading] = useState(false);
    const searchBarRef = useRef(null);
    const [buttonPressedTime, setButtonPressedTime] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${baseURL}/nilai/taftisan/all`);
            localStorage.setItem('dataTaftisan', JSON.stringify(response.data));



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

    return (
        <div>
            <Navbar/>
            <ToastContainer/>
            <div className=" container mx-auto  p-4">

                <div className="flex">

                    <button onClick={fetchData} className="bg-teal-500 text-white py-2 px-4 rounded exclude-focus text-xs">
                        Ambil Data
                    </button>

                    {isLoading && <div className="text-center p-4">Sedang mengambil data...</div>}

                    {buttonPressedTime && !isLoading&& (
                        <div className="pl-4 mt-2 text-black italic text-xs">
                            {buttonPressedTime}
                        </div>
                    )}
                </div>

                <div className="flex">

                    <input
                        type="number"
                        className="border rounded  py-2 px-4 mt-4"
                        placeholder="Masukan Id_murid"
                        value={idMuridInput}
                        onChange={(e) => setIdMuridInput(e.target.value)}
                    />

                    <button
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={handleGenerateSingleQr}
                    >
                        Buat Satu Qr
                    </button>

                    <button
                        className="ml-2 bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={handleGeneratePdf}
                    >
                        Buat Banyak Qr
                    </button>

                </div>


            </div>

            <div className="flex flex-col w-[100mm] h-[60mm] bg-white border border-black ml-0">
                <div className="flex items-center">
                    <div className="ml-2 mt-1 flex items-center">
                        <img src={logo} alt="Logo PPDS" className="w-10 h-18 mr-4" />
                        <div>
                            <p className="text-lg font-bold ">Madrasah Diniyah</p>
                            <p className="text-xs font-semibold">Pondok Pesantren Darussaadah</p>
                        </div>
                    </div>
                    <div className="text-center ml-4 mr-3 border border-gray-700 rounded">
                        <p className="px-1.5 text-xs">No Ujian</p>
                        <p className="text-l font-bold">003</p>
                    </div>
                </div>
                {/*<hr className="w-auto border-t border-black" /> /!* Horizontal line *!/*/}

                <div className="flex items-center justify-center">
                    <div className="ml-4 text-left mr-5">
                        <p className=" text-xs italic">Kartu Ujian Semester Akhir</p>
                        <p className="text-sm">ID Murid: {"idMurid"}</p>
                        <p className="text-sm">Nama Murid: {"nama46544654645Murid"}</p>
                        <p className="text-sm">Kelas Murid: {"kelas_murid"}</p>
                        <p className="text-sm">Tahun Ajaran {"kelas_murid"}</p>
                    </div>
                    <QRCode value={"idMurid"} size={parseInt(40 / 0.264583)} level="H" />
                </div>
            </div>








            {isLoadingQr &&
                <div className="flex justify-center">
                    <h1 className="m-4">Sabaaar...</h1>

                <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)] text-black ">Sabarrr...</span>
            </div>
                </div>


            }
        </div>
    );
};

export default QRGenerator;
