import {useEffect, useState} from "react";
import axios from "axios";
import baseURL from "../../../config.js";

const TambahMuridModal = ({ kelasTerpilih,kelasdata, onClose, onSave }) => {
    const [namaMurid, setNamaMurid] = useState('');
    const [idKelasMurid, setIdKelasMurid] = useState(kelasTerpilih);
    const [muridTerakhir, setMuridTerakhir] = useState(0);
    const kelasDitemukan = kelasdata.find(kelas => kelas.id_kelas === parseInt(kelasTerpilih));
    useEffect(() => {
        idMuridTerakhir()

    }, []);
    const idMuridTerakhir = async ()=>{
        try {
            const res = await axios.get(`${baseURL}/murid/terakhirsopo`)
        setMuridTerakhir(res.data)
        }catch (e) {

        }
    }


    const handleSubmit = async () => {
        try {
            await axios.post(`${baseURL}/murid/tambah/`, {
                id_murid:muridTerakhir+1,
                nama_murid: namaMurid,
                id_kelas: idKelasMurid,
                isBoyong:false
            });






            onSave();
        } catch (error) {
            console.error('Terjadi kesalahan saat mengirim data:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
                <label className="block">Nama Murid</label>
                <input
                    type="text"
                    value={namaMurid}
                    onChange={(e) => setNamaMurid(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full mb-4"
                    autoFocus
                />

                <label className="block mb-3">Tambah ke {kelasDitemukan.nama_kelas} </label>


                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded w-full"
                >
                    Simpan
                </button>

                <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded w-full"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default TambahMuridModal;
