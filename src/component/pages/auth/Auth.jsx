import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import logo from "../../../logo_ppds.png";
import baseURL from "../../../config.js";
import warn01Image from './warn01.jpg';
import warn02Image from './warn02.jpg';


export const Auth = () => {
    const [nama, setNama] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [no_hp, setno_hp] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('login');

    //modal state for the first time login
    const [modalPertamx, setModalPertamax] = useState(false);


    const navigate = useNavigate();
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${baseURL}/auth`, {
                no_hp: no_hp,
                password: password
            });

            if (response.data.status_login) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/beranda');
                // Arahkan ke beranda jika autentikasi berhasil
            } else {
                setErrorMessage('no_hp/Password Salah'); // Tampilkan pesan kesalahan
            }
        } catch (error) {
            setErrorMessage('Terjadi kesalahan pada server, laporkan ke pengurus');
            setModalPertamax(true)

        }




    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            console.log("Sudah Login baang")

            navigate('/beranda');
            // Lakukan tindakan selanjutnya, misal mengatur state user
        }
    }, []);
    const handleSignup = async () => {
        try {
            await axios.post('http://192.168.0.3:3000/register', { nama, no_hp, password });
            // ... Logika setelah signup berhasil
        } catch (error) {
            alert(error.response.data.message);
        }
    };





    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-24 w-auto"
                    src= {logo}
                    alt="Madinku"
                />
                <h1 className="mt-1 text-center text-2xl font-bold  tracking-tight text-gray-900">
                    MADINKU PPDS
                </h1>

                <h2 className="mt-10 text-center text-l font-bold text-gray-900">
                    Silahkan masuk menggunakan Akun Anda.
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Nomor Hape (format: 628xxx)
                        </label>
                        <div className="mt-2">
                            <input
                                id="no_hp"
                                type="number"
                                required
                                value={no_hp}
                                onChange={(e) => setno_hp(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href={`https://wa.me/6285788778671`} target="_blank" rel="noopener noreferrer" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">

                                    Lupa Password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>

                        <button
                            onClick={handleLogin}
                            className=" w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Masuk
                        </button>



                        {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}
                    </div>
                </form>

                <button
                    onClick={() => {setModalPertamax(true)}}
                    className=" mt-4 w-full justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-500 shadow-sm hover:bg-indigo-500 hover:text-white border border-indigo-500 ">Saya baru Pertama Kali Login
                </button>


                {modalPertamx && (
                    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">

                        <div className="modal-container bg-white w-fit mx-1 rounded shadow-lg z-50 overflow-y-auto p-1" style={{maxHeight: '90vh'}}>
                            <div className="modal-content text-left ">
                                <div className="modal-content py-1 text-left px-1 pb-6">
                                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 items-center mb-4">
                                        <p className="text-sm font-semibold text-yellow-800">Anda Terdeteksi baru pertama kali login.</p>
                                        <p className="text-xl font-bold text-green-700 mt-2">Anda Akan diarahkan ke halaman lain, dan akan muncul PERINGATAN. Tekan tombol "Lanjutan/Advanced".</p>
                                        <img src={warn01Image} alt="Warning Image" className="w-fit mb-4" />
                                        <p className="text-xl font-bold text-green-700 mt-2">lalu tekan "Tidak Aman/Terima Resiko".</p>
                                        <img src={warn02Image} alt="Warning Image" className="w-auto" />
                                        <p className="text-l font-semibold mt-2">Lalu tutup tab tersebut dan kembali kunjungi serta login Madinku melalui mdn.darussaadah.net</p>

                                    </div>


                                </div>

                                <button
                                    onClick={() => {setModalPertamax(false);}}
                                    className="mt-1  bg-red-600 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                                >
                                    Batal
                                </button>

                                <button
                                    onClick={() => {
                                        setModalPertamax(false)
                                        window.open(`${baseURL}/murid`, '_blank');

                                    }}
                                    className="ml-6 mb-2 bg-teal-700 text-white text-lg font-semibold px-5 py-1.5  rounded hover:bg-gray-700"
                                >
                                    Ya, Saya Mengerti
                                </button>

                            </div>

                        </div>


                    </div>
                )}




                <p className="mt-10 text-center text-sm text-gray-500">
                    Belum punya Akun Madinku?{' '}
                        <a href={`https://wa.me/6285788778671`} target="_blank" rel="noopener noreferrer" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">

                        Segera hubungi Pengurus Madin
                    </a>
                </p>
            </div>
        </div>
    )
}