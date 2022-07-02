import React from 'react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider({ imgUrls }) {
    return (
        <Swiper slidesPerView={1} pagination={{ clickable: true }} style={{ height: '300px' }}>
            {imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                        style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                        className="swiperSlideDiv"
                    >
                        {/* <p className="swiperSlideText">{listing.name}</p> */}
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default Slider;
