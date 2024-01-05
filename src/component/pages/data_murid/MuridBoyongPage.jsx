import {useEffect, useState} from "react";
import axios from "axios";
import Navbar from "../../Navbar.jsx";

export const MuridBoyongPage = () => {
    const [dataMuridBoyong, setDataMuridBoyong] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch data from server
    useEffect(() => {
        axios.get(`http://192.168.0.3:5000/murid/boyong-pgnt?page=${currentPage}`)
            .then(response => {
                setDataMuridBoyong(response.data.data);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [currentPage]);

    // Handle checkbox change
    const handleCheckboxChange = (id, checked) => {
        setDataMuridBoyong(dataMuridBoyong.map(item =>
            item.id_murid === id ? { ...item, isBoyong: checked } : item
        ));
    };

    // Handle save button click
    const handleSaveClick = (murid) => {
        axios.patch(`http://192.168.0.3:5000/murid/${murid.id_murid}`, murid)
            .then(() => fetchDataAgain())
            .catch(error => console.error('Error updating data:', error));
    };

    // Function to fetch data again
    const fetchDataAgain = () => {
        axios.get(`http://192.168.0.3:5000/murid/boyong-pgnt?page=${currentPage}`)
            .then(response => {
                setDataMuridBoyong(response.data.data);
                setCurrentPage(response.data.currentPage);
                setTotalPages(response.data.totalPages);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    // Render table with pagination
    return (
        <div> <Navbar/>

            <p className="leading-relaxed text-center font-bold italic mt-4">Arsip Murid Boyong/Keluar</p>

            <div className=" container overflow-x-auto grid w-screen place-items-center p-4">
            <table className="divide-y divide-gray-500">
                <thead>
                <tr className="bg-yellow-400">
                    <th className="px-6 py-3 text-xs text-left text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-xs text-left text-gray-500 uppercase">Nama</th>
                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">kls terakhir</th>
                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">isBoyong</th>
                    <th className="px-6 py-3 text-xs text-gray-500 uppercase">Aksi</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-500">
                {dataMuridBoyong.map((murid) => (
                    <tr key={murid.id_murid}>
                        <td className="px-4 py-4 text-sm">{murid.id_murid}</td>
                        <td className="px-6 py-4 font-bold text-sm">{murid.nama_murid}</td>
                        <td className="px-6 py-4 text-xs">{murid.nama_kelas}</td>
                        <td className="px-4 py-4 text-sm text-center align-middle">
                            <input
                                type="checkbox"
                                checked={murid.isBoyong}
                                onChange={(e) => handleCheckboxChange(murid.id_murid, e.target.checked)}
                                className="rounded w-5 h-5 "
                            />
                        </td>
                        <td className="px-6 py-4 text-sm">
                            <button
                                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                                onClick={() => handleSaveClick(murid)}
                            >
                                Simpan
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        className={`mx-2 px-4 py-2 text-white ${currentPage === index + 1 ? 'bg-blue-500' : 'bg-gray-300'} rounded`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>

        </div>
    );
}