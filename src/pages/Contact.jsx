import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function Contact() {
    const [message, setMessage] = useState('');
    const [landlord, setLandlord] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const params = useParams();

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, 'users', params.landlordId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error('Could not get landlord data');
            }
            setLoading(false);
        };

        getLandlord();
    }, [params.landlordId]);

    const onChange = (e) => setMessage(e.target.value);

    if (loading) return <Spinner />;

    return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">Contact Landlord</p>
            </header>
            {landlord !== null && (
                <main>
                    <div className="contactLandlord">
                        <p className="landlordName">Contact {landlord?.name}</p>
                    </div>
                    <form className="messageForm">
                        <div className="messageDiv">
                            <label htmlFor="message" className="messageLabel">
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                className="textarea"
                                value={message}
                                onChange={onChange}
                            />
                        </div>

                        <a
                            href={`mailto:${landlord.email}?subject=${searchParams.get('listingName')}&body=${message}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            <button type="button" className="primaryButton">
                                Send Message
                            </button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    );
}

export default Contact;
