import React from "react";

export const TempelanNomer = ({ nama_murid, idMurid, kelas_murid,marginLeft }) => {
    const last3Digits = idMurid.slice(-3);

    return (
        <div className={`flex flex-col w-[41.2mm] h-[40.5mm] bg-white border border-black ml-${marginLeft}`}>
            <p className="text-center mt-0.5 italic" style={{ fontSize: '0.4rem' }}>No Ujian Madrasah Diniyah Darussaadah:</p>

            <div className="mt-0.5 text-center w-[41.2mm] relative">
                <div className="py-4 border border-gray-700 rounded relative w-full">
                    <p className="text-xs absolute left-1/2 transform -translate-x-1/2" style={{ fontSize: '0.6rem', top: '0' }}>{nama_murid}</p>
                    <p className="text-7xl font-bold">{last3Digits}</p>
                </div>
                <div className="mt-1 px-1.5 text-center border border-gray-700 rounded">
                    <p className="text-xs">{kelas_murid}</p>
                </div>
                <p className="mt-0.5 italic" style={{ fontSize: '0.4rem' }}>Semester Akhir 1444-1445 H</p>
            </div>
        </div>
    );



}