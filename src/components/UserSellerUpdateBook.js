import axios from "axios";
import React from 'react'
// import {useState} from "react";
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const UserSellerUpdateBook = () => {

    const {register, handleSubmit, formState: { errors }} = useForm();
    // const [file, setFile] = useState('')
    const history = useHistory();
    let paramObj = useParams();


    const onFormSubmit = (bookObj) =>{
        //create FormData obj
        // let formData = new FormData();
        //add file(s) to formdata obj
        // formData.append('photo', file, file.name)

        // formData.append("bookObj",JSON.stringify(bookObj))
        // console.log(formData)
        // console.log(bookObj)




        //put req
        axios.put(`/books/updatebook/${paramObj.bookid}`, {book: bookObj})
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            history.push('/sellermanagebooks')
        })

        .catch(err=>{
            console.log(err);
            alert("something went wrong")
        })
    }

    //to get selected
    // const onFileSelect=(e)=>{
    //     setFile(e.target.files[0])
    // }

    return (
        <div className="d-flex flex-row justify-content-center">
            <div className="row border border-secondary mt-5">
                <div className="col-md">
                    <form onSubmit={handleSubmit(onFormSubmit)}>
                        <div className="mb-2 mt-3">
                            <label for="bookName" className="form-label">BookName</label>
                            <input type="text" className="form-control" id="bookName" name="bookName"  {...register("bookName", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookName && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="bookAuthor" className="form-label">BookAuthor</label>
                            <input type="text" className="form-control" id="bookAuthor" name="bookAuthor" {...register("bookAuthor", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookAuthor && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="bookPrice" className="form-label">BookPrice</label>
                            <input type="number" className="form-control" id="bookPrice" name="bookPrice" {...register("bookPrice", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookPrice && "This field is required"}</small>
                        </div>

                        {/* <div className="mb-2">
                            <label for="bookImage" className="form-label">BookImage</label>
                            <input type="file" className="form-control" id="bookImage" name="photo" onChange={(e) => {onFileSelect(e) }}/>
                        </div> */}

                        

                        <button className="btn btn-warning mb-2">Update</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserSellerUpdateBook;
