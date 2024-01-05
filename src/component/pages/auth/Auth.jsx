import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const Auth = () => {
    const [nama, setNama] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [no_hp, setno_hp] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://192.168.0.3:5000/auth', {
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
            setErrorMessage('Terjadi kesalahan pada server');
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
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Silahkan masuk menggunakan Akun Anda.
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Nomor Hape
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
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
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
                            // ref="http://192.168.0.3:3000/"
                            onClick={handleLogin}

                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Masuk
                        </button
                            >
                        {errorMessage && <div className="text-sm text-red-500">{errorMessage}</div>}
                    </div>
                </form>

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