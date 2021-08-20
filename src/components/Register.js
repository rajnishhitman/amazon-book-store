import {useState} from "react";
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
const axios = require('axios');

const Register = () => {
    const {register, handleSubmit, formState: { errors } } = useForm();
    const [file, setFile] = useState('')
    const history = useHistory();

    const onFormSubmit = (userObj) => {
        //create FormData obj
        let formData = new FormData();
        //add file(s) to formdata obj
        formData.append('photo', file, file.name)
        //add userObj to formData object
        //Convert a JavaScript object into a string with JSON.stringify()
        formData.append("userObj",JSON.stringify(userObj))
        // alert(`${userObj.username} is registered`)
        // history.push("/login")

        //post req
        axios.post("/user/createuser", formData)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            if(localStorage.getItem("username") === "admin"){
                //navigate to home component
                history.push('/')
            }
            else{
                //navigate to login component
                history.push('/login')
            }
            // console.log(formData.getAll("userObj"))
            // console.log(formData.getAll("photo"))
        })
        //     data => alert(data.message)
        // )
        .catch(err=>{
            console.log(err);
            alert("something went wrong")
        })

    }


    //to get selected
    const onFileSelect=(e)=>{
        setFile(e.target.files[0])
    }
    return (
        <div className="d-flex flex-row justify-content-center">
            <div className="row border border-secondary mt-5">
                <div className="col-md">
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="mb-2 mt-3">
                            <label for="exampleInputUsername1" className="form-label">Username</label>
                            <input type="text" className="form-control" id="exampleInputUsername1" name="username"  {...register("username", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.username && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="exampleInputEmail1" className="form-label">Email</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" name="email" {...register("email", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.email && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" name="password" {...register("password", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.password && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="exampleInputDOB1" className="form-label">Date of birth</label>
                            <input type="date" className="form-control" id="exampleInputDOB1" name="dob" {...register("dob", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.dob && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="exampleInputProPic1" className="form-label">Profile Picture</label>
                            <input type="file" className="form-control" id="exampleInputProPic1" name="photo" onChange={(e) => {onFileSelect(e)}}/>
                            <small className="form-text text-danger">{errors.email && "This field is required"}</small>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="radio" id="buyer" {...register("type", {required:true})} value="BUYER" />
                            <label className="form-check-label" for="buyer">
                                Buyer
                            </label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="radio" id="seller" {...register("type", {required:true})} value="SELLER" />
                            <label className="form-check-label" for="seller">
                                Seller
                            </label>
                        </div>


                        <button className="btn btn-warning mb-2">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
