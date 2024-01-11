

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ButtonGroup from "../data_murid/ButtonGroup.jsx";
import EditModalPermurid from "../data_murid/EditModalPermurid.jsx";
import TambahMuridModal from "../data_murid/TambahMuridModal.jsx";
import { PencilSquareIcon,UserPlusIcon,ArchiveBoxIcon} from '@heroicons/react/24/solid'
import {useNavigate} from "react-router-dom";
import Navbar from "../../Navbar.jsx";

import {toast, ToastContainer} from "react-toastify";
import baseURL from "../../../config.js";
//RekapNilai
const PanelUjian = () => {
    const [adminData, setAdminData] = useState({});
    const [kelasData, setKelasData] = useState([]);
    const [selectedIdKelas, setSelectedIdKelas] = useState('');
    const [dataTaftisanMurid, setDataTaftisanMurid] = useState([]);
    const [dataTaftisanDipilih, setDataTaftisanDipilih] = useState(null);
    const [showModaltaftisan, setShowModaltaftisan] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [dataAllAdmin, setDataAllAdmin] = useState([]);
    const [dispidKelas, setdispidKelas] = useState('');


    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}/kelas/data`);
            setKelasData(response.data);
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data:', error);
        }
    };
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setAdminData(user);
        }

        console.log(user)
        const fetchAdminData = async () => {
            try {
                const responseAdmin = await axios.get(`${baseURL}/admin/all`);
                setDataAllAdmin(responseAdmin.data);
            } catch (e) {
                console.error('Error fetching admin data:', e);
            }
        };

        fetchAdminData();
        fetchData();
    }, []);

    const handleLoadMurid = async () => {
        if (selectedIdKelas) {
            // console.log(selectedIdKelas)

            try {
                const response = await axios.get(`${baseURL}/nilai/taftisan?id_kelas=${selectedIdKelas}`);
                // console.log(response.data)
                setDataTaftisanMurid(response.data);

            } catch (error) {
                console.error('Terjadi kesalahan saat memuat data murid:', error);
            }

            const matchingAdmin =  dataAllAdmin.find(admin => admin.id_kelas === parseInt(selectedIdKelas));
            setdispidKelas(`Mustahiq: ${matchingAdmin.nama_admin}, id_kelas: ${selectedIdKelas} `);

        }
    };

    const handleShowStatusTaftisan = (murid) => {
        setDataTaftisanDipilih(murid.data_taftisan);
        setCurrentDataDipilih(murid.data_taftisan)
        // setCurrentData(murid.data_taftisan);
         setShowModaltaftisan(true);

    };













    const [currentDataDipilih, setCurrentDataDipilih] = useState(dataTaftisanMurid);

    useEffect(() => {
        // setCurrentData(dataTaftisanDipilih);
        setDataTaftisanMurid(dataTaftisanMurid);

    }, [dataTaftisanMurid]);
// Menghandle perubahan pada toggle switch
    const handleToggleChange = (id_mapel, status) => {
        setCurrentDataDipilih(currentDataDipilih.map(item =>
            item.id_mapel === id_mapel ? { ...item, status_taftisan: status } : item
        ));
    };

// Menghandle tombol "Centang Semua"
    const handleCheckAll = () => {
        setCurrentDataDipilih(currentDataDipilih.map(item => ({ ...item, status_taftisan: true })));
    };


    // Fungsi untuk menemukan perubahan
    const findChanges = () => {
        let changes = [];
        currentDataDipilih.forEach(itemChanged => {
            const originalItem = dataTaftisanDipilih.find(item => item.id_mapel === itemChanged.id_mapel);
            if (originalItem.status_taftisan !== itemChanged.status_taftisan) {
                changes.push({
                    id_murid: itemChanged.id_murid,
                    id_mapel: itemChanged.id_mapel,
                    status_taftisan: itemChanged.status_taftisan
                });
            }
        });
        return changes;
    };


    // Menghandle tombol "Simpan"
    const handleSave = async () => {
        const changes = findChanges();

        if (changes.length === 0) {
            toast.warning(`Tidak ada perubahan,tidak disimpan`, {
                position: "top-center",
                autoClose: 1100,

            });
            return;
        }


        if(isSuperAdmin(adminData)){
        try {
            await axios.patch(`${baseURL}/nilai/update/taftisan`, changes);
             toast.success(`Perubahan disimpan`, {
                position: "top-center",
                autoClose: 1100,
            });

            // setDataTaftisanMurid(currentData);
            await handleLoadMurid()



        } catch (error) {
            console.error('Gagal menyimpan perubahan:', error);
        }

        setShowModaltaftisan(false);}
        else {
            toast.error(`Hanya Penghar yang dapat mengubah Panel ini, Silahkan hubungi pengurus`, {
                position: "top-center",
                autoClose: 3100,

            });

        }

    };


    const navigate = useNavigate();
    return (
        <div> <Navbar/>
            <div className="grid w-screen place-items-center p-2">
                <ToastContainer/>
                <p className="leading-relaxed text-center font-bold italic mt-4">Cek Kitab:</p>
                {/*<p className="text-center text-xs italic mt-2">(Mohon Maaf Fitur dan Menu lain sedang dalam tahap pembangunan)</p>*/}

                <div className="mt-4">
                    <ButtonGroup onChange={(gender) => setSelectedGender(gender)} />
                </div>

                <div className="mb-1 mt-1 ">
                    <select
                        className="mt-5 p-2 border border-gray-300 rounded"
                        onChange={(e) => setSelectedIdKelas(e.target.value)}
                        value={selectedIdKelas}
                    >
                        <option value="">Pilih Kelas</option>
                        {kelasData.filter(kelas => kelas.gender.includes(selectedGender)).map(kelas => (
                            <option key={kelas.id_kelas} value={kelas.id_kelas}>
                                {kelas.nama_kelas}
                            </option>
                        ))}
                    </select>
                    <button
                        className="ml-2 px-4 py-1.5 bg-blue-500 text-white rounded"
                        onClick={handleLoadMurid}
                    >
                        Proses
                    </button>
                </div>
                <p className="mb-3 text-blue-500 text-xs font-bold"> {dispidKelas}</p>




                <div>
                <table className=" table-auto bg-teal-500">
                    <thead className="text-white">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2 ">Nama</th>
                        <th className="px-4 py-2">Sudah <br/>Lengkap?</th>
                        <th className="px-4 py-2">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataTaftisanMurid.map((murid, index) => {
                        // Check if all status_taftisan values are true
                        const semuaTaftisanLengkap = murid.data_taftisan.every(item => item.status_taftisan);

                        return (
                            <tr key={murid.id_murid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                <td className="border border-gray-300 px-4 py-2">{murid.id_murid}</td>
                                <td className="border border-gray-300 px-4 py-2 font-bold">{murid.nama_murid}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center align-middle ">
                                    <div className={`p-1.5 font-bold text-white rounded-full flex items-center justify-center ${semuaTaftisanLengkap ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {semuaTaftisanLengkap ? 'Ya' : 'Belum'}
                                    </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        className="px-3 py-2 border bg-gray-600 text-white rounded"
                                        onClick={() => handleShowStatusTaftisan(murid)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                    <button
                        onClick={() => {
                            navigate("/buat-qr")
                        }}
                        className=" mt-10  py-2 min-w-full bg-orange-400 text-white font-bold rounded-2xl uppercase tracking-wider hover:bg-red-900">
                        Buat Qr Code
                    </button>


                    <button
                        onClick={() => {
                            navigate("/masuk-ujian")
                        }}
                        className=" mt-5  py-2 min-w-full bg-red-600 text-white font-bold rounded-2xl uppercase tracking-wider hover:bg-red-900">
                        Mode Scanner Ujian
                    </button>
                </div>



                {showModaltaftisan&&(
                    <div>

                        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                            <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-95">
                                <button onClick={() => setShowModaltaftisan(false)}
                                        className="m-4 modal-close text-white bg-red-600 text-l font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-900 hover:text-white">
                                    X
                                </button>
                            </div>

                            <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-2" style={{maxHeight: '90vh'}}>
                                <div className="modal-content text-left ">
                                    {/* Modal header, close button, and table */}
                                    <div className="modal-content py-1 text-left px-1 pb-6">
                                        <div className="flex justify-between items-center pb-3">
                                            <p className="text-2xl font-bold">Data Taftisan {dataTaftisanMurid[0]?.nama_murid}</p>

                                        </div>

                                        <button
                                            onClick={handleCheckAll}
                                            className="mt-2 mb-4 bg-green-500 text-white text-lg font-semibold px-5 py-1 rounded-lg hover:bg-gray-700"
                                        >
                                            Centang Semua
                                        </button>

                                        <table className="min-w-full leading-normal ">
                                            <thead >
                                            <tr className="bg-yellow-300 sticky top-0 z-10">
                                                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Pelajaran
                                                </th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {currentDataDipilih.map(({ id_mapel, nama_mapel, status_taftisan},index) => (
                                                <tr key={id_mapel} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}>
                                                    <td className="px-5 py-3 border-b border-gray-200  font-bold">{nama_mapel}</td>
                                                    <td className="px-5 py-3 border-b border-gray-200 text-center align-middle">
                                                        <input
                                                            type="checkbox"
                                                            className="appearance-none w-7 h-7 border-2 border-blue-500 rounded-lg bg-white mt-1"
                                                            checked={status_taftisan}
                                                            onChange={(e) => handleToggleChange(id_mapel, e.target.checked)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>


                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={() => {setShowModaltaftisan(false)}}
                                                className="bg-red-500 text-white text-lg font-semibold px-5 py-2 rounded hover:bg-gray-700"
                                            >
                                                Tutup
                                            </button>

                                            <button
                                                onClick={handleSave}
                                                className="bg-blue-500 text-white text-lg font-semibold px-5 py-2 rounded hover:bg-gray-700"
                                            >
                                                Simpan
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );

    function isAuthorized(admin,selectedIdKelas) {

        // Jika admin adalah super_admin, abaikan perbandingan dan kembalikan true
        if (admin.super_admin) {
            return true;
        }

        // Jika bukan super_admin, bandingkan id_kelas
        console.log(selectedIdKelas)
        console.log(admin.id_kelas)
        return admin.id_kelas === parseInt(selectedIdKelas);
    }

    function isSuperAdmin(admin) {

        return admin.super_admin
    }

};

export default PanelUjian;


//DataMurid