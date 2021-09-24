import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

// Local Components
import { LinkedLogo, Logo } from './Logo';

// Assets
import pattern from '../assets/footer_background_vertical.svg';

class MobileFooter extends React.Component {
    constructor(props) { // eslint-disable-line no-useless-constructor
        super(props);
    }

    renderMainMenu() {
        const { mainMenu } = this.props;

        // Nodes are accepted as a prop
        if (!Array.isArray(mainMenu)) {
            return mainMenu;
        }

        return mainMenu.map((menuItem) => {
            const {
                type,
                href,
                content,
            } = menuItem;

            if (type === 'item') {
                return (
                    <a key={`${type}-${content}`} className="text-white text-decoration-none mb-4" href={href}>{content}</a>
                );
            }
        });
    }

    render() {
        const {
            logo,
            logoAltText,
            logoDestination,
        } = this.props;
        const logoProps = { src: logo, alt: logoAltText, href: logoDestination };

        return (
            <nav className="navbar navbar-expand-sm bg-brand d-flex flex-row justify-content-between py-0 bg-black">
                <div className="">
                    <img src={pattern} alt={null} className="img-fluid h-100" />
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    {logoDestination === null ? <Logo className="logo my-4" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo my-4" {...logoProps} />}
                    {this.renderMainMenu()}
                </div>
                <div className="">
                    <img src={pattern} alt={null} className="img-fluid h-100" />
                </div>
            </nav>
        );
    }
}

MobileFooter.propTypes = {
    mainMenu: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.array,
    ]),
    logo: PropTypes.string,
    logoAltText: PropTypes.string,
    logoDestination: PropTypes.string,
    // i18n
    intl: intlShape.isRequired,
};

MobileFooter.defaultProps = {
    mainMenu: [],
    logo: null,
    logoAltText: null,
    logoDestination: null,
};

export default injectIntl(MobileFooter);
