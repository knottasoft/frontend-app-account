import React from 'react';
import PropTypes from 'prop-types';

function Logo({ src, alt, width, height, ...attributes }) {
    return (
        <img src={src} alt={alt} {...attributes} width={width} height={height} />
    );
}

Logo.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.any.isRequired,
    height: PropTypes.any.isRequired,

};

Logo.defaultProps = {
    width: 60,
    height: 60
}

function LinkedLogo({
                        href,
                        src,
                        alt,
                        width,
                        height,
                        ...attributes
                    }) {
    return (
        <a href={href} {...attributes}>
            <img className="d-block" src={src} alt={alt} width={width} height={height} />
        </a>
    );
}

LinkedLogo.propTypes = {
    href: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.any.isRequired,
    height: PropTypes.any.isRequired
};

LinkedLogo.defaultProps = {
    width: 60,
    height: 60
}

export { LinkedLogo, Logo };
export default Logo;
