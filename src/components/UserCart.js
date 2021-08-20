import axios from 'axios'
import {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom';


const UserCart = (props) => {

    let [books, setBooks] = useState([])
    let [price, setPrice] = useState(0)
    let [refresh, setRefresh] = useState(0)
    // let [data1, setData1] = useState(0)
    const history = useHistory();

    useEffect(()=>{
        fetch(`/cart/usercart/${localStorage.getItem("username")}`)
        .then(response => response.json())
        .then(json => {
            const arObj = json.message
            setBooks(arObj)
            setPrice(json.totalPrice)
        })
    },[refresh])


    const decObjInCart = async(bookid) => {
        await axios.put(`/cart/removebook/${localStorage.getItem("username")}/${bookid}`)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            props.updateCartCnt(resObj.bookCnt)
        })
        .catch(err=>{
            console.log(err);
            alert("something went wrong")
        })
        setRefresh(refresh + 1)
    }


    const incObjInCart = async(bookid) => {
        await axios.put(`/cart/addbook/${localStorage.getItem("username")}/${bookid}`)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            props.updateCartCnt(resObj.bookCnt)
        })
        .catch(err=>{
            console.log(err);
            alert("something went wrong")
        })
        setRefresh(refresh + 1)
    }


    const goToOrderAddress = () => {
        history.push(`/orderAddress/${price}`)
    }


    
    
    return (
        <div className="container mt-5">
        {
        books.length!==0 ?

        books !== "Empty Cart" ?
        <>
        <h2 className="text-warning">Cart Items</h2><br /><br />
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                </tr>
            </thead>

            <tbody>
            {
            books.map((book)=>{
                return(
                    <tr>
                        <td><img src={book.Image} width="60" className="" alt=""/></td>
                        <td>{book.bookName}</td>
                        <td>{book.bookPrice * book.bookQuantity}</td>
                        <td> <div><span onClick = {() => decObjInCart(book._id)} className="btn btn-sm btn-warning" >-</span> {book.bookQuantity} <span onClick = {() => incObjInCart(book._id)} className="btn btn-sm btn-warning">+</span></div> </td>
                    </tr>
                )
            })
            }
            <tr>
                <td></td>
                <th>Total Price</th>
                <td> {price}/- </td>
                <td> <button onClick={goToOrderAddress} className="btn btn-sm btn-warning" >Order</button> </td>
            </tr>
                
            </tbody>
        </table>
        </>
        :
        <h1 className="text-center text-dark mt-5">Empty Cart</h1>
        :
        <p className="text-center text-dark mt-5">Loading...</p>
        }
        </div>
    )
}

export default UserCart
