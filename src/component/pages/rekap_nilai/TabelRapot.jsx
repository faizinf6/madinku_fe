import React from 'react';

const TabelRapot = ({ jsonData, dataKehadiran }) => {
    const allFans = new Set();
    jsonData.flat().forEach(item => {
        allFans.add(item.fan);
    });
    const fanHeaders = Array.from(allFans);

    console.log(jsonData)
    // Mengelompokkan data kehadiran berdasarkan 'id_murid'
    const kehadiranById = dataKehadiran.reduce((acc, item) => {
        acc[item.id_murid] = item.kehadiran.alpha; // asumsikan 'alpha' adalah nilai pelanggaran
        return acc;
    }, {});

    // Mengelompokkan dan menghitung nilai murid, total, pelanggaran, dan grand total
    const groupedData = jsonData.reduce((acc, current) => {
        current.forEach(item => {
            const { id_murid, nama_murid, fan, isi_nilai } = item;
            const adjustedValue = isi_nilai < 5.5 ? 5.5 : isi_nilai;
            if (!acc[id_murid]) {
                acc[id_murid] = { nama_murid, nilai: {}, total: 0, count: 0, pelanggaran: kehadiranById[id_murid] || 0 };
            }
            acc[id_murid].nilai[fan] = adjustedValue;
            acc[id_murid].total += adjustedValue;
            acc[id_murid].count += 1;
        });
        return acc;
    }, {});

    // Menghitung grand total dan rata-rata
    Object.values(groupedData).forEach(murid => {
        murid.grandTotal = murid.total - murid.pelanggaran;
        murid.average = (murid.grandTotal / murid.count).toFixed(1); // Memastikan satu tempat desimal
    });

    const tableRows = Object.values(groupedData).map((murid, index) => (
        <tr key={murid.nama_murid} className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}`}>
            <td className={`sticky left-0 z-10  px-4 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} ` }>{murid.nama_murid}</td>
            {fanHeaders.map(fan => {
                const nilai = murid.nilai[fan] || '-';
                const isHighlighted = nilai !== '-' && nilai <= 5.5;
                return (
                    <td key={`${murid.nama_murid}-${fan}`}
                        className={`border px-4 py-2 ${isHighlighted ? ' font-bold text-red-600' : ''}`}>
                        {nilai}
                    </td>
                );
            })}
            <td className="border px-4 py-2">{murid.total}</td>
            <td className="border px-4 py-2">{murid.pelanggaran}</td>
            <td className="border px-4 py-2">{murid.grandTotal}</td>
            <td className={`border px-4 py-2 ${parseFloat(murid.average) <= 5.5 ? 'bg-red-600 text-white' : ''}`}>
                {murid.average}
            </td>

            <td className="border px-4 py-2">{murid.nama_murid}</td>
        </tr>
    ));

    return (
        <table className=" min-w-full table-auto border-collapse border border-gray-300 ">
            <thead>
            <tr className="bg-gray-400">
                <th className="sticky left-0 z-10 border px-4 py-2 bg-gray-400">Nama/Fan</th>
                {fanHeaders.map(fan => <th key={fan} className="border px-4 py-2">{fan}</th>)}
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Pelanggaran</th>
                <th className="border px-4 py-2">Grand Total</th>
                <th className="border px-4 py-2">Rata-rata</th>
                <th className="border px-4 py-2">Nama</th>
            </tr>
            </thead>
            <tbody>{tableRows}</tbody>
        </table>
    );
};

export default TabelRapot;
