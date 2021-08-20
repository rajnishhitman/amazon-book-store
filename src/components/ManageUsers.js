import {useEffect, useState} from 'react'
// import { useHistory } from 'react-router-dom';
const axios = require('axios');

const ManageUsers = () => {
    // const history = useHistory();
    let [users, setUsers] = useState([])
    let [refresh, setRefresh] = useState(0)

    useEffect(()=>{
        fetch("/user/getusers")
        .then(response => response.json())
        .then(json => {
            const arObj = json.message
            setUsers(arObj)
        })
    },[refresh])

    // const goToEditUser = (userid) => {
    //     // console.log("edit user with id", userid)
    //     history.push(`/edituser/${userid}`)

    // }
    const deleteUser = (userid) => {
        //delete req
        axios.delete(`/user/deleteuser/${userid}`)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            //navigate to manageusers component
            setRefresh(refresh + 1)
        })

        .catch(err=>{
            console.log(err);
            alert("something went wrong")
        })
    }


    return (
        <div className="container mt-5">
        {
        users.length!==0 ?

        users !== "No Users" ?
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Manage</th>
                </tr>
            </thead>

            <tbody>
            {
            users.map((user)=>{
                return(
                    <tr>
                        <td><img src={user.profileImage} width="60" className="" alt=""/></td>
                        <td>{user.username}</td>
                        <td>{user.type}</td>
                        {/* <td> <div><span onClick = {() => goToEditUser(user._id)} className="btn btn-sm btn-warning" >Edit</span> <span onClick = {() => deleteUser(user._id)} className="btn btn-sm btn-warning">Delete</span></div> </td> */}
                        <td> <div><span onClick = {() => deleteUser(user._id)} className="btn btn-sm btn-warning">Remove</span></div> </td>
                    </tr>
                )
            })
            }
            {/* <tr>
                <td></td>
                <td></td>
                <th>Total Price</th>
                <td> {price}/- </td>
                <td> <button className="btn btn-sm btn-warning" >Place Order</button> </td>
            </tr> */}
                
            </tbody>
        </table>
        :
        <h1 className="text-center text-dark mt-5">No User</h1>
        :
        <p className="text-center text-dark mt-5">Loading...</p>
        }
        </div>
    )
}

export default ManageUsers
