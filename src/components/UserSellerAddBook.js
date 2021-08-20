import axios from "axios";
import {useState} from "react";
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
// import { useParams } from 'react-router-dom';

const UserSellerAddBook = () => {

    const {register, handleSubmit, formState: { errors }} = useForm();
    const [file, setFile] = useState('')
    const history = useHistory();
    // let paramObj = useParams();
    let userid = JSON.parse(localStorage.getItem("user"))._id
    // console.log(userid)


    const onFormSubmit = (bookObj) =>{
        //create FormData obj
        let formData = new FormData();
        //add file(s) to formdata obj
        formData.append('photo', file, file.name)
        //add userObj to formData object
        formData.append("bookObj",JSON.stringify(bookObj))
        



        //post req
        axios.post(`/books/addbook/${userid}`, formData)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            //navigate to productslist component
            history.push('/sellermanagebooks')
        })

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
                            <label for="bookCategory" className="form-label">BookCategory</label>
                            <select class="form-select" aria-label=".form-select-lg example" id="bookCategory" name="bookCategory" {...register("bookCategory", {required:true})}>
                                <option selected value="HTML CSS RWD">HTML CSS RWD</option>
                                <option value="JAVASCRIPT">JAVASCRIPT</option>
                                <option value="REACT">REACT</option>
                                <option value="NODEJS">NODEJS</option>
                                <option value="MONGODB">MONGODB</option>
                                <option value="FULL STACK">FULL STACK</option>
                            </select>
                        </div>
                        <div className="mb-2 mt-3">
                            <label for="bookName" className="form-label">BookName</label>
                            <input type="text" className="form-control" id="bookName" name="bookName"  {...register("bookName", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookName && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="bookDescription" className="form-label">BookDescription</label>
                            <input type="text" className="form-control" id="bookDescription" name="bookDescription" {...register("bookDescription", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookDescription && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="bookPrice" className="form-label">BookPrice(in Rupees)</label>
                            <input type="number" className="form-control" id="bookPrice" name="bookPrice" {...register("bookPrice", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookPrice && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="bookAuthor" className="form-label">BookAuthor</label>
                            <input type="text" className="form-control" id="bookAuthor" name="bookAuthor" {...register("bookAuthor", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookAuthor && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="bookPublisher" className="form-label">BookPublisher</label>
                            <input type="text" className="form-control" id="bookPublisher" name="bookPublisher" {...register("bookPublisher", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookPublisher && "This field is required"}</small>
                        </div>
                        <div className="mb-2">
                            <label for="bookQuantity" className="form-label">BookQuantity</label>
                            <input type="number" className="form-control" id="bookQuantity" name="bookQuantity" {...register("numberOfBooks", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.bookQuantity && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="bookImage" className="form-label">BookImage</label>
                            <input type="file" className="form-control" id="bookImage" name="photo" onChange={(e) => {onFileSelect(e) }}/>
                            <small className="form-text text-danger">{errors.bookPublisher && "This field is required"}</small>
                        </div>

                        

                        <button className="btn btn-warning mb-2">Sell</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserSellerAddBook;