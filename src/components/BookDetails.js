import "../CSS_Files/BookDetails.css";
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { useForm } from "react-hook-form";


const BookDetails = () => {
    let paramObj = useParams();
    let [book, setBook] = useState({})
    let [reviewAndRating, setReviewAndRating] = useState([])
    let [refresh, setRefresh] = useState(0)
    let [rating, setRating] = useState(0)
    const {register, handleSubmit, formState: { errors } } = useForm();
    let localStoreUser = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        axios.get(`/books/getbook/${paramObj.bookid}`)
        .then(res => {
            setBook(res.data.message)
            if(res.data.message.reviewANDrating){
                setReviewAndRating(res.data.message.reviewANDrating)
            }
        })
    },[paramObj.bookid, refresh])

    const onFormSubmit = (reviewObj) => {
        axios.put(`/books/ratebook/${rating}/${paramObj.bookid}`)
        let rateAndReviewObj = {review: reviewObj.review, rating: rating, username: localStoreUser.username, userImg: localStoreUser.profileImage}
        axios.post(`/books/rateAndreview/${paramObj.bookid}`, rateAndReviewObj)
        .then(res => {
            alert(res.data.message)
            setRefresh(refresh+1)
        })
    }

    const rateBook = (rating) => {
        setRating(rating)
        
    }

    const activestarRating = (avgRate) => {
        var stars1  = '';
        for(var i = 1; i <= avgRate; i += 1) {
            stars1 = stars1 + '🟊';
        }
        return stars1
    }

    const inactivestarRating = (avgRate) => {
        var stars2  = '';
        for(var j = avgRate+1 ; j <= 5; j += 1) {
            stars2 = stars2 + '🟊';
        }
        return stars2
    } 

    return (
        <>
        <div className="container bContent d-flex flex-row ">
            <div className="card profileCard">
                <div className="row no-gutters">
                    <div className="col-sm-5">
                        <img className="card-Img cardImg" src={book.Image} alt="" />
                    </div>
                    <div className="col-sm-7">
                        <div className="card-body">
                            <p className="card-title"><b>Book Name - {book.bookName}</b></p>
                            <p className="card-text">Description - {book.bookDescription}</p>
                            <p className="card-text">Author - {book.bookAuthor}</p>
                            <p className="card-text">Publisher - {book.bookPublisher}</p>
                            <p className="card-text">Price - ₹ {book.bookPrice}</p> <hr />

                            <form onSubmit={handleSubmit(onFormSubmit)}>
                                <p> <b>Rate and Review the book</b> <ReactStars size={25} onChange={rateBook} /></p>
                                <textarea name="review" id="" cols="30" rows="3" {...register("review", {required:true})}></textarea><br />
                                <small className="form-text text-danger">{errors.review && "This field is required"}</small><br />
                                <button className="btn btn-warning btn-sm">ADD</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mt-5">
            {
                reviewAndRating.length === 0 ?
                <h2>No Reviews and Ratings</h2>:

                reviewAndRating.map((ar)=> {
                    return(
                        <>
                        <div className="d-flex flex-row mt-3">
                            <div>
                                <img src={ar.userImg} className="rounded m-1" width="75px" height="75px" alt="" />
                            </div>
                            <div>
                                <span><strong>{ar.username}</strong></span><br />
                                <><span className="text-warning" >{activestarRating(ar.rating)}</span><span className="text-secondary">{inactivestarRating(ar.rating)}</span></>
                                <p>{ar.review}</p>
                            </div>
                        </div><hr />

                        </>
                    )
                })
            }
        </div>
        </>
        
    )
}

export default BookDetails
