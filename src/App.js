import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Explore from './pages/Explore';
import Category from './pages/Category';
import Offers from './pages/Offers';
import Listing from './pages/Listing';
import CreateListing from './pages/CreateListing';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/category/:categoryName" element={<Category />} />
                    <Route path="/category/:categoryName/:listingId" element={<Listing />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/create-listing" element={<PrivateRoute />}>
                        <Route path="/create-listing" element={<CreateListing />} />
                    </Route>
                    <Route path="/contact/:landlordId" element={<Contact />} />
                    <Route path="/profile" element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
                <Navbar />
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
