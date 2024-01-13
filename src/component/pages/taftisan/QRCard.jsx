// QRCard.jsx
import React from 'react';
import QRCode from 'qrcode.react';

const QRCard = ({ idMurid, namaMurid,kelas_murid,marginLeft }) => {
    const last3Digits = idMurid.slice(-3);

    return (
        <div className={`flex flex-col items-center justify-center w-[50mm] h-[80mm] bg-white border border-black ml-${marginLeft}`}>
            <p className="mb-4">No Ujian: {last3Digits}</p>
            <QRCode value={idMurid} size={parseInt(40 / 0.264583)} level="H" />
            <div className="text-center mt-2">
                <p>{idMurid}</p>
                <p>{namaMurid}</p>
                <p>{kelas_murid}</p>

            </div>
        </div>
    );
};

export default QRCard;
