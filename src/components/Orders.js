// import "../CSS_Files/Orders.css";
import axios from 'axios'
import {useEffect, useState} from 'react'
// import { useHistory } from 'react-router-dom';

const Orders = () => {

    let [userOrders, setUserOrders] = useState([])
    let [refresh, setRefresh] = useState(0)

    useEffect(()=>{
        fetch(`/order/userorder/${localStorage.getItem("username")}`)
        .then(response => response.json())
        .then(json => {
            const arObj = json.message
            // setBooks(arObj)
            // setPrice(json.totalPrice)
            setUserOrders(arObj)
        })
    },[refresh])

    const returnBooks = () => {
        axios.delete(`/order/returnbooks/${localStorage.getItem("username")}`)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            setRefresh(refresh + 1)
        })
    }

    return(
        <div>
            {
                userOrders.map((userOrder) => {
                    return(
                        <div className="container mt-5">
                        <h5>Deliver To: {userOrder.address.name}</h5>
                        <h6>Contact Number: {userOrder.address.contactNumber}</h6>
                        <h6>Address: {userOrder.address.address}, {userOrder.address.city}, {userOrder.address.state}, {userOrder.address.pin}</h6>

                        <table class="table">
                            <thead>
                                <tr>
                                <th scope="col">Image</th>
                                    <th scope="col">Name</th>
                                    {/* <th scope="col">Author</th> */}
                                    <th scope="col">Qty</th>
                                    <th scope="col">Price</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>

                            <tbody>
                            {
                            userOrder.books.map((book)=>{
                                return(
                                    <tr>
                                        <td><img src={book.Image} width="60" className="" alt=""/></td>
                                        <td>{book.bookName}</td>
                                        {/* <td>{book.bookAuthor}</td> */}
                                        <td>{book.bookQuantity}</td>
                                        <td>{book.bookPrice * book.bookQuantity}</td>
                                        <td></td>
                                        {/* <td> <button className="btn btn-warning" onClick = {() => decObjInCart(book._id)} >Remove</button> </td> */}
                                    </tr>
                                )
                            })
                            }
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td> <button onClick={returnBooks} className="btn btn-sm btn-warning" >Return</button> </td>
                            </tr>
                                
                            </tbody>
                        </table>               
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Orders
