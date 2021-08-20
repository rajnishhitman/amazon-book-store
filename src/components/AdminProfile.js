import React from 'react'
import { useParams } from 'react-router-dom';

const AdminProfile = () => {
    let paramObj = useParams();
    return (
        <div>
            <h1>Hello I am {paramObj.username}</h1>
        </div>
    )
}

export default AdminProfile
