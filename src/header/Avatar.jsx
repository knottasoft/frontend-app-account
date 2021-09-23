import React from 'react';
import PropTypes from 'prop-types';

import { AvatarIcon } from './Icons';

import img from "../assets/icon-user.svg"

function Avatar({
                    size,
                    src,
                    alt,
                    className,
                }) {
    const avatar = src ? (
        <img className="d-block w-100 h-100" src={src} alt={alt} />
    ) : (
        <img className="d-block" style={{ width: size, height: size }} src={img} alt={alt} />
        /*<AvatarIcon style={{ width: size, height: size }} role="img" aria-hidden focusable="false" />*/
    );

    return (
        <span
            style={{ height: size, width: size }}
            className={`${className}`}
        >
      {avatar}
    </span>
    );
}

Avatar.propTypes = {
    src: PropTypes.string,
    size: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
};

Avatar.defaultProps = {
    src: null,
    size: 25,
    alt: null,
    className: null,
};

export default Avatar;
