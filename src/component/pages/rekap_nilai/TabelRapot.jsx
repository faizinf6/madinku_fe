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
        acc[item.id_murid] = item.kehadiran.alpha/15; // asumsikan 'alpha' adalah nilai pelanggaran
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
        murid.average = (murid.grandTotal / murid.count);
    });

    const sortedData = Object.values(groupedData).sort((a, b) => b.grandTotal - a.grandTotal);

    // Compute rankings based on grandTotal
    let rank = 1;
    for (let i = 0; i < sortedData.length; i++) {
        if (i > 0 && sortedData[i].grandTotal === sortedData[i - 1].grandTotal) {
            sortedData[i].rank = sortedData[i - 1].rank; // Same rank for equal grandTotals
        } else {
            sortedData[i].rank = rank;
        }
        rank++;
    }


    //JANGAN DI HAPUS YA BAAAAANG!
    // ini kalau mau sort rangking berdasarkan nilai rata-rata murid
    // const sortedMurids = Object.values(groupedData).sort((a, b) => b.average - a.average);
    //
    // // Rank the students, handling ties
    // let rank = 1;
    // sortedMurids.forEach((murid, index) => {
    //     if (index > 0 && murid.average === sortedMurids[index - 1].average) {
    //         murid.rank = sortedMurids[index - 1].rank;
    //     } else {
    //         murid.rank = rank;
    //     }
    //     rank++;
    // });

    const formatNumber = (number) => {
        // Round to two decimal places
        let formattedNumber = Math.round(number * 100) / 100;
        // Convert to string and remove trailing zeros
        return formattedNumber.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1');
    };

    const tableRows = sortedData.map((murid, index) => (
        <tr key={murid.id_murid} className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}`}>
            <td className={`sticky left-0 font-bold  px-4 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} ` }>{murid.nama_murid}</td>
            {fanHeaders.map(fan => {
                const nilai = murid.nilai[fan] || '-';
                const isHighlighted = nilai !== '-' && nilai <= 5.5;
                return (
                    <td key={`${murid.id_murid}-${fan}`}
                        className={`border px-4 py-2 ${isHighlighted ? 'font-bold text-red-600' : ''}`}>
                        {isNaN(nilai) ? "" : (nilai).toFixed(1)}
                    </td>
                );
            })}
            <td className="border px-4 py-2">{(murid.total).toFixed(1)}</td>
            <td className="border px-4 py-2"> {isNaN(murid.pelanggaran) ? "" : (murid.pelanggaran).toFixed(2)}</td>
            <td className="border px-4 py-2">{(murid.grandTotal).toFixed(1)}</td>
            <td className={`border px-4 py-2 ${parseFloat((murid.average)) <= 5.5 ? 'bg-red-600 text-white' : ''}`}>
                {formatNumber(parseFloat(murid.average))}
            </td>
            <td className="border px-4 py-2">{murid.rank}</td> {/* New column for ranking */}

            <td className="border px-4 py-2">{murid.nama_murid}</td>
        </tr>
    ));



    return (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
            <tr className="bg-yellow-300 sticky top-0 z-10"> {/* Add sticky top-0 z-10 here */}
                <th className="border px-4 py-2 sticky left-0 bg-yellow-300 z-20">Nama/Fan</th>
                {fanHeaders.map(fan => <th key={fan} className="border px-4 py-2 sticky bg-yellow-300">{fan}</th>)} {/* Add sticky bg-yellow-300 */}
                <th className="border px-4 py-2 sticky bg-yellow-300">Total</th>
                <th className="border px-4 py-2 sticky bg-yellow-300">Pelanggaran</th>
                <th className="border px-4 py-2 sticky bg-yellow-300">Grand Total</th>
                <th className="border px-4 py-2 sticky bg-yellow-300">Rata-rata</th>
                <th className="border px-4 py-2 sticky bg-yellow-300">Peringkat</th> {/* New header for ranking */}

                <th className="border px-4 py-2 sticky bg-yellow-300">Nama</th>
            </tr>
            </thead>
            <tbody>{tableRows}</tbody>
        </table>

    );
};

export default TabelRapot;
