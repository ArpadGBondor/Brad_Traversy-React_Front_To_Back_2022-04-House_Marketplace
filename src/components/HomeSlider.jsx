import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import Spinner from './Spinner';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function HomeSlider() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });

            setListings(listings);
            setLoading(false);
        };

        fetchListings();
    }, []);
    if (loading) return <Spinner />;
    return listings ? (
        <>
            <p className="exploreHeading">Recommended</p>
            <Swiper slidesPerView={1} pagination={{ clickable: true }} style={{ height: '300px' }}>
                {listings.map(({ data, id }) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div
                            style={{ background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover' }}
                            className="swiperSlideDiv"
                        >
                            <p className="swiperSlideText">{data.name}</p>
                            <p className="swiperSlidePrice">
                                {'$'}
                                {(data.offer ? data.discountedPrice : data.regularPrice)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                {data.type === 'rent' ? ' / Month' : ''}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    ) : (
        <></>
    );
}

export default HomeSlider;
