import '../CSS_Files/Header.css';
import {BrowserRouter, Switch, Link, Route} from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {ShoppingCart} from '@material-ui/icons';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Login from './Login'
import Home from './Home';
import Orders from './Orders';
import UserCart from './UserCart';
import AdminProfile from './AdminProfile';
import {useState, useEffect} from 'react'
import Register from './Register';
import AddBook from './AddBook';
import UpdateBook from './UpdateBook';
import AddLocation from './AddLocation';
import UserProfile from './UserProfile';
import UserSellerAccount from './UserSellerAccount'
import axios from "axios";
import { useForm } from "react-hook-form";
import ManageUsers from './ManageUsers';
import EditUser from './EditUser';
import BookDetails from './BookDetails';
import OrderAddress from './OrderAddress';

function Header() {
  let [headerUsername, setHeaderUsername] = useState("")
  let [searched, setSearched] = useState(null)
  let [userLoginStatus, setUserLoginStatus] = useState(false)
  let [cartCnt, setCartCnt] = useState(0)
  let [city, setCity] = useState("")
  let [pin, setPin] = useState("")
  let [refreshCnt, setRefreshCnt] = useState(0)
  const {register, handleSubmit} = useForm();
  const [flag, setFlag] = useState(true)

  useEffect(() => {

    if(localStorage.token) {
      setUserLoginStatus(true)
      // make get req
      axios.get(`/cart/cartcnt/${localStorage.getItem("username")}`)
      .then(res=>{
          let responseObj = res.data
          setCartCnt(responseObj.message)
      })
      .catch(err=>{
          alert("something went wrong in getting cart count")
      })
    }else{
      setUserLoginStatus(false)
    }
    setCity(localStorage.getItem("city"))
    setPin(localStorage.getItem("pincode"))
    setHeaderUsername(localStorage.getItem("username"))
  },[userLoginStatus, refreshCnt])

  const logOutUser=()=>{
    localStorage.clear()
    setUserLoginStatus(false)
    setCartCnt(0)
    alert("Logout Successful")
  }

  const updateCartCnt = (n) => {
    setCartCnt(n)
  }

  const updateHeaderUsername = (username) => {
    setHeaderUsername(username)
  }


  const refresh = () => {
    setRefreshCnt(refreshCnt + 1)
  }


  const searchclick = (searchedObj) =>{

    setFlag(true)

    setSearched(searchedObj)
  }



  return (
      <BrowserRouter>
        <nav class="navbar navbar-expand-md navbar-dark header">
        <div class="container-fluid">
          <Link to="/" className="navbar-brand">
            <div>
              <img className="header-logo" src="https://zeevector.com/wp-content/uploads/LOGO/Amazon-India-Logo-PNG-White.png" alt="" />
            </div>
          </Link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="header collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">

              <li className="nav-item">
                {
                  localStorage.city && localStorage.token ?
                  <Link to="/addlocation" className="header-link nav-link">
                    <div className="header-option pb-2">
                      <span className="header-option-1">
                          Deliver at {/*localStorage.getItem("city")*/ city}
                      </span>
                      <span className="header-option-2">
                          {/*localStorage.getItem("pincode")*/ pin} <LocationOnIcon/>
                      </span>
                    </div>
                  </Link> :
                
                  <Link to="/addlocation" className="header-link nav-link">
                    <div className="header-option pb-2">
                      <span className="header-option-1">
                          Hello
                      </span>
                      <span className="header-option-2">
                          Select Your Location <LocationOnIcon/>
                      </span>
                    </div>
                  </Link>
                }
              </li>

              <li className="nav-item">
                <form onSubmit={handleSubmit(searchclick)}>
                  <div className="header-search mt-1 pt-2 pb-2">
                    <select className="header-search-select " name="" id="" {...register("bookCategory")}>
                      <option value="ALL">ALL</option>
                      <option value="FULL STACK">FULL STACK</option>
                      <option value="REACT">REACT</option>
                      <option value="JAVASCRIPT">JAVASCRIPT</option>
                      <option value="NODEJS">NODEJS</option>
                      <option value="HTML CSS RWD">HTML CSS RWD</option>
                      <option value="MONGODB">MONGODB</option>
                    </select>
                    <input className="w-100 header-search-input " type="text" {...register("searchedInput")}/>
                    <button className="header-search-btn"><SearchIcon className="header-search-icon" /></button>
                  </div>
                </form>
              </li>

                
              {
                userLoginStatus?

                localStorage.getItem("username") === "admin"?
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="header-option ">
                      <span className="header-option-1">
                          Hello, Admin
                      </span>
                      <span className="header-option-2">
                          Account & Lists <ArrowDropDownIcon />
                      </span>
                    </div>
                  </Link>

                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <Link to="/addbook" className="dropdown-item">
                        Add Book
                      </Link>
                    </li>
                    <li>
                      <Link to="/adduser" className="dropdown-item">
                        Add User
                      </Link>
                    </li>
                    <li>
                      <Link to="/manageusers" className="dropdown-item">
                        Manage Users
                      </Link>
                    </li>
                    {/* <li>
                      <Link to={`/adminprofile/${localStorage.getItem("username")}`} className="dropdown-item">
                        Your Profile
                      </Link>
                    </li> */}
                    <li>
                      <Link onClick={()=>logOutUser()} to="/" className="dropdown-item">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>:

                <li className="nav-item dropdown">
                  <Link to="/" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="header-option">
                      <span className="header-option-1">
                          Hello, {headerUsername} ({JSON.parse(localStorage.getItem("user")).type})
                      </span>
                      <span className="header-option-2">
                          Account & Lists <ArrowDropDownIcon />
                      </span>
                    </div>
                  </Link>

                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <Link to={`/userprofile/${localStorage.getItem("username")}`} className="dropdown-item">
                        Your Profile
                      </Link>
                    </li>

                    {/* <li>
                      <Link to={`/selleraccount/${localStorage.getItem("username")}`} className="dropdown-item">
                        Your Seller Account
                      </Link>
                    </li> */}

                    <li>
                      <Link onClick={()=>logOutUser()} to="/" className="dropdown-item">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>:


                <Link to="/login" className="header-link nav-link">
                  <div className="header-option">
                    <span className="header-option-1">
                        Hello, Login
                    </span>
                    <span className="header-option-2">
                      Account & Lists
                    </span>
                  </div>
                </Link>
              }

              <li className="nav-item">
                <Link to="/orders" className="header-link nav-link">
                  <div className="header-option">
                    <span className="header-option-1">
                      Returns
                    </span>
                    <span className="header-option-2">
                      & Orders
                    </span>
                  </div>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/cart" className="header-link nav-link">
                  <div className="header-option-cart mt-1">
                    <ShoppingCart />
                    <span className="header-option-2 header-cart-count">
                        Cart {cartCnt}
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        </nav>

        <Switch>
          <Route path="/login">
              <Login setUserLoginStatus={setUserLoginStatus} />
          </Route>

          <Route path="/register">
              <Register />
          </Route>

          <Route path="/addlocation">
              <AddLocation refresh={refresh} />
          </Route>

          <Route path="/orders">
              <Orders />
          </Route>

          <Route path="/cart">
              <UserCart updateCartCnt={updateCartCnt}/>
          </Route>

          <Route path="/adminprofile/:username">
            <AdminProfile/>
          </Route>

          <Route path="/userprofile/:username">
            <UserProfile logOutUser={logOutUser}/>
          </Route>

          <Route path="/selleraccount">
            <UserSellerAccount />
          </Route>

          <Route path="/addbook">
            <AddBook/>
          </Route>

          <Route path="/adduser">
            <Register />
          </Route>

          <Route path="/manageusers">
            <ManageUsers />
          </Route>

          <Route path="/edituser/:userid">
            <EditUser updateHeaderUsername={updateHeaderUsername} refresh={refresh}/>
          </Route>

          <Route path="/updatebook/:bookid">
            <UpdateBook/>
          </Route>

          <Route path="/bookdetails/:bookid">
            <BookDetails/>
          </Route>
          <Route path="/orderaddress/:price">
            <OrderAddress updateCartCnt={updateCartCnt} />
          </Route>

          <Route path="/">
              <Home updateCartCnt={updateCartCnt} searched={searched} flag={flag} />
          </Route>
        </Switch>
      </BrowserRouter>
  );
}

export default Header;