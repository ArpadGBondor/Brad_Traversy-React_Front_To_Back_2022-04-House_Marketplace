import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/offer" element={<Offers />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
                <Navbar />
            </Router>
        </>
    );
}

export default App;
