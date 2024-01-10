import Navbar from "../../Navbar.jsx";
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ButtonGroup from "../data_murid/ButtonGroup.jsx";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabelRapot from "./TabelRapot.jsx";
import '../gaya.css'
import baseURL from "../../../config.js";


//RekapNilai
const RekapNilai = () => {

    // untuk data mapel
    const [mapelData, setMapelData] = useState([]);
    const [selectedMapel, setSelectedMapel] = useState({});
    const [dataMuridDanNilainya, setDataMuridDanNilainya] = useState([]);


    //untuk data rapot
    const [dataRapotJson, setdataRapotJson] = useState([]);
    const [showTabelRapotModal, setshowTabelRapotModal] = useState(false);


    const [adminData, setAdminData] = useState({});
    const [kelasData, setKelasData] = useState([]);
    const [idSelectedKelas, setIdSelectedKelas] = useState(0);
    const [muridData, setMuridData] = useState([]);
    const [activeMurid, setActiveMurid] = useState(null);
    const [showModalMuridMapel, setShowModalMuridMapel] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');
    const [editedScores, setEditedScores] = useState({});

    const [showTambahModal, setShowTambahModal] = useState(false);


    //modal nilai muhafadzoh
    const [showMuhafadzohModal, setShowMuhafadzohModal] = useState(false);
    const [dataNilaiHafalan, setDataNilaiHafalan] = useState([]);


    //untuk kehadiran
    const [dataMuridDanKehadiran, setdataMuridDanKehadiran] = useState([]);
    const [showKehadiranModal, setshowKehadiranModal] = useState(false);
    const [kehadiran, setKehadiran] = useState({});
    const [kehadiranAsli, setKehadiranAsli] = useState({});

    const allowedPattern = /^\d{0,2}(\.|,)?\d{0,1}$/;

    const fetchDataKehadiran = async () => {

        if (idSelectedKelas!==0) //bila id kelas bukan nol, kalau nol nggak di eksekusi
        try {

            const responseKehadiranDataMurid = await axios.get(
                `${baseURL}/murid/kehadiran/perkelas/${idSelectedKelas}`)


            setdataMuridDanKehadiran(responseKehadiranDataMurid.data);
            console.log(responseKehadiranDataMurid.data)

            // Initialize kehadiranAsli with the fetched data
            const fetchedKehadiran = {}; // Create a new object to hold the current values
            responseKehadiranDataMurid.data.forEach((murid) => {
                fetchedKehadiran[murid.id_murid] = murid.kehadiran;
            });

            setKehadiran(fetchedKehadiran);
            setKehadiranAsli(fetchedKehadiran);


        } catch (error) {
            // toast.error(`Error ${error.message} hubungi pengurus`, {autoClose: 1100,});
        }
    }

    useEffect(() => {
        fetchDataKehadiran();
    }, [showKehadiranModal]);

    const handleEditKehadiran = (id_murid, field, value) => {
        setKehadiran((prev) => ({
            ...prev,
            [id_murid]: { ...prev[id_murid], [field]: value },
        }));
    };

    const handleSaveDataKehadiran = async (murid) => {


        const updatedKehadiran = kehadiran[murid.id_murid] || murid.kehadiran;

        if (isAuthorized(adminData,idSelectedKelas)){
        try {

            const response = await axios.patch(`${baseURL}/murid/kehadiran/${murid.id_murid}`, {
                alpha: updatedKehadiran.alpha,
                izin: updatedKehadiran.izin,
                sakit: updatedKehadiran.sakit
            });



            toast.success(`Nilai Berhasil Disimpan!, untuk ${murid.nama_murid}`, {autoClose: 1100,});


        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            toast.error(`Gagal menyimpan, coba ulangi/refresh halaman`, {autoClose: 1100,});
        }

        setKehadiranAsli(prev => ({
            ...prev,
            [murid.id_murid]: { ...updatedKehadiran }
        }));}
        else {
            toast.error(`Anda bukan Mustahiq Kelas ini`, {autoClose: 3100,});


        }


    };

    const isChanged = (id_murid) => {
        const original = kehadiranAsli[id_murid];
        const current = kehadiran[id_murid];

        // Check if either original or current is not set, return false to keep button disabled
        if (!original || !current) return false;

        // Check if any of the values have changed
        return (
            original.alpha !== current.alpha ||
            original.sakit !== current.sakit ||
            original.izin !== current.izin
        );
    };


    const fetchDataKelas = async () => {
        try {
            const response = await axios.get(`${baseURL}/kelas/data`);
            setKelasData(response.data);
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data:', error);
            // toast.error(`Terjadi kesalahan saat memuat data: ${error.message}`, {autoClose: 3100,});

        }
    };

    const handleLoadMapel = async () => {

        if (idSelectedKelas) {


            try {
                const response = await axios.get(
                    `${baseURL}/kelas/mapel/all/${idSelectedKelas}`
                );

                // const muhafadzohMapel = response.data.find(mapel => mapel.nama_mapel === "Muhafadzoh");
                // await fetchDataNilaiHafalan(muhafadzohMapel)
                // console.log(muhafadzohMapel)

                // Check if the response data is empty
                if (response.data && response.data.length === 0) {
                    toast.error(`Tidak ada data / kosong`, {autoClose: 3100,});
                    setMapelData([]);

                    // Clear mapelData if data is empty
                    // Handle the empty data scenario appropriately here
                } else {
                    setMapelData(response.data); // Set data as usual if not empty
                    toast.success(`Berhasil mendapatkan data dari server`, {autoClose: 1100,});

                }


            } catch (error) {
                console.log("Caught an error: ", error);
                // Handle other errors
            }


        }
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {setAdminData(user);}

        // console.log(idSelectedKelas)

        fetchDataKelas();
    }, []);

    const fetchDataNilaiMuridPerMapel = async (mapel) => {
        const mapelId = mapel?.id_mapel || selectedMapel.id_mapel;
        if (mapelId && idSelectedKelas) {
            try {
                const responseDataMurid = await axios.get(
                    `${baseURL}/nilai/rekap?id_kelas=${idSelectedKelas}&id_mapel=${mapelId}`
                );
                setDataMuridDanNilainya(responseDataMurid.data);



            } catch (error) {
                setDataMuridDanNilainya([]);
                console.log("There was an error: " + error.message);
            }
        }
    };
    const fetchDataNilaiHafalan = async (mapel) => {
        const mapelId = mapel?.id_mapel || selectedMapel.id_mapel;
        // await fetchDataNilaiMuridPerMapel(mapel)
        if (mapelId && idSelectedKelas) {
            try {
                const responseDataMurid = await axios.get(
                    `${baseURL}/nilai/hafalan?id_kelas=${idSelectedKelas}`
                );


                const response= await axios.get(
                    `${baseURL}/nilai/rekap?id_kelas=${idSelectedKelas}&id_mapel=${mapelId}`
                );
                console.log(response)

                const mergedData = response.data.map(murid => {
                    // Find the corresponding entry in dataNilaiHafalan
                    const nilaiHafalan = responseDataMurid.data.find(hafalan => hafalan.id_murid === murid.id_murid);

                    // Merge the two objects if the corresponding entry is found
                    if (nilaiHafalan) {
                        return {
                            ...murid,
                            ...nilaiHafalan
                        };
                    }

                    // If no corresponding entry is found, return the original item from dataMuridDanNilai
                    return murid;
                });

                setDataNilaiHafalan(mergedData);


            } catch (error) {
                setDataNilaiHafalan([]);

                toast.error(`Error ${error.message}`, {autoClose: 3100,});

            }
        }
    };


    useEffect(() => {

        fetchDataNilaiMuridPerMapel();

    }, [selectedMapel]);


    const handleScoreChange = (id, newScore) => {
        setEditedScores({...editedScores, [id]: newScore});
    };

    const handleSave = async (student) => {
        const originalScore = student.isi_nilai;
        const updatedScore = editedScores[student.id_murid] || student.isi_nilai;

        if (isAuthorized(adminData,idSelectedKelas)){
        try {
            const responseDataMurid = await axios.patch(
                `${baseURL}/nilai/update?id=${student.id_murid}&id_kelas=${idSelectedKelas}&id_mapel=${student.id_mapel}&isi_nilai=${updatedScore}`
            );
            // Handle the response as needed

            fetchDataNilaiMuridPerMapel();
            const newEditedScores = {...editedScores};
            delete newEditedScores[student.id_murid];
            setEditedScores(newEditedScores);


            // Show success toast with both values

            toast.success(`Nilai berubah dari ${originalScore} -> ${updatedScore}, berhasil disimpan! ${student.nama_murid}, ${selectedMapel.nama_mapel}`, {autoClose: 1100,});

        } catch (error) {

            toast.error(`Error updating data ${error}`, {autoClose: 3100,});

        }} else {
            toast.error(`Anda Bukan Mustahiq Kelas ini`, {autoClose: 3100,});


        }
    };


    useEffect(() => {
        if (showModalMuridMapel) {
            document.body.style.overflow = 'hidden'; // Disable background scrolling
        } else {
            document.body.style.overflow = 'unset'; // Enable background scrolling
        }
    }, [showModalMuridMapel]);


    const handleInputClick =   async (data_mapel) => {
        setSelectedMapel(data_mapel);
         await fetchDataNilaiMuridPerMapel(data_mapel);

        if (data_mapel.nama_mapel === "Muhafadzoh") {
             await fetchDataNilaiHafalan(data_mapel);
            setShowMuhafadzohModal(true)


        } else {

            setShowModalMuridMapel(true)
        }

    };


    const handleBuatRekapRapotClick = async () => {
        await fetchDataKehadiran()
        try {


            const response = await axios.get(
                `${baseURL}/murid/rapot/${idSelectedKelas}`
            );
            // Set the response text to state
            setdataRapotJson(response.data);
            setshowTabelRapotModal(true)



        } catch (error) {
            // Set error message to state

            toast.error(`Gagal mengambil data, silahkan ulangi/Refresh beberapa saat lagi`, {autoClose: 1100,});
            toast.error(``, {autoClose: 3100,});


        }



    };

    const [scores, setScores] = useState({});
    const [hasChanged, setHasChanged] = useState({});

    useEffect(() => {
        const initialScores = {};
        const initialChanges = {};
        dataNilaiHafalan.forEach(murid => {
            initialScores[murid.id_murid] = {
                pencapaian: murid.pencapaian,
                kelancaran: murid.kelancaran,
                artikulasi: murid.artikulasi
            };
            initialChanges[murid.id_murid] = false;
        });
        setScores(initialScores);
        setHasChanged(initialChanges);
    }, [dataNilaiHafalan]);

    const handleScoreHafalanChange = (id_murid, field, value) => {

        setScores(prevScores => ({
            ...prevScores,
            [id_murid]: {
                ...prevScores[id_murid],
                [field]: parseInt(value, 10) || 0
            }
        }));
        setHasChanged(prevChanges => ({
            ...prevChanges,
            [id_murid]: true
        }));
    };
    const handleUpdateNilaiHafalan = async (murid) => {

        const nilaihafalanMurid =scores[murid.id_murid]


        try {

            const response = await axios.patch(`${baseURL}/nilai/hafalan/update`, {
                id_murid: murid.id_murid,
                pencapaian: nilaihafalanMurid.pencapaian,
                kelancaran: nilaihafalanMurid.kelancaran,
                artikulasi: nilaihafalanMurid.artikulasi
            });

            const rata2 =(nilaihafalanMurid.pencapaian+nilaihafalanMurid.kelancaran+nilaihafalanMurid.artikulasi)/3.0
            const responseUpdateNilaiHafalanUtama = await axios.patch(
                `${baseURL}/nilai/update?id=${murid.id_murid}&id_kelas=${idSelectedKelas}&id_mapel=${murid.id_mapel}&isi_nilai=${rata2}`
            );



            await fetchDataNilaiHafalan()


            toast.success(`Nilai Berhasil Disimpan!, untuk ${murid.nama_murid}`, {autoClose: 1100,});




        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            toast.error(`Gagal Menyimpan`, {autoClose: 1100,});

        }


        setHasChanged(prevChanges => ({
            ...prevChanges,
            [murid.id_murid]: false
        }));
    };






    const handleCloseModal = () => {
        setShowModalMuridMapel(false);
    };

    const handleSaveModal = () => {
        handleLoadMapel();
        // Logika setelah menyimpan data
        setShowModalMuridMapel(false);
    };

    const handleTambahMurid = () => {
        setShowTambahModal(true);
    };

    const handleCloseTambahModal = () => {

        setShowTambahModal(false);
    };

    const handleSaveTambahModal = () => {
        handleLoadMapel(); // Refresh data murid
        setShowTambahModal(false);
    };

    const closeModal = () => {
        setShowModalMuridMapel(false);
    };

    return (
        <div><Navbar/>
            <ToastContainer/>

            <div className="overflow-x-auto grid w-screen place-items-center">


                <div className="mt-4">
                    <ButtonGroup onChange={(gender) => setSelectedGender(gender)}/>
                </div>

                <div className="mb-4 mt-1 ">

                    <select
                        className="mt-5 p-2 border border-gray-300 rounded"
                        onChange={(e) => setIdSelectedKelas(e.target.value)}
                        value={idSelectedKelas}
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
                        onClick={handleLoadMapel}>
                        Proses
                    </button>
                </div>

                <div className="p-2 ">
                    <table className="min-w-full divide-y divide-gray-500">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Id Mapel
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Pelajaran
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tktn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-500">
                        {mapelData.map((mapel, index) => (
                            <tr key={mapel.id_mapel} className={`${index % 2 === 0 ? 'bg-white' : 'bg-yellow-100'}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  text-gray-500">
                                    {mapel.id_mapel}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-black">
                                    {mapel.nama_mapel}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {mapel.angkatan.nama_angkatan}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleInputClick(mapel)}
                                        className="text-black hover:text-indigo-900 bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded"
                                    >
                                        Input
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>


                    </table>
                    <button
                        onClick={() => {
                            setshowKehadiranModal(true)
                        }}
                        className=" mt-10  py-2 min-w-full bg-red-600 text-white font-bold rounded uppercase tracking-wider hover:bg-red-900">
                        Laporan Kehadiran
                    </button>

                    <button
                        onClick={handleBuatRekapRapotClick}
                        className=" mt-5 mb-10 py-2 min-w-full bg-indigo-600 text-white font-bold rounded uppercase tracking-wider hover:bg-indigo-400">
                        Buat Rekap Nilai Untuk Rapot
                    </button>
                </div>


                {showModalMuridMapel && (
                    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-50"></div>
                        <div
                            className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                            <div className="modal-content py-4 text-left px-1"
                                 style={{maxHeight: '90vh'}}> {/* Set maximum height */}
                                {/* Modal header, close button, and table */}

                                <div className="modal-content py-4 text-left px-6">
                                    <div className="flex justify-between items-center pb-3">
                                        <p className="text-2xl font-bold">Nilai {selectedMapel.nama_mapel}</p>
                                        <div className="modal-close cursor-pointer z-50" onClick={closeModal}>
                                            <span className="text-4xl font-bold">&times;</span>
                                        </div>
                                    </div>

                                    <table className="min-w-full leading-normal ">
                                        <thead >
                                        <tr className="bg-yellow-300 sticky top-0 z-10">
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Nama Murid
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Nilai
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Simpan
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataMuridDanNilainya.map((student, index) => (
                                            <tr key={student.id_murid} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}>

                                                <td className="px-5 py-5 border-b border-gray-200  font-bold">
                                                    {student.nama_murid}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                                    <input
                                                        type="number"
                                                        defaultValue={student.isi_nilai}
                                                        maxLength="3"
                                                        // style={{maxWidth: '200px'}}
                                                        className="form-input rounded-md border-gray-300  w-14 no-spinners"
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            // Validate using the refined regex
                                                            if (!allowedPattern.test(value)) {
                                                                e.target.value = value.substring(0, 3); // Truncate to 3 digits
                                                                return; // Prevent further processing
                                                            }

                                                            handleScoreChange(student.id_murid, value);
                                                        }}
                                                    />


                                                </td>


                                                <td className="px-5 py-5 border-b border-gray-200  text-sm">
                                                    <button
                                                        onClick={() => handleSave(student)}
                                                        disabled={editedScores[student.id_murid] === undefined || editedScores[student.id_murid] === student.isi_nilai}
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                                    >
                                                        Simpan
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>

                                </div>
                                <div className="modal-footer flex justify-end p-3">
                                    <button
                                        onClick={closeModal}
                                        className="modal-close text-lg font-semibold px-5 py-1 border-2 border-red-700 rounded hover:bg-red-600 hover:text-white "
                                    >
                                        Tutup
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                )}

                {showMuhafadzohModal && (
                    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-50"></div>

                        <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-2" style={{maxHeight: '90vh'}}>
                            <div className="modal-content py-1 text-left px-2">


                                {/* Set maximum height */}
                                {/* Modal header, close button, and table */}

                                <div className="modal-content py-4 text-left">
                                    <div className="flex justify-between items-center pb-3">
                                        <p className="text-2xl font-bold">Nilai Hafalan</p>
                                        <button onClick={() => {

                                            setShowMuhafadzohModal(false)
                                        }}
                                                className="modal-close text-l font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-600 hover:text-white ">

                                            X
                                        </button>
                                    </div>

                                    <div className=" px-1 pt-1 pb-4 sm:p-1 sm:pb-1">
                                        <table className=" divide-y divide-gray-500 ">
                                            <thead >
                                            <tr className="bg-yellow-300 sticky top-0 z-10">
                                                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase">Pencapaian</th>
                                                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase">Kelancaran</th>
                                                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase">Artikulasi</th>
                                                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total&#247;3</th>
                                                <th className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-500 ">
                                            {dataNilaiHafalan.map((murid, index) => (
                                                <tr key={murid.id_murid} className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}`}>
                                                    <td className={`sticky left-0 font-bold border px-2 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} ` }>{murid.nama_murid}</td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            maxLength="3"
                                                            defaultValue={murid.pencapaian}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Validate using the refined regex
                                                                if (!allowedPattern.test(value)) {
                                                                    e.target.value = value.substring(0, 3); // Truncate to 3 digits
                                                                    return; // Prevent further processing
                                                                }

                                                                handleScoreHafalanChange(murid.id_murid, 'pencapaian', value)
                                                            }}
                                                            className="form-input rounded-md border-gray-300  w-14 no-spinners"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            maxLength="3"
                                                            defaultValue={murid.kelancaran}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Validate using the refined regex
                                                                if (!allowedPattern.test(value)) {
                                                                    e.target.value = value.substring(0, 3); // Truncate to 3 digits
                                                                    return; // Prevent further processing
                                                                }

                                                                handleScoreHafalanChange(murid.id_murid, 'kelancaran', value)
                                                            }}

                                                            className="form-input rounded-md border-gray-300  w-14 no-spinners"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            maxLength="3"
                                                            defaultValue={murid.artikulasi}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Validate using the refined regex
                                                                if (!allowedPattern.test(value)) {
                                                                    e.target.value = value.substring(0, 3); // Truncate to 3 digits
                                                                    return; // Prevent further processing
                                                                }

                                                                handleScoreHafalanChange(murid.id_murid, 'artikulasi', value)
                                                            }}

                                                            className="form-input rounded-md border-gray-300  w-14 no-spinners"
                                                        />
                                                    </td>
                                                    <td className="font-bold border px-2 py-2 text-center">
                                                        {((scores[murid.id_murid]?.pencapaian + scores[murid.id_murid]?.kelancaran + scores[murid.id_murid]?.artikulasi) / 3.0).toFixed(1)}
                                                    </td>

                                                    <td className="border p-2 pr-3 text-center">
                                                        <button
                                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                                            onClick={() => handleUpdateNilaiHafalan(murid)}
                                                            disabled={!hasChanged[murid.id_murid]}
                                                        >
                                                            Simpan
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}

                                            </tbody>



                                        </table>


                                    </div>


                                </div>
                                <div className="modal-footer flex justify-end p-3">
                                    <button
                                        onClick={() => {
                                            setShowMuhafadzohModal(false)
                                        }}
                                        className="modal-close text-lg font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-600 hover:text-white "
                                    >
                                        Tutup
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                )}




                {showTabelRapotModal && (
                    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-95">
                            <button onClick={() => {setshowTabelRapotModal(false)}}
                                    className="m-4 modal-close text-white bg-red-600 text-l font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-900 hover:text-white">
                                X
                            </button>

                        </div>
                        <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-2" style={{maxHeight: '90vh'}}>
                            <div className="modal-content text-left ">
                                {/* Modal header, close button, and table */}
                                <div className="modal-content py-1 text-left px-1 pb-6">
                                    <div className="flex justify-between items-center pb-3">
                                        <p className="text-2xl font-bold">Nilai Rapot</p>

                                    </div>

                                    <TabelRapot jsonData={dataRapotJson} dataKehadiran={dataMuridDanKehadiran}></TabelRapot>

                                    {/* Tombol Tutup di bawah Tabel */}

                                        <button
                                            onClick={() => {setshowTabelRapotModal(false)}}
                                            className="mt-4 bg-red-600 text-white text-lg font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-gray-700"
                                        >
                                            Tutup
                                        </button>

                                </div>
                            </div>
                        </div>
                    </div>
                )}



                {showKehadiranModal && (
                    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-50"></div>

                        <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-2" style={{maxHeight: '90vh'}}>
                            <div className="modal-content py-1 text-left px-2">


                            {/* Set maximum height */}
                                {/* Modal header, close button, and table */}

                                <div className="modal-content py-4 text-left">
                                    <div className="flex justify-between items-center pb-3">
                                        <p className="text-2xl font-bold">Rekap Kehadiran</p>
                                        <button onClick={() => {

                                            setshowKehadiranModal(false)
                                        }}
                                                className="modal-close text-l font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-600 hover:text-white ">

                                            X
                                        </button>
                                    </div>

                                    <div className=" px-1 pt-1 pb-4 sm:p-1 sm:pb-1">
                                        <table className=" divide-y divide-gray-500">
                                            <thead >
                                            <tr className="bg-yellow-300 sticky top-0 z-10">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Nama
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase ">
                                                    Alpha
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                    Sakit
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                    Izin
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase ">
                                                    Aksi
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-500 ">
                                            {dataMuridDanKehadiran.map((murid, index) => (
                                                <tr key={murid.id_murid}  className={`${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}`}>
                                                    <td className={`sticky left-0 font-bold border px-2 py-2 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'} ` }>{murid.nama_murid}</td>
                                                    <td className="border px-1 py-2 text-center" >
                                                        <input
                                                            type="number"
                                                            inputMode="numeric"
                                                            defaultValue={murid.kehadiran.alpha}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Validate using the refined regex
                                                                if (!allowedPattern.test(value)) {
                                                                    e.target.value = value.substring(0, 3); // Truncate to 3 digits
                                                                    return; // Prevent further processing
                                                                }

                                                                handleEditKehadiran(murid.id_murid, 'alpha', value)
                                                            }}

                                                            className="form-input rounded-md border-gray-300  w-14 no-spinners"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            inputMode="numeric"
                                                            defaultValue={murid.kehadiran.sakit}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Validate using the refined regex
                                                                if (!allowedPattern.test(value)) {
                                                                    e.target.value = value.substring(0, 3); // Truncate to 3 digits
                                                                    return; // Prevent further processing
                                                                }

                                                                handleEditKehadiran(murid.id_murid, 'sakit', value)
                                                            }}

                                                            className="form-input rounded-md border-gray-300  w-14 no-spinners"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            inputMode="numeric"
                                                            defaultValue={murid.kehadiran.izin}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Validate using the refined regex
                                                                if (!allowedPattern.test(value)) {
                                                                    e.target.value = value.substring(0, 3); // Truncate to 3 digits
                                                                    return; // Prevent further processing
                                                                }

                                                                handleEditKehadiran(murid.id_murid, 'izin', value)
                                                            }}
                                                            className="form-input rounded-md border-gray-300 w-14 no-spinners"
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2 text-center">
                                                        <button
                                                            onClick={() => handleSaveDataKehadiran(murid)}
                                                            disabled={!isChanged(murid.id_murid)}
                                                            className={`px-4 py-2 bg-green-500 text-black rounded hover:bg-yellow-200 ${!isChanged(murid.id_murid) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            Simpan
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}

                                            </tbody>



                                        </table>


                                    </div>


                                </div>
                                <div className="modal-footer flex justify-end p-3">
                                    <button
                                        onClick={() => {
                                            setshowKehadiranModal(false)
                                        }}
                                        className="modal-close text-lg font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-600 hover:text-white "
                                    >
                                        Tutup
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                )}



            </div>
        </div>
    );


};

function isAuthorized(admin,selectedIdKelas) {

    // Jika admin adalah super_admin, abaikan perbandingan dan kembalikan true
    if (admin.super_admin) {
        return true;
    }

    return admin.id_kelas === parseInt(selectedIdKelas);
}
function isSuperAdmin(admin) {

    return admin.super_admin
}



export default RekapNilai;


//DataMurid