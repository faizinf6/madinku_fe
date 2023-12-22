
    import React, { useState } from 'react';
    import axios from 'axios';

    const EditModalPermurid = ({ dataMuridDipilih, listOfKelas, onClose, onSave,apakahSama }) => {
        const [namaMurid, setNamaMurid] = useState(dataMuridDipilih.nama_murid);
        const [kelasMurid, setKelasMurid] = useState(dataMuridDipilih.id_kelas);
        const [isBoyong, setIsBoyong] = useState(dataMuridDipilih.isBoyong);
        const handleSubmit = async () => {
            try {
                await axios.patch(`http://192.168.0.3:5000/murid/${dataMuridDipilih.id_murid}`, {
                    id_murid: dataMuridDipilih.id_murid,
                    nama_murid: namaMurid,
                    id_kelas: kelasMurid,
                    isBoyong: isBoyong
                });
                onSave();
            } catch (error) {
                console.error('Terjadi kesalahan saat mengirim data:', error);
            }
        };


        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg">
                    {
                        apakahSama ? (
                            <>
                                <label className="block">Nama Murid</label>
                                <input
                                    type="text"
                                    value={namaMurid}
                                    onChange={(e) => setNamaMurid(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full mb-4"
                                />

                                <label className="block">Kelas</label>
                                <select
                                    className="border border-gray-300 p-2 rounded w-full mb-4"
                                    value={kelasMurid}
                                    onChange={(e) => setKelasMurid(e.target.value)}
                                >
                                    {listOfKelas.map(kelas => (
                                        <option key={kelas.id_kelas} value={kelas.id_kelas}>
                                            {kelas.nama_kelas}
                                        </option>
                                    ))}
                                </select>

                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={isBoyong}
                                        onChange={(e) => setIsBoyong(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Boyong
                                </label>

                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-500 text-white rounded w-full"
                                >
                                    Submit
                                </button>
                            </>
                        ):(
                            <p className="text-lg font-bold p-4">Anda bukan Mustahiq Kelas ini, <br/> Silahkan hubungi Pengurus Madin untuk mengedit.</p>
                        )
                    }

                    <button
                        onClick={onClose}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded w-full"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    export default EditModalPermurid;

    //EditModalPermurid
