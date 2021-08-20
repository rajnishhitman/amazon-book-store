import "../CSS_Files/UserProfile.css";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from "react";

const UserProfile = (props) => {
    let [user, setUser] = useState({})
    const history = useHistory();
    let localStoreUser = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        axios.get(`/user/getuser/${localStoreUser._id}`)
        .then(res => {
            setUser(res.data.message)
        })
    },[localStoreUser._id])

    const goToEditUser = () => {
        // console.log("edit user with id", userid)
        history.push(`/edituser/${localStoreUser._id}`)
    }

    const deleteUser = () => {
        //delete req
        axios.delete(`/user/deleteuser/${localStoreUser._id}`)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            history.push("/login")
            props.logOutUser()
            // localStorage.clear();

        })

        .catch(err=>{
            console.log(err);
            alert("something went wrong")
        })
    }

    return (
        <div className="container bcontent d-flex flex-row justify-content-center">
            <div className="card profile-card">
                <div className="row no-gutters">
                    <div className="col-sm-5">
                        <img className="card-img" src={user.profileImage} alt="" />
                    </div>
                    <div className="col-sm-7">
                        <div className="card-body">
                            <h5 className="card-title">Username - {user.username}</h5>
                            <p className="card-text">Email - {user.email}</p>
                            <p className="card-text">dob - {user.dob}</p>
                            <button onClick={goToEditUser} className="btn btn-sm btn-warning float-start">Edit</button>
                            <button onClick = {() => deleteUser()} className="btn btn-sm btn-warning ms-3">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile;
