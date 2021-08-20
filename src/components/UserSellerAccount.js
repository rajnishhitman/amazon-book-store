import {BrowserRouter, Switch, Link, Route} from 'react-router-dom';
import { useEffect,useRef } from 'react'
import UserSellerAddBook from './UserSellerAddBook';
import UserSellerManageBook from './UserSellerManageBook';
import UserSellerUpdateBook from './UserSellerUpdateBook';

const UserSellerAccount = () => {
    const ref = useRef(null);
    useEffect(() => {
        ref.current.click();
    })
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

export default UserSellerAccount
