// QRCard.jsx
import React from 'react';
import QRCode from 'qrcode.react';
import logo from "../../../logo_ppds.png";

const QRCard = ({ idMurid, namaMurid,kelas_murid,marginLeft }) => {
    const last3Digits = idMurid.slice(-3);

    return (
        <div className={`flex flex-col w-[100mm] h-[60mm] bg-white border border-black ml-${marginLeft}`}>
            <div className="flex items-center">
                <div className="ml-2 mt-1 flex items-center">
                    <img src={logo} alt="Logo PPDS" className="w-10 h-18 mr-4" />
                    <div>
                        <p className="text-lg font-bold">Madrasah Diniyah</p>
                        <p className="text-xs font-semibold">Pondok Pesantren Darussaadah</p>
                    </div>
                </div>
                <div className="text-center ml-4 mr-3 border border-gray-700 rounded">
                    <p className="px-1.5 text-xs">No Ujian</p>
                    <p className="text-l font-bold">{last3Digits}</p>
                </div>
            </div>

            <div className=" mt-2 flex ml-2">
                <QRCode value={idMurid} size={parseInt(40 / 0.264583)} level="H" />
                <div className="text-center ml-2 w-[70mm]">

                    <div className=" px-1.5  text-center  mr-3 border border-gray-700 rounded">
                        <p className="text-l font-bold">{kelas_murid}</p>
                    </div>
                    <div className="mt-1 px-1.5  text-center  mr-3 border border-gray-700 rounded">
                        <p className="text-xs">Nama</p>
                        <p className="text-l font-bold pb-1">{namaMurid}</p>
                    </div>
                    <div className="mt-1 px-1.5  text-center  mr-3 border border-gray-700 rounded">
                        <p className="text-l font-bold">ID: {idMurid}</p>
                    </div>
                    <p className="mt-1 italic text-xs">Semester Akhir 1444-1445 H</p>
                </div>

            </div>
            {/*<p className="ml-5  italic" style={{ fontSize: '0.6rem' }}>Semester Akhir 1444-1445</p>*/}

        </div>
    );
};

export default QRCard;
