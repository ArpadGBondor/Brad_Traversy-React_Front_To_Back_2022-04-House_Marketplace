import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, getDocs, updateDoc, deleteDoc, collection, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';

function Profile() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);
    const { name, email } = formData;

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings');

            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));

            const listingsSnap = await getDocs(q);

            const listings = [];

            listingsSnap.forEach((doc) => listings.push({ id: doc.id, data: doc.data() }));
            setListings(listings);
            setLoading(false);
        };

        fetchUserListings();
    }, [auth.currentUser]);

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    };

    const onChange = (e) =>
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                // Update display name in Firebase
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });

                // Update in Firestore
                const userRef = doc(db, 'users', auth.currentUser.uid);

                await updateDoc(userRef, { name });
            }
        } catch (error) {
            toast.error('Could not update profile details');
        }
    };

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            // Delete images
            const storage = getStorage();
            const selected = listings.find((listing) => listing.id === listingId);
            const imagesToDelete = selected.data.imgUrls;

            console.log(selected);
            console.log(imagesToDelete);

            imagesToDelete.forEach((urlToDelete) => {
                let fileName = urlToDelete.split('/').pop().split('#')[0].split('?')[0];
                fileName = fileName.replace('%2F', '/');
                const imageToDeleteRef = ref(storage, `${fileName}`);
                //Delete the file
                deleteObject(imageToDeleteRef)
                    .then(() => {
                        // You can comment this out in production. :)
                        toast.success(`Image deleted: ${fileName}`);
                    })
                    .catch((error) => {
                        toast.error('Failed to delete images');
                    });
            });

            // Delete listing
            await deleteDoc(doc(db, 'listings', listingId));
            setListings([...listings.filter((listing) => listing.id !== listingId)]);
            toast.success('Succesfully deleted listing.');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type="button" className="logOut" onClick={onLogout}>
                    Logout
                </button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Personal Details</p>
                    <p
                        className="changePersonalDetails"
                        onClick={() => {
                            changeDetails && onSubmit();
                            setChangeDetails((prevState) => !prevState);
                        }}
                    >
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            name="name"
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type="email"
                            name="email"
                            className="profileEmail"
                            disabled
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="home" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRightIcon} alt="arrow right" />
                </Link>

                {!loading & (listings?.length > 0) && (
                    <>
                        <p className="listingText">Your listings</p>
                        <ul className="listingsList">
                            {listings.map((listing) => (
                                <ListingItem
                                    key={listing.id}
                                    id={listing.id}
                                    listing={listing.data}
                                    onDelete={() => onDelete(listing.id)}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
}

export default Profile;
