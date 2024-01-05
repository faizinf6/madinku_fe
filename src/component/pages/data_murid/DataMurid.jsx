
import Navbar from "../../Navbar.jsx";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ButtonGroup from "./ButtonGroup.jsx";
import EditModalPermurid from "./EditModalPermurid.jsx";
import TambahMuridModal from "./TambahMuridModal.jsx";
import { PencilSquareIcon,UserPlusIcon,ArchiveBoxIcon} from '@heroicons/react/24/solid'
import {useNavigate} from "react-router-dom";
//RekapNilai
const DataMurid = () => {
    const [adminData, setAdminData] = useState({});
    const [kelasData, setKelasData] = useState([]);
    const [selectedIdKelasKelas, setSelectedIdKelasKelas] = useState('');
    const [muridData, setMuridData] = useState([]);
    const [activeMurid, setActiveMurid] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [dispidKelas, setdispidKelas] = useState('');
    const [dataAdmin, setDataAdmin] = useState([]);

    const [showTambahModal, setShowTambahModal] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://192.168.0.3:5000/kelas/data');
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

        const fetchAdminData = async () => {
            try {
                const responseAdmin = await axios.get('http://192.168.0.3:5000/admin/all');
                setDataAdmin(responseAdmin.data);
            } catch (e) {
                console.error('Error fetching admin data:', e);
            }
        };

        fetchAdminData();
        fetchData();
    }, []);


    const handleLoadMurid = async () => {
        if (selectedIdKelasKelas) {
            console.log(selectedIdKelasKelas)
            try {
                const response = await axios.get(`http://192.168.0.3:5000/kelas/murid/all/${selectedIdKelasKelas}`);
                setMuridData(response.data);

            } catch (error) {
                console.error('Terjadi kesalahan saat memuat data murid:', error);
            }
            const matchingAdmin =  dataAdmin.find(admin => admin.id_kelas === parseInt(selectedIdKelasKelas));
            setdispidKelas(`Mustahiq: ${matchingAdmin.nama_admin}, id_kelas: ${selectedIdKelasKelas} `);



        }
    };

    const handleShowMurid = (murid) => {
        setActiveMurid(murid);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveModal = () => {
        handleLoadMurid();
        // Logika setelah menyimpan data
        setShowModal(false);
    };

    const handleTambahMurid = () => {
        setShowTambahModal(true);
    };

    const handleCloseTambahModal = () => {
        // console.log(selectedIdKelasKelas)
        setShowTambahModal(false);
    };

    const handleSaveTambahModal = () => {
        handleLoadMurid(); // Refresh data murid
        setShowTambahModal(false);
    };
    const navigate = useNavigate();
    return (
        <div> <Navbar/>
        <div className="grid w-screen place-items-center">

            <div className="mt-4">
                <ButtonGroup onChange={(gender) => setSelectedGender(gender)} />
            </div>

            <div className="mb-1 mt-1 ">

                <select
                    className="mt-5 p-2 border border-gray-300 rounded"
                    onChange={(e) => setSelectedIdKelasKelas(e.target.value)}
                    value={selectedIdKelasKelas}
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

            <div className="mb-4 flex justify-end">
                <UserPlusIcon className="mr-2  p-1 h-10 w-10 bg-orange-500 border border-orange-700 rounded  " aria-hidden="true" color="white" onClick={handleTambahMurid}/>
                <ArchiveBoxIcon className="  p-1 h-10 w-10 bg-orange-500 border border-orange-700 rounded  " aria-hidden="true" color="white" onClick={()=> navigate('/murid-boyong')}/>
            </div>


            {showTambahModal && selectedIdKelasKelas&&(
                <TambahMuridModal
                    kelasTerpilih={selectedIdKelasKelas}
                    kelasdata={kelasData}
                    onClose={handleCloseTambahModal}
                    onSave={handleSaveTambahModal}
                />
            )}

            <table className=" table-auto border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Status?</th>
                    <th className="px-4 py-2">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {muridData.map(kelas => (
                    kelas.Murids.map((murid,index)=>(
                        <tr key={murid.id_murid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                            <td className="border border-gray-300 px-4 py-2">{murid.id_murid}</td>
                            <td className="border border-gray-300 px-4 py-2">{murid.nama_murid}</td>
                            <td className="border border-gray-300 px-4 py-2">{murid.isBoyong ? 'Ya' : '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">


                                <button
                                    // className="px-4 py-2 bg-teal-500 text-white rounded"
                                    className="px-3 py-1.5 border bg-gray-600 text-white rounded mt-4"

                                    onClick={() => handleShowMurid(murid)}
                                >Edit
                                </button>
                            </td>
                        </tr>



                    ))


                ))}
                </tbody>
            </table>

            {showModal && activeMurid && (
                <EditModalPermurid
                    dataMuridDipilih={activeMurid}
                    listOfKelas={kelasData}
                    apakahSama={isAuthorized(adminData,parseInt(selectedIdKelasKelas))}
                    onClose={handleCloseModal}
                    onSave={handleSaveModal}
                />
            )}
        </div>
        </div>
    );

    function isAuthorized(admin, kelas) {

        // Jika admin adalah super_admin, abaikan perbandingan dan kembalikan true
        if (admin.super_admin) {
            return true;
        }

        // Jika bukan super_admin, bandingkan id_kelas
        return admin.id_kelas === parseInt(selectedIdKelasKelas);
    }

};

export default DataMurid;


//DataMurid