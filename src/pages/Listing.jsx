import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Slider from '../components/Slider';
import shareIcon from '../assets/svg/shareIcon.svg';

function Listing() {
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [shareLinkCopied, setShareLinkCopied] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const auth = getAuth();
    const { listingId } = params;

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const docRef = doc(db, 'listings', listingId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setListing(docSnap.data());
                    setLoading(false);
                } else {
                    toast.error('Listing not found.');
                }
            } catch (error) {
                console.error(error);
                toast.error('Could not fetch listings.');
            }
        };

        fetchListing();
    }, [navigate, listingId]);

    if (loading) return <Spinner />;

    return (
        <div className=" no-margin">
            <main>
                <Slider imgUrls={listing.imgUrls} />

                <div
                    className="shareIconDiv"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShareLinkCopied(true);
                        setTimeout(() => {
                            setShareLinkCopied(false);
                        }, 2000);
                    }}
                >
                    <img src={shareIcon} alt="share" />
                </div>
                {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

                <div className="listingDetails">
                    <p className="listingName">
                        {listing.name}
                        {' - $'}
                        {(listing.offer ? listing.discountedPrice : listing.regularPrice)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                    <p className="listingLocation">{listing.location}</p>

                    <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>

                    {listing.offer && (
                        <p className="discountPrice">
                            {'$'}
                            {(listing.regularPrice - listing.discountedPrice)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            {' discount'}
                        </p>
                    )}

                    <ul className="listingDetailsList">
                        <li>
                            {listing.bedrooms}
                            {listing.bedrooms > 1 ? ' Bedrooms' : ' Bedroom'}
                        </li>
                        <li>
                            {listing.bathrooms}
                            {listing.bathrooms > 1 ? ' Bathrooms' : ' Bathroom'}
                        </li>
                        {listing.parking && <li>Parking Spot</li>}
                        {listing.furnished && <li>Furnished</li>}
                    </ul>

                    <p className="listingLocationTitle">Location</p>
                    <div className="leafletContainer">
                        <MapContainer
                            style={{ height: '100%', width: '100%' }}
                            center={[listing.geolocation.lat, listing.geolocation.lng]}
                            zoom={13}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
                                <Popup>{listing.location}</Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {auth.currentUser?.uid !== listing.userRef && (
                        <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="primaryButton">
                            Contact Landlord
                        </Link>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Listing;
