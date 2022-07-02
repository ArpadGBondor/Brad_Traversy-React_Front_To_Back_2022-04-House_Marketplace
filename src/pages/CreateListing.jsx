import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Spinner from '../components/Spinner';

function CreateListing() {
    const auth = getAuth();
    // eslint-disable-next-line no-unused-vars
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        location: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
        userRef: auth.currentUser.uid,
    });
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        location,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const onSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        // Checks
        if (discountedPrice >= regularPrice) {
            setLoading(false);
            toast.error('Discounted price needs to be less than the regular price.');
            return;
        }
        if (images.length > 6) {
            setLoading(false);
            toast.error('Max 6 images.');
            return;
        }

        // Geocoding
        let geolocation = {};
        if (geolocationEnabled) {
            try {
                const { data } = await axios(`/api/geocoding?location=${location}`);

                if (data.data.length > 0) {
                    geolocation.lat = data.data[0].latitude;
                    geolocation.lng = data.data[0].longitude;
                } else {
                    setLoading(false);
                    toast.error(`Please enter a correct address.`);
                    return;
                }
            } catch (error) {
                setLoading(false);
                toast.error(`Couldn't locate the address.`);
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        // Store images in Firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const fileName = `${auth.currentUser.uid}-${uuidv4()}-${image.name}`;

                const storageRef = ref(storage, 'images/' + fileName);

                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                            default:
                                console.log(`Upload is ${snapshot.state}`);
                                break;
                        }
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        };

        const imgUrls = await Promise.all([...images].map((image) => storeImage(image))).catch(() => {
            toast.error(`Couldn't upload images.`);
            setLoading(false);
            return;
        });

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
        };
        delete formDataCopy.images;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        delete formDataCopy.images;
        !offer && delete formDataCopy.discountedPrice;

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy);

        setLoading(false);
        toast.success('Listing saved.');
        navigate(`/category/${type}/${docRef.id}`);
    };
    const onMutate = (e) => {
        let boolean = null;
        let number = null;
        if (e.target.type === 'button') {
            if (e.target.value === 'true') boolean = true;
            if (e.target.value === 'false') boolean = false;
        } else if (e.target.type === 'number') {
            number = parseInt(e.target.value);
        }

        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        } else {
            // Text / Boolean / Numbers

            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? number ?? e.target.value,
            }));
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="profile">
            <header>
                <p className="pageHeader">Create a Listing</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label className="formLabel">Sell / Rent</label>
                    <div className="formButtons">
                        <button
                            type="button"
                            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                            id="type"
                            value="sale"
                            onClick={onMutate}
                        >
                            Sell
                        </button>
                        <button
                            type="button"
                            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                            id="type"
                            value="rent"
                            onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label className="formLabel">Name</label>
                    <input
                        className="formInputName"
                        type="text"
                        id="name"
                        value={name}
                        onChange={onMutate}
                        maxLength="32"
                        minLength="10"
                        required
                    />

                    <div className="formRooms flex">
                        <div>
                            <label className="formLabel">Bedrooms</label>
                            <input
                                className="formInputSmall"
                                type="number"
                                id="bedrooms"
                                value={bedrooms}
                                onChange={onMutate}
                                min="1"
                                max="50"
                                required
                            />
                        </div>
                        <div>
                            <label className="formLabel">Bathrooms</label>
                            <input
                                className="formInputSmall"
                                type="number"
                                id="bathrooms"
                                value={bathrooms}
                                onChange={onMutate}
                                min="1"
                                max="50"
                                required
                            />
                        </div>
                    </div>

                    <label className="formLabel">Parking</label>
                    <div className="formButtons">
                        <button
                            type="button"
                            className={parking ? 'formButtonActive' : 'formButton'}
                            id="parking"
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className={!parking ? 'formButtonActive' : 'formButton'}
                            id="parking"
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel">Furnished</label>
                    <div className="formButtons">
                        <button
                            type="button"
                            className={furnished ? 'formButtonActive' : 'formButton'}
                            id="furnished"
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className={!furnished ? 'formButtonActive' : 'formButton'}
                            id="furnished"
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel">Address</label>
                    <textarea
                        className="formInputAddress"
                        type="text"
                        id="location"
                        value={location}
                        onChange={onMutate}
                        required
                    />

                    {!geolocationEnabled && (
                        <div className="formLatLng flex">
                            <div>
                                <label className="formLabel">Latitude</label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="latitude"
                                    value={latitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label className="formLabel">Longitude</label>
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="longitude"
                                    value={longitude}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label className="formLabel">Offer</label>
                    <div className="formButtons">
                        <button
                            type="button"
                            className={offer ? 'formButtonActive' : 'formButton'}
                            id="offer"
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className={!offer ? 'formButtonActive' : 'formButton'}
                            id="offer"
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel">Regular Price</label>
                    <div className="formPriceDiv">
                        <input
                            className="formInputSmall"
                            type="number"
                            id="regularPrice"
                            value={regularPrice}
                            onChange={onMutate}
                            min="50"
                            max="750000000"
                            required
                        />
                        {type === 'rent' && <p className="formPriceText">$ / Month</p>}
                    </div>

                    {offer && (
                        <>
                            <label className="formLabel">Discounted Price</label>
                            <div className="formPriceDiv">
                                <input
                                    className="formInputSmall"
                                    type="number"
                                    id="discountedPrice"
                                    value={discountedPrice}
                                    onChange={onMutate}
                                    min="50"
                                    max="750000000"
                                    required={offer}
                                />
                                {type === 'rent' && <p className="formPriceText">$ / Month</p>}
                            </div>
                        </>
                    )}

                    <label className="formLabel">Images</label>
                    <p className="imagesInfo">The first image will be the cover (max 6).</p>
                    <input
                        className="formInputFile"
                        type="file"
                        id="images"
                        onChange={onMutate}
                        max="6"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                    />

                    <button type="submit" className="primaryButton createListingButton">
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    );
}

export default CreateListing;
