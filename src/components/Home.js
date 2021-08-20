import { useEffect, useState, useRef } from "react";
import '../CSS_Files/Home.css';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import {BrowserRouter, Switch, Link, Route} from 'react-router-dom';
import UserSellerAddBook from './UserSellerAddBook';
import UserSellerManageBook from './UserSellerManageBook';
import UserSellerUpdateBook from './UserSellerUpdateBook';

const Home = (props) => {

    // let [stock, setStock] = useState(true)
    let [books, setBooks] = useState([])
    let [books1, setBooks1] = useState([])
    let [refresh, setRefresh] = useState(0)
    const history = useHistory();
    const ref = useRef(null);
    

    useEffect(()=> {
       
        if(localStorage.token && JSON.parse(localStorage.getItem("user")).type === "SELLER"){
            ref.current.click();
        }
        fetch("/books/getbooks")
        .then(response => response.json())
        .then(json => {
            const arObj = json.message
            setBooks(arObj)
            setBooks1(arObj)
        })


    },[refresh])


    useEffect(() => {
        const searchCategoryBooks = (b) => {
            return(b.bookCategory === props.searched.bookCategory && (b.bookAuthor.toLowerCase().startsWith(props.searched.searchedInput.toLowerCase()) || b.bookName.toLowerCase().startsWith(props.searched.searchedInput.toLowerCase())))
        }
    
    
        const searchAllBooks = (b) => {
            return(b.bookAuthor.toLowerCase().startsWith(props.searched.searchedInput.toLowerCase()) || b.bookName.toLowerCase().startsWith(props.searched.searchedInput.toLowerCase()))
        }

        if(props.searched !== null && props.flag) {
            if(props.searched.bookCategory !== "ALL"){
                setBooks(books1.filter(searchCategoryBooks))
            }
            else{
                setBooks(books1.filter(searchAllBooks))
            }
            console.log(props.searched)
        }
    },[books1, props.searched, props.flag])


    const all = () => {
        setBooks(books1)
    }
    const html1 = () => {
        setBooks(books1.filter(html))
    }
    const js1 = () => {
        setBooks(books1.filter(js))
    }
    const react1 = () => {
        setBooks(books1.filter(react))
    }
    const node1 = () => {
        setBooks(books1.filter(node))
    }
    const mongo1 = () => {
        setBooks(books1.filter(mongo))
    }
    const fullStack1 = () => {
        setBooks(books1.filter(fullStack))
    }

    const newReleases1 = () => {
        setBooks(books1.filter(newReleases))
    }

    const mostRated1 = () => {
        setBooks(books1.filter(mostRated4))
    }

    const mostRated2 = () => {
        setBooks(books1.filter(mostRated3))
    }

    const html = (b) => {
        return(b.bookCategory === "HTML CSS RWD")
    }
    const js = (b) => {
        return(b.bookCategory === "JAVASCRIPT")
    }
    const react = (b) => {
        return(b.bookCategory === "REACT")
    }
    const node = (b) => {
        return(b.bookCategory === "NODEJS")
    }
    const mongo = (b) => {
        return(b.bookCategory === "MONGODB")
    }
    const fullStack = (b) => {
        return(b.bookCategory === "FULL STACK")
    }
    const newReleases = (b) => {
        const d = new Date();
        return(b.Year === d.getFullYear() && b.Month === d.getMonth() && b.Day === d.getDate())
    }

    const mostRated4 = (b) => {
        return(b.avgRate >= 4)
    }

    const mostRated3 = (b) => {
        return(b.avgRate >= 3)
    }



    const goToUpdate = (bookid) => {
        history.push(`/updatebook/${bookid}`)
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

    const addToCart = async(bookObj) => {
        let username = localStorage.getItem("username")
        let userBookObj = {
            username: username,
            bookObj: bookObj
        }

        // make post req
        await axios.post("/cart/addtocart",userBookObj)
        .then(res=>{
            let responseObj = res.data
            alert(responseObj.message)
            props.updateCartCnt(responseObj.bookCnt)
        })
        .catch(err=>{
            alert("something went wrong in adding book to cart")
        })
        setRefresh(refresh+1)
    }

    
    const bookDetails = (bookid) => {
        history.push(`/bookdetails/${bookid}`)
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
    


    if(localStorage.token && JSON.parse(localStorage.getItem("user")).type === "SELLER"){
        return (
            <BrowserRouter>
                <div>
                    <nav class="navbar navbar-expand-md navbar-dark header">
                        <div class="container-fluid">
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent1">
                                <ul className="navbar-nav navigation2">
                                    <li className="nav-item">
                                        <Link to="/selleraddbook" ref={ref} className="btn btn-dark book-category all">Sell Book</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/sellermanagebooks" className="btn btn-dark book-category">Manage Your Books</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <Switch>
                    <Route path="/selleraddbook">
                        <UserSellerAddBook/>
                    </Route>
                    <Route path="/sellermanagebooks">
                        <UserSellerManageBook />
                    </Route>
                    <Route path="/sellerupdatebook/:bookid">
                        <UserSellerUpdateBook />
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }
    else{
    return (
        <div className="bgcolor">
        <div className="home">
            <div className="home-1" >
                <img className="home-1-image" src="https://images-na.ssl-images-amazon.com/images/G/01/AmazonBooksMarketing/LandingPage/AB/Landing-Evergreen-Hero-Desktop-Books.png" alt="" />
            </div>
            <nav class="navbar navbar-expand-md navbar-dark header">
                <div class="container-fluid">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent1">
                        <ul className="navbar-nav navigation2">
                            <li className="nav-item">
                                <button onClick={all} className="btn btn-dark book-category all">ALL</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={html1} className="btn btn-dark book-category">HTML CSS RWD</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={js1} className="btn btn-dark book-category">JAVASCRIPT</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={react1} className="btn btn-dark book-category">REACT</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={node1} className="btn btn-dark book-category">NODEJS</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={mongo1} className="btn btn-dark book-category">MONGODB</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={fullStack1} className="btn btn-dark book-category">FUll STACK</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={newReleases1} className="btn btn-dark book-category">New Releases</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={mostRated2} className="btn btn-dark book-category">3+ Rating</button>
                            </li>
                            <li className="nav-item">
                                <button onClick={mostRated1} className="btn btn-dark book-category">4+ Rating</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>


        <div className="container row d-flex justify-content-center home-cards">
            {
                books.map((book) => {
                    return(
                        <div  className="card m-5 col-3 shadow home-card" >
                            <div class="card-header">
                                <img src={book.Image} className="card-img-top cardImg" alt=""/>
                            </div>
                            <div className="card-body">
                                {
                                    !localStorage.token ? 
                                    <>
                                    <b className="card-title">{book.bookName}</b><br />
                                    <span className="card-text">Author - {book.bookAuthor}</span><br />
                                    {
                                        book.rateCnt === 0 ?
                                        // <div><ReactStars size={20} count={5} edit={false} color="gray" /></div> :
                                        // <div> <ReactStars size={20} count={book.avgRate} edit={false} color="#ffd700" />{book.avgRate}</div>
                                        <><span className="text-warning" >{activestarRating(book.avgRate)}</span><span className="text-secondary">{inactivestarRating(book.avgRate)}</span></>:
                                        <><span className="text-warning" >{activestarRating(book.avgRate)}</span><span className="text-secondary">{inactivestarRating(book.avgRate)}</span></>
                                    }
                                    {
                                        book.numberOfBooks>0?
                                        <><br /><div className="badge bg-success text-wrap">In stock</div></>:
                                        <div className="badge bg-danger text-wrap">Out of stock</div>
                                    }
                                    <p className="card-text">Price - ₹ {book.bookPrice}</p>
                                    
                                    </> : 
                                    localStorage.getItem("username") === "admin" ? 
                                    <>
                                    <b className="card-title">{book.bookName}</b><br />
                                    <span className="card-text">Author - {book.bookAuthor}</span><br />
                                    {
                                        book.rateCnt === 0 ?
                                        // <div><ReactStars size={20} count={5} edit={false} color="gray" /></div> :
                                        // <div> <ReactStars size={20} count={book.avgRate} edit={false} color="#ffd700" />{book.avgRate}</div>
                                        <><span className="text-warning" >{activestarRating(book.avgRate)}</span><span className="text-secondary">{inactivestarRating(book.avgRate)}</span></>:
                                        <><span className="text-warning" >{activestarRating(book.avgRate)}</span><span className="text-secondary">{inactivestarRating(book.avgRate)}</span></>
                                    }
                                    {
                                        book.numberOfBooks>0?
                                        <> <br /> <div className="badge bg-success text-wrap">In stock</div></>:
                                        <div className="badge bg-danger text-wrap">Out of stock</div>
                                    }
                                    <p className="card-text">Price - ₹ {book.bookPrice}</p>
                                    <button onClick={ () => goToUpdate(book._id)} className="btn btn-sm btn-warning float-start">Update</button>
                                    <button onClick={ () => deleteBook(book._id)} className="btn btn-sm btn-warning float-end">Delete</button>
                                    </> :
                                    <>
                                    <b className="card-title">{book.bookName}</b><br />
                                    <span className="card-text">Author - {book.bookAuthor}</span><br />
                                    {
                                        book.rateCnt === 0 ?
                                        // <div><ReactStars size={20} count={5} edit={false} color="gray" /></div> :
                                        // <div> <ReactStars size={20} count={book.avgRate} edit={false} color="#ffd700" />{book.avgRate}</div>
                                        <><span className="text-warning" >{activestarRating(book.avgRate)}</span><span className="text-secondary">{inactivestarRating(book.avgRate)}</span></>:
                                        <><span className="text-warning" >{activestarRating(book.avgRate)}</span><span className="text-secondary">{inactivestarRating(book.avgRate)}</span></>
                                    }
                                    {
                                        book.numberOfBooks > 0 ?
                                        <><br /><div className="badge bg-success text-wrap">In stock</div></>:
                                        <><br /><div className="badge bg-danger text-wrap">Out of stock</div></>
                                    }
                                    <p className="card-text">Price - ₹ {book.bookPrice}</p>
                                    <button onClick={ () => addToCart(book)} className="btn btn-sm btn-warning float-start">AddToCart</button>
                                    <button onClick={ () => bookDetails(book._id)} className="btn btn-sm btn-warning float-end">View</button>
                                    </>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
        </div>
    )}
}

export default Home
