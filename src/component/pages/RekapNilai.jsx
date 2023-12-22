import Navbar from "../Navbar.jsx";
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ButtonGroup from "./data_murid/ButtonGroup.jsx";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabelRapot from "./rekap_nilai/TabelRapot.jsx";

//RekapNilai
const RekapNilai = () => {

    // unutuk data mapel
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


    const fetchDataKehadiran = async () => {
        try {

            const responseKehadiranDataMurid = await axios.get(
                `http://192.168.0.3:5000/murid/kehadiran/perkelas/${idSelectedKelas}`)


            setdataMuridDanKehadiran(responseKehadiranDataMurid.data);

            // Initialize kehadiranAsli with the fetched data
            const fetchedKehadiran = {}; // Create a new object to hold the current values
            responseKehadiranDataMurid.data.forEach((murid) => {
                fetchedKehadiran[murid.id_murid] = murid.kehadiran;
            });

            setKehadiran(fetchedKehadiran);
            setKehadiranAsli(fetchedKehadiran);

            // console.log(responseKehadiranDataMurid);
            // console.log(kelasValue);

        } catch (error) {
            console.log("There was an error: " + error.message);
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
        // console.log(murid.nama_murid, kehadiran[murid.id_murid] || murid.kehadiran);


        const updatedKehadiran = kehadiran[murid.id_murid] || murid.kehadiran;

        try {

            const response = await axios.patch(`http://192.168.0.3:5000/murid/kehadiran/${murid.id_murid}`, {
                alpha: updatedKehadiran.alpha,
                izin: updatedKehadiran.izin,
                sakit: updatedKehadiran.sakit
            });

            console.log('Response:',  response.data);
            //setIsiToast(`${murid.nama_murid} Alpha: ${response.data.alpha}  Sakit: ${response.data.sakit} Izin: ${response.data.izin}`)


        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }

        setKehadiranAsli(prev => ({
            ...prev,
            [murid.id_murid]: { ...updatedKehadiran }
        }));
        //setShowToast(true)

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
            const response = await axios.get('http://192.168.0.3:5000/kelas/data');
            setKelasData(response.data);
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data:', error);
        }
    };

    const handleLoadMapel = async () => {
        // console.log()
        if (idSelectedKelas) {


            try {
                const response = await axios.get(
                    `http://192.168.0.3:5000/kelas/mapel/all/${idSelectedKelas}`
                );

                const muhafadzohMapel = response.data.find(mapel => mapel.nama_mapel === "Muhafadzoh");
                // await fetchDataNilaiHafalan(muhafadzohMapel)
                console.log(muhafadzohMapel)

                // Check if the response data is empty
                if (response.data && response.data.length === 0) {
                    console.log("Received empty data array");
                    setMapelData([]);

                    // Clear mapelData if data is empty
                    // Handle the empty data scenario appropriately here
                } else {
                    console.log(response.data)
                    setMapelData(response.data); // Set data as usual if not empty
                }


            } catch (error) {
                console.log("Caught an error: ", error);
                // Handle other errors
            }


        }
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            setAdminData(user);
        }
        fetchDataKelas();
    }, []);

    const fetchDataNilaiMuridPerMapel = async (mapel) => {
        const mapelId = mapel?.id_mapel || selectedMapel.id_mapel;
        if (mapelId && idSelectedKelas) {
            try {
                const responseDataMurid = await axios.get(
                    `http://192.168.0.3:5000/nilai/rekap?id_kelas=${idSelectedKelas}&id_mapel=${mapelId}`
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
                    `http://192.168.0.3:5000/nilai/hafalan?id_kelas=${idSelectedKelas}`
                );

                const response= await axios.get(
                    `http://192.168.0.3:5000/nilai/rekap?id_kelas=${idSelectedKelas}&id_mapel=${mapelId}`
                );

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
                // console.log(dataMuridDanNilainya)

            } catch (error) {
                setDataNilaiHafalan([]);

                console.log("There was an error: " + error.message);
            }
        }
    };


    useEffect(() => {

        fetchDataNilaiMuridPerMapel();





        // console.log(dataMuridDanNilainya)
    }, [selectedMapel]);


    const handleScoreChange = (id, newScore) => {
        setEditedScores({...editedScores, [id]: newScore});
    };

    const handleSave = async (student) => {
        const originalScore = student.isi_nilai;
        const updatedScore = editedScores[student.id_murid] || student.isi_nilai;

        try {
            const responseDataMurid = await axios.patch(
                `http://192.168.0.3:5000/nilai/update?id=${student.id_murid}&id_kelas=${idSelectedKelas}&id_mapel=${student.id_mapel}&isi_nilai=${updatedScore}`
            );
            // Handle the response as needed
            // console.log(responseDataMurid.data);
            fetchDataNilaiMuridPerMapel();
            const newEditedScores = {...editedScores};
            delete newEditedScores[student.id_murid];
            setEditedScores(newEditedScores);


            // Show success toast with both values
            toast(`Nilai berubah dari ${originalScore} -> ${updatedScore}, berhasil disimpan! ${student.nama_murid}, ${selectedMapel.nama_mapel}`, {
                position: "top-center",
                autoClose: 1100,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Error updating data:', error);
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
            console.log("Muhafadzoh dikliiiik")

        } else {

            setShowModalMuridMapel(true)
        }

    };


    const handleBuatRekapRapotClick = async () => {
        try {


            const response = await axios.get(
                `http://192.168.0.3:5000/murid/rapot/${idSelectedKelas}`
            );
            // Set the response text to state
            // setResponseText(JSON.stringify(response.data, null, 2));
            setdataRapotJson(response.data);
            console.log(response.data)

        } catch (error) {
            // Set error message to state
            console.log("There was an error: " + error.message);
        }

        setshowTabelRapotModal(true)


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
    const handleTotalHafalan = async (murid) => {
        //{((scores[murid.id_murid]?.pencapaian + scores[murid.id_murid]?.kelancaran + scores[murid.id_murid]?.artikulasi) / 3.0).toFixed(1)}
        // console.log(scores[murid.id_murid].artikulasi)
        try {

            const response = await axios.patch(`http://192.168.0.3:5000/nilai/hafalan/update`, {
                id_murid: murid.id_murid,
                pencapaian: scores[murid.id_murid].pencapaian,
                kelancaran:  scores[murid.id_murid].kelancaran,
                artikulasi:  scores[murid.id_murid].artikulasi
            });

            await fetchDataNilaiHafalan()

            console.log('Response:', response.data);
            //setIsiToast(`${murid.nama_murid} Alpha: ${response.data.alpha}  Sakit: ${response.data.sakit} Izin: ${response.data.izin}`)


        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
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
        // console.log(idSelectedKelas)
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
            <div className="overflow-x-auto grid w-screen place-items-center">
                <ToastContainer/>


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
                                    {mapel.Angkatan.nama_angkatan}
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

                                    <table className="min-w-full leading-normal">
                                        <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Nama Murid
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Nilai
                                            </th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Simpan
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dataMuridDanNilainya.map((student, index) => (
                                            <tr key={student.id_murid}
                                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-500'}`}>

                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {student.nama_murid}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <input
                                                        type="number"
                                                        defaultValue={student.isi_nilai}
                                                        maxLength="3"
                                                        style={{maxWidth: '200px'}}
                                                        className="form-input mt-1 block w-full sm:w-16"
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            // Allow only up to 3 digits, optionally signed
                                                            if (value.length > 3) {
                                                                e.target.value = value.substring(0, 3);
                                                            }

                                                            handleScoreChange(student.id_murid, value);
                                                        }}
                                                    />


                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
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
                                        <table className=" divide-y divide-gray-500">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                                <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase">Pencapaian</th>
                                                <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase">Kelancaran</th>
                                                <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase">Artikulasi</th>
                                                <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase">Total&#247;3</th>
                                                <th className="px-1 py-1 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-500 ">
                                            {dataNilaiHafalan.map((murid, index) => (
                                                <tr key={murid.id_murid}>
                                                    <td className="font-bold border px-2 py-2">{murid.nama_murid}</td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            maxLength="3"
                                                            defaultValue={murid.pencapaian}
                                                            onChange={(e) => handleScoreHafalanChange(murid.id_murid, 'pencapaian', e.target.value)}
                                                            className="form-input rounded-md border-gray-300  w-14"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            maxLength="3"
                                                            defaultValue={murid.kelancaran}
                                                            onChange={(e) => handleScoreHafalanChange(murid.id_murid, 'kelancaran', e.target.value)}
                                                            className="form-input rounded-md border-gray-300  w-14"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            maxLength="3"
                                                            defaultValue={murid.artikulasi}
                                                            onChange={(e) => handleScoreHafalanChange(murid.id_murid, 'artikulasi', e.target.value)}
                                                            className="form-input rounded-md border-gray-300  w-14"
                                                        />
                                                    </td>
                                                    <td className="font-bold border px-2 py-2 text-center">
                                                        {((scores[murid.id_murid]?.pencapaian + scores[murid.id_murid]?.kelancaran + scores[murid.id_murid]?.artikulasi) / 3.0).toFixed(1)}
                                                    </td>

                                                    <td className="border p-2 pr-3 text-center">
                                                        <button
                                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                                            onClick={() => handleTotalHafalan(murid)}
                                                            disabled={!hasChanged[murid.id_murid]}
                                                        >
                                                            Show
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
                        <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-50"></div>

                        <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-2" style={{maxHeight: '90vh'}}>
                            <div className="modal-content text-left ">

                                {/* Modal header, close button, and table */}

                                <div className="modal-content py-1 text-left px-1">
                                    <div className="flex justify-between items-center pb-3">
                                        <p className="text-2xl font-bold">Nilai Rapot</p>
                                        <button onClick={() => {

                                            setshowTabelRapotModal(false)
                                        }}
                                                className="modal-close text-l font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-600 hover:text-white ">

                                            X
                                        </button>
                                    </div>


                                    <TabelRapot jsonData={dataRapotJson} dataKehadiran={dataMuridDanKehadiran}></TabelRapot>

                                </div>
                                <div className="modal-footer flex justify-end p-3">
                                    <button
                                        onClick={() => {
                                        setshowTabelRapotModal(false)
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

                {showKehadiranModal && (
                    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                        <div className="modal-overlay absolute w-full h-full bg-gray-500 opacity-50"></div>

                        <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-2" style={{maxHeight: '90vh'}}>
                            <div className="modal-content py-1 text-left px-2">


                            {/* Set maximum height */}
                                {/* Modal header, close button, and table */}

                                <div className="modal-content py-4 text-left">
                                    <div className="flex justify-between items-center pb-3">
                                        <p className="text-2xl font-bold">Nilai Rapot</p>
                                        <button onClick={() => {

                                            setshowKehadiranModal(false)
                                        }}
                                                className="modal-close text-l font-semibold px-5 py-1 border-2 border-red-600 rounded hover:bg-red-600 hover:text-white ">

                                            X
                                        </button>
                                    </div>

                                    <div className=" px-1 pt-1 pb-4 sm:p-1 sm:pb-1">
                                        <table className=" divide-y divide-gray-500">
                                            <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Nama
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
                                                    Alpha
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Sakit
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Izin
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ">
                                                    Aksi
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-500 ">
                                            {dataMuridDanKehadiran.map((murid) => (
                                                <tr key={murid.id_murid}>
                                                    <td className="border px-2 py-2">{murid.nama_murid}</td>
                                                    <td className="border px-1 py-2 text-center" >
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            defaultValue={murid.kehadiran.alpha}
                                                            onChange={(e) =>
                                                                handleEditKehadiran(
                                                                    murid.id_murid,
                                                                    "alpha",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="form-input rounded-md border-gray-300  w-14"
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            defaultValue={murid.kehadiran.sakit}
                                                            onChange={(e) =>
                                                                handleEditKehadiran(
                                                                    murid.id_murid,
                                                                    "sakit",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="form-input rounded-md border-gray-300  w-14 "
                                                        />
                                                    </td>
                                                    <td className="border px-1 py-2 text-center">
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            defaultValue={murid.kehadiran.izin}
                                                            onChange={(e) =>
                                                                handleEditKehadiran(
                                                                    murid.id_murid,
                                                                    "izin",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="form-input rounded-md border-gray-300 w-14"
                                                        />
                                                    </td>
                                                    <td className="border px-4 py-2 text-center">
                                                        <button
                                                            onClick={() => handleSaveDataKehadiran(murid)}
                                                            disabled={!isChanged(murid.id_murid)}
                                                            className={`px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-200 ${!isChanged(murid.id_murid) ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default RekapNilai;


//DataMurid