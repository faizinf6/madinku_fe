// QRGenerator.jsx
import React, {useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import { jsPDF } from 'jspdf';
import Navbar from "../../Navbar.jsx";
import QRCard from './QRCard';
import axios from "axios";
import baseURL from "../../../config.js";
import {toast, ToastContainer} from "react-toastify";
import QRCode from "qrcode.react";
import logo from "../../../logo_ppds.png";
import toPng from 'html-to-image';
import * as htmlToImage from 'html-to-image';
import {TempelanNomer} from "./TempelanNomer.jsx";
export const QRGenerator = () => {
    const [idMuridInput, setIdMuridInput] = useState(''); // For storing the input

    const [isLoadingQr, setIsLoadingQr] = useState(false);
    const [modalConfirmGenerete, setModalConfirmGenerete] = useState(false);

    const handleGenerateSingleQr = async () => {
        setIsLoadingQr(true);
        const dataMurid = JSON.parse(localStorage.getItem('dataTaftisan') || '[]');
        const murid = dataMurid.find(m => m.id_murid === idMuridInput);

        if (murid) {
            const qrCardElement = document.createElement('div');
            qrCardElement.style.width = `${100 * 3.7795275591}px`;
            qrCardElement.style.height = `${60 * 3.7795275591}px`;
            document.body.appendChild(qrCardElement);
            ReactDOM.render(<QRCard idMurid={murid.id_murid} namaMurid={murid.nama_murid} kelas_murid={murid.nama_kelas} marginLeft={0}  />, qrCardElement);

            // Wait for the component to finish rendering
            await new Promise((resolve) => setTimeout(resolve, 500));




            // Trigger download
            // const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            const pixelRatio = 4;
            const image = await htmlToImage.toPng(qrCardElement, { pixelRatio });
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
                        ReactDOM.render(<QRCard idMurid={murid.id_murid} namaMurid={murid.nama_murid} kelas_murid={murid.nama_kelas} marginLeft={2} />, qrCardElement);
                        pageContainer.appendChild(qrCardElement);
                    }
                }

                await new Promise((resolve) => setTimeout(resolve, 1000));

                const pixelRatio = 2;
                // const image = await htmlToImage.toPng(qrCardElement, { pixelRatio });
                const image = await htmlToImage.toPng(pageContainer, {
                    width: pageContainer.offsetWidth,
                    height: pageContainer.offsetHeight,pixelRatio
                });

                canvases.push(image);

                ReactDOM.unmountComponentAtNode(pageContainer);
                pageContainer.parentNode.removeChild(pageContainer);
            }

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: [210, 330]
            });

            canvases.forEach((image, index) => {
                if (index > 0) {
                    pdf.addPage([210, 330]);
                }

                // Create an image element
                const img = new Image();
                img.src = image;

                // Add the image to the PDF
                pdf.addImage(img, 'PNG', 0, 0, 210, 330);
            });

            pdf.save(`qr-cards-part${segment + 1}.pdf`);
        }


        } else {
            toast.error('Murid Tidak Ditemukan, Pastikan id_murid Valid');
            toast.warning("Apakah anda sudah mengambil data dari server?");
        }
        setIsLoadingQr(false)


    };

    const handleGenerateTempelanNomerPdf = async () => {
        setIsLoadingQr(true)
        const dataMurid = JSON.parse(localStorage.getItem('dataTaftisan') || '[]');
        if (dataMurid) {
            const cardsPerRow = 5;
            const rowsPerPage = 8; // 40 cards per F4 page
            const cardsPerPage = cardsPerRow * rowsPerPage;
            const mmToPx = 3.7795275591; // Conversion factor from mm to pixels
            const segmentSize = 200; // Jumlah data per segmen

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
                            qrCardElement.style.width = `${41.2 * mmToPx}px`;
                            qrCardElement.style.height = `${40.5 * mmToPx}px`;
                            ReactDOM.render(<TempelanNomer nama_murid={murid.nama_murid} idMurid={murid.id_murid}  kelas_murid={murid.nama_kelas} marginLeft={0} />, qrCardElement);
                            pageContainer.appendChild(qrCardElement);
                        }
                    }

                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    const pixelRatio = 3;
                    // const image = await htmlToImage.toPng(qrCardElement, { pixelRatio });
                    const image = await htmlToImage.toPng(pageContainer, {
                        width: pageContainer.offsetWidth,
                        height: pageContainer.offsetHeight,pixelRatio
                    });

                    canvases.push(image);

                    ReactDOM.unmountComponentAtNode(pageContainer);
                    pageContainer.parentNode.removeChild(pageContainer);
                }

                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'mm',
                    format: [210, 330]
                });

                canvases.forEach((image, index) => {
                    if (index > 0) {
                        pdf.addPage([210, 330]);
                    }

                    // Create an image element
                    const img = new Image();
                    img.src = image;

                    // Add the image to the PDF
                    pdf.addImage(img, 'PNG', 0, 0, 210, 330);
                });

                pdf.save(`tempelan-part${segment + 1}.pdf`);
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
            <div className=" container mt-4">

                <div className="flex justify-center">

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

                <div className="flex justify-center">

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

                </div>

                {/*button container div*/}
                <div className="flex mt-2 justify-center">


                    <button
                        className=" bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 w-96 rounded mt-4"
                        onClick={()=>setModalConfirmGenerete(true)}
                    >
                        Buat Banyak Qr Sekaligus (pdf)
                    </button>


                    </div>

                <div className="flex mt-2 justify-center">


                    <button
                        className=" bg-violet-700 hover:bg-blue-700 text-white font-bold py-2 w-96 rounded mt-4"
                        onClick={()=>handleGenerateTempelanNomerPdf()}
                    >
                        Buat Tempelan Nomer Ujian
                    </button>


                    </div>



                <p className="text-xs py-2 ml-2">Kartu Ujian akan tampil seperti contoh ini:</p>


                <div className="flex flex-col w-[100mm] h-[60mm] bg-white border border-black ml-2">
                    <div className="flex items-center">
                        <div className="ml-2 mt-1 flex items-center">
                            <img src={logo} alt="Logo PPDS" className="w-10 h-18 mr-4" />
                            <div>
                                <p className="text-lg font-bold">Madrasah Diniyah</p>
                                <p className="text-xs font-semibold">Pondok Pesantren Darussaadah</p>
                            </div>
                        </div>
                        <div className="text-center ml-16  border border-gray-700 rounded">
                            <p className="px-1.5 text-xs">No Ujian</p>
                            <p className="text-l font-bold">000</p>
                        </div>
                    </div>

                    <div className=" mt-2 flex ml-2">
                        <QRCode value={"idMurid"} size={parseInt(40 / 0.264583)} level="H" />

                        <div className="text-center ml-2 w-[70mm]">

                            <div className=" px-1.5  text-center  mr-3 border border-gray-700 rounded">
                                <p className="text-l font-bold">{"Kelas 9 Aly Malam"}</p>
                            </div>
                            <div className="mt-1 px-1.5  text-center  mr-3 border border-gray-700 rounded">
                                <p className="text-xs">Nama</p>
                                <p className="text-l font-bold pb-1">{"ini nama yang sangat_panjang"}</p>
                            </div>
                            <div className="mt-1 px-1.5  text-center  mr-3 border border-gray-700 rounded">
                                <p className="text-l font-bold">ID: {"494949"}</p>
                            </div>
                            <p className="mt-1 italic text-xs">Semester Akhir 1444-1445 H</p>

                        </div>

                    </div>
                </div>



                <div className="flex flex-col w-[41.2mm] h-[40.5mm] bg-white border border-black ml-2 mt-4">
                    <p className="text-center mt-0.5 italic"  style={{ fontSize: '0.4rem' }}>No Ujian Madrasah Diniyah Darussaadah:</p>

                    <div className=" mt-0.5 flex ml-1">

                        <div className="text-center w-[41.2mm]">

                            <div className="py-4  text-center  mr-1 border border-gray-700 rounded">
                                {/*<p className="text-xs absolute top-50 left-1.5 transform -translate-x-50 -translate-y-50">{"nama_murid"}</p>*/}
                                <p className="text-7xl font-bold">{"448"}</p>
                            </div>
                            <div className="mt-1 px-1.5  text-center  mr-1 border border-gray-700 rounded">
                                <p className="text-xs">{"4 Ibt Pi Pagi Siang"}</p>
                            </div>
                            <p className="mt-0.5 italic"  style={{ fontSize: '0.4rem' }}>Semester Akhir 1444-1445 H</p>

                        </div>

                    </div>
                </div>


            </div>
            {/*<hr className="w-auto border-t border-black" /> /!* Horizontal line *!/*/}












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


            {modalConfirmGenerete && (
                <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">

                    <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-4" style={{maxHeight: '90vh'}}>
                        <div className="modal-content text-left ">
                            <div className="modal-content py-1 text-left px-1 pb-6">
                                <div className=" justify-between items-center pb-3">
                                    <p className="text-2xl font-bold">Operasi ini akan membuat Kartu Ujian untuk semua Murid, dan membutuhkan komputasi yang besar.</p>
                                    <p className="text-l font-bold">Pastikan perangkat anda memadai, apakah anda ingin melanjutkan?</p>
                                </div>

                            </div>

                            <button
                                onClick={() => {  setModalConfirmGenerete(false); handleGeneratePdf()}}
                                className="mt-1  bg-red-600 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                            >
                                Ya
                            </button>

                            <button
                                onClick={() => {
                                    setModalConfirmGenerete(false);

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
    );
};

export default QRGenerator;
