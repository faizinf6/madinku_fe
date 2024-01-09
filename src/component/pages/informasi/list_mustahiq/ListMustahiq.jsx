
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../../Navbar.jsx";
import baseURL from "../../../../config.js";

export const ListMustahiq = () => {
    const [dataAdmin, setDataAdmin] = useState([]);
    const [dataKelas, setDataKelas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseAdmin = await axios.get(`${baseURL}/admin/all`);
                const responseKelas = await axios.get(`${baseURL}/kelas/data`);
                setDataAdmin(responseAdmin.data);
                setDataKelas(responseKelas.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    const isValidPhoneNumber = (phoneNumber) => {
        // Convert phoneNumber to a string if it's not already
        const phoneNumberStr = phoneNumber.toString();

        return phoneNumberStr.startsWith('628');
    };

    return (
        <div>
            <Navbar/>

        <div className=" container overflow-x-auto grid w-screen place-items-center p-4">

            <table className=" divide-y divide-gray-500">
                <thead>
                <tr className="bg-cyan-300">
                    <th className="px-1.5 py-2 text-xxs whitespace-nowrap">id Kelas</th>
                    <th className="px-4 py-2">Nama Kelas</th>
                    {/*<th className="px-4 py-2">Gender</th>*/}
                    <th className="px-4 py-2">Mustahiq</th>
                    <th className="px-4 py-2">Aksi</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-500 ">
                {dataKelas.map(kelas => {
                    const admin = dataAdmin.find(admin => admin.id_kelas === kelas.id_kelas);
                    return (
                        <tr key={kelas.id_kelas}>
                            <td className="px-4 py-2 text-xs">{kelas.id_kelas}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-black">{kelas.nama_kelas}</td>
                            {/*<td className="px-4 py-2 text-xs">{kelas.gender}</td>*/}
                            <td className="px-4 py-2 whitespace-nowrap">{admin ? admin.nama_admin : 'No Admin'}</td>
                            <td>
                                {admin && admin.no_hp && isValidPhoneNumber(admin.no_hp) ? (
                                    <a href={`https://wa.me/${admin.no_hp}`} target="_blank" rel="noopener noreferrer"
                                       className=" bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded">
                                        Wa
                                    </a>
                                ) : (
                                    <p className="bg-gray-200 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"> X </p>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

        </div>

    );



}