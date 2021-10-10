import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

// Local Components
import { LinkedLogo, Logo } from './Logo';

// Assets
import pattern from '../assets/footer_background.png';

class DesktopFooter extends React.Component {
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
                    <a key={`${type}-${content}`} className="text-white pe-4 text-decoration-none" href={href}>{content}</a>
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
            <nav className="navbar navbar-expand-lg navbar-light bg-brand py-0">
                <div className="container-fluid me-4 pe-4">
                    <a className="navbar-brand ps-4" href="#">
                        {logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} />}
                    </a>
                    {this.renderMainMenu()}
                </div>
                <img src={pattern} alt={null} className="img-fluid h-100" style={{ width: '40%', height: '100%' }}/>
            </nav>
        );
    }
}

DesktopFooter.propTypes = {
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

DesktopFooter.defaultProps = {
    mainMenu: [],
    logo: null,
    logoAltText: null,
    logoDestination: null,
};

export default injectIntl(DesktopFooter);
