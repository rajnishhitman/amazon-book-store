import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";

const UserSellerManageBook = () => {
    let [books, setBooks] = useState([])
    let userid = JSON.parse(localStorage.getItem("user"))._id
    let [refresh, setRefresh] = useState(0)
    const history = useHistory();

    useEffect(()=>{
       
        fetch(`/books/getuserbooks/${userid}`)
        .then(response => response.json())
        .then(json => {
            const arObj = json.message
            setBooks(arObj)
            // setBooks1(arObj)
            // console.log(arObj)
            // console.log("useEffect is working")
        })
    },[userid ,refresh])


    const goToUpdate = (bookid) => {
        history.push(`/sellerupdatebook/${bookid}`)
    }


    const deleteBook = async(bookid) => {
        // console.log("delete book with id", bookid)

        //put req
        await axios.delete(`/books/deletebook/${bookid}`)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
        })

        .catch(err=>{
            console.log(err);
            alert("something went wrong")
        })
        setRefresh(refresh + 1)
    }



    return (
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
                                {/* <p className="card-text">Publisher - {book.bookPublisher}</p>
                                <p className="card-text">Description - {book.bookDescription}</p> */}
                                <p className="card-text">Price - RS {book.bookPrice}</p>
                                <button onClick={ () => goToUpdate(book._id)} className="btn btn-sm btn-warning float-start">Update</button>
                                <button onClick={ () => deleteBook(book._id)} className="btn btn-sm btn-warning float-end">Delete</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default UserSellerManageBook;
