import React from 'react';
import PropTypes from 'prop-types';

function Logo({ src, alt, ...attributes }) {
    return (
        <img src={src} alt={alt} {...attributes} width="60" height="60"/>
    );
}

Logo.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

function LinkedLogo({
                        href,
                        src,
                        alt,
                        ...attributes
                    }) {
    return (
        <a href={href} {...attributes}>
            <img className="d-block" src={src} alt={alt} width="60" height="60" />
        </a>
    );
}

LinkedLogo.propTypes = {
    href: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

export { LinkedLogo, Logo };
export default Logo;
