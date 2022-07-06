import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem({ listing, id, onDelete, onEdit }) {
    return (
        <li className="categoryListing">
            <Link to={`/category/${listing.type}/${id}`} className="categoryListingLink">
                <img src={listing.imgUrls[0]} alt={listing.name} className="categoryListingImg" />
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">{listing.location}</p>
                    <p className="categoryListingName">{listing.name}</p>
                    <p className="categoryListingPrice">
                        $
                        {(listing.offer ? listing.discountedPrice : listing.regularPrice)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        {listing.type === 'rent' && ' / Month'}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <img src={bedIcon} alt="bed" />
                        <p className="categoryListingInfoText">
                            {`${listing.bedrooms} ${listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}`}
                        </p>
                        <img src={bathtubIcon} alt="bath" />
                        <p className="categoryListingInfoText">
                            {`${listing.bathrooms} ${listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}`}
                        </p>
                    </div>
                </div>
            </Link>

            {onDelete && <DeleteIcon className="removeIcon" fill="rgb(231, 76, 60)" onClick={onDelete} />}
            {onEdit && <EditIcon className="editIcon" onClick={onEdit} />}
        </li>
    );
}

export default ListingItem;
