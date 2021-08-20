// import {useState} from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router-dom';
const axios = require('axios');

//RazorPay
function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost'
//Razorpay

const OrderAddress = (props) => {

    let paramObj = useParams();
    const placeOrder = async(addressObj) => {
        await axios.put(`/order/placeorder/${localStorage.getItem("username")}`,addressObj)
        .then(res => {
            let resObj = res.data;
            alert(resObj.message)
            props.updateCartCnt(resObj.bookCnt)
            history.push("/orders")
        })
        // setRefresh(refresh + 1)
    }


    //Razorpay
    // const [name, setName] = useState(localStorage.getItem("username"))
    const name = localStorage.getItem("username")
    async function displayRazorpay(addressObj) {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}
        const data = await fetch(`http://localhost:8080/razorpay/${paramObj.price}`, { method: 'POST' }).then((t) =>
            t.json()
        )
        console.log(data)


        const options = {
			key: __DEV__ ? 'rzp_test_qtqNRFhd8MRg8Z' : 'PRODUCTION_KEY',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Amazon Books',
			description: 'Secured Money Transaction',
			image: 'http://localhost:8080/logo.svg',
			handler: function (response) {
				// alert(response.razorpay_payment_id)
				// alert(response.razorpay_order_id)
				// alert(response.razorpay_signature)
                placeOrder(addressObj)
			},
			prefill: {
				name ,
				email: 'rajnishhitman@gmail.com',
				phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
    }
    //RazorPay


    const {register, handleSubmit, formState: { errors } } = useForm();
    const history = useHistory();
    return (
        <div className="d-flex flex-row justify-content-center">
            <div className="row border border-secondary mt-5">
                <div className="col-md">
                    <form onSubmit={handleSubmit(displayRazorpay)}>
                        <div className="mb-2 mt-3">
                            <label for="exampleInputUsername1" className="form-label">Name</label>
                            <input type="text" className="form-control" id="exampleInputUsername1" name="name"  {...register("name", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.name && "This field is required"}</small>
                        </div>

                        <div className="mb-2 mt-3">
                            <label for="contactnumber" className="form-label">Contact Number</label>
                            <input type="number" className="form-control" id="contactnumber" name="contactNumber"  {...register("contactNumber", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.contactNumber && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="address" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address" name="address" {...register("address", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.address && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="city" className="form-label">City</label>
                            <input type="text" className="form-control" id="city" name="city" {...register("city", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.city && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="state" className="form-label">State</label>
                            <input type="text" className="form-control" id="state" name="state" {...register("state", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.state && "This field is required"}</small>
                        </div>

                        <div className="mb-2">
                            <label for="pin" className="form-label">Pin Code</label>
                            <input type="number" className="form-control" id="pin" name="pin" {...register("pin", {required:true})} autoComplete="off"/>
                            <small className="form-text text-danger">{errors.pin && "This field is required"}</small>
                        </div>


                        <button className="btn btn-warning mb-2">Place Order</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OrderAddress
