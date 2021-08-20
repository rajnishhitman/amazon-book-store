import "../CSS_Files/Login.css";
import {Link} from 'react-router-dom';
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';

const Login = (props) => {

    const {register, handleSubmit, formState: { errors } } = useForm();
    const history = useHistory();
    // let userType = JSON.parse(localStorage.getItem("user")).type


    const onFormSubmit = (credentials) =>{


        axios.post(`/${credentials.type}/login`, credentials)
            .then(res => {
                let resObj = res.data;
                if(resObj.message === 'login-success'){
                    alert("Login Successful")
                    //save token in local storage
                    localStorage.setItem("token", resObj.token)
                    localStorage.setItem("username", resObj.username)

                    //json.stringify will convert js object into json
                    localStorage.setItem("user", JSON.stringify(resObj.userObj))

                    props.setUserLoginStatus(true)

                    // if(JSON.parse(localStorage.getItem("user")).type === "seller"){
                    //     history.push("/selleraccount")
                    // }
                    // else{
                        history.push("/")
                    // }

                }
                else{
                    alert(resObj.message)
                }
            })
            .catch(err => {
                console.log(err)
                alert("something went wrong in login")
            })
    }


    return (
        <div className="d-flex flex-row justify-content-center">
            <div className="row border border-secondary mt-5">
                <div className="col-md">
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="mb-2 mt-3">
                            <label for="exampleInputUsername1" className="form-label">Username</label>
                            <input type="text" className="form-control" id="exampleInputUsername1" name="username"  {...register("username", {required:true, minLength: 4}) } autoComplete="off"/>
                            <small className="form-text text-danger">{errors.username && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" name="password" {...register("password", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.password && "This field is required"}</small>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="admin" {...register("type", {required:true})} value="admin" />
                            <label className="form-check-label" for="admin">
                                Admin
                            </label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="radio" id="user" {...register("type", {required:true})} value="user" />
                            <label className="form-check-label" for="user">
                                User
                            </label>
                        </div>

                        <button className="btn btn-warning mb-2">Login</button>
                    </form>
                    <p className="login-register">Didn't have an account? <Link to="/register">RegisterNow</Link> </p>
                </div>
            </div>
        </div>
    )
}

export default Login
