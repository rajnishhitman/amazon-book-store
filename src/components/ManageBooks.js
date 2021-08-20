import{ useEffect, useState } from "react";
import '../Home.css';

const ManageBooks = () => {
    let [books, setBooks] = useState([])

    useEffect(()=>{
       
        fetch("/books/getbooks")
        .then(response => response.json())
        .then(json => {
            const arObj = json.message
            setBooks(arObj)
            // console.log(arObj)
        })
    },[])

    return (
        <>
        <div className="home">
            <div className="home-1" >
                <img className="home-1-image" src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonBooksMarketing/LandingPage/AB/Landing-Evergreen-Hero-Desktop-Books.png" alt="" />
            </div>
        </div>

        <div className="container row d-flex justify-content-center home-cards">
            {
                books.map((book) => {
                    return(
                        <div className="card m-5 col-3 shadow home-card" >
                            <div class="card-header">
                                <img src={book.Image} className="card-img-top cardImg" alt=""/>
                            </div>
                            <div className="card-body">
                                <h6 className="card-title">{book.bookName}</h6>
                                <p className="card-text">Author - {book.bookAuthor}</p>
                                <button className="btn btn-sm btn-warning float-start">Update</button>
                                <button className="btn btn-sm btn-warning float-end">Delete</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        </>
    )
}

export default ManageBooks
