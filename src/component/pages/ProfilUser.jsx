import Navbar from "../Navbar.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

export const ProfilUser = () => {
    const [admin, setAdmin] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');



    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user)
        if (user) {
            setAdmin(user);
        }
    }, []);
    const handleChange = (e) => {
        setAdmin({...admin, [e.target.name]: e.target.value});
    };

    const handleSave = async () => {
        // Check if both password fields are filled
        if (admin.password && confirmPassword) {
            // Perform the password match check
            if (admin.password !== confirmPassword) {
                toast.error("Kata sandi tidak cocok!", {
                    position: "top-center",
                    autoClose: 5100,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return; // Stop the function execution if passwords don't match
            }
        }

        setIsSaving(true);
        try {
            // First, update the admin data
            const updateResponse = await axios.patch('http://192.168.0.3:5000/admin/update', admin);
            if (updateResponse.data) {
                // Update successful, now update local storage
                localStorage.setItem('user', JSON.stringify({...admin, password: undefined}));

                toast(`Data Berhasil diperbarui!, silahkan keluar lalu Login ulang untuk data terbaru `, {
                    position: "top-center",
                    autoClose: 3100,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                // Handle case where updateResponse.data is not as expected
                setErrorMessage('Terjadi kesalahan saat memperbarui data');
            }
        } catch (error) {
            // Handle error from the update request
            setErrorMessage('Terjadi kesalahan pada server');
        }
        setIsSaving(false);
    };


    return (
        <div>
            <Navbar/>
            <ToastContainer/>

        <div className="container mx-auto p-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">ID Admin*</label>
                <span className="block w-full bg-gray-100 p-2 rounded">{admin.id_admin}</span>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nama Admin*</label>

                <span className="block w-full bg-gray-100 p-2 rounded">{admin.nama_admin}</span>

            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">ID Kelas*</label>
                <span className="block w-full bg-gray-100 p-2 rounded">{admin.id_kelas}</span>
            </div>
            <label className="block text-gray-700 text-xs italic mb-2">*hanya bisa diubah oleh pengurus</label>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Nomer Hape</label>
                <input
                    type="number"
                    value={admin.no_hp}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Katasandi Baru:</label>
                <input
                    type="password"
                    name="password"
                    value={admin.password}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Ketik Ulang Katasandi Baru:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                {admin.password !== confirmPassword && confirmPassword && (
                    <p className="text-red-400">Kata sandi tidak cocok</p>
                )}
            </div>



            <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
        </div>
        </div>
    );
}

