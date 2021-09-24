import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Dropdown} from 'react-bootstrap';

// Local Components
import Avatar from './Avatar';
import { LinkedLogo, Logo } from './Logo';

// i18n
import messages from './Header.messages';

// Assets
import avatar from '../assets/icon-user-mobile.svg'
import menu from '../assets/icon-menu-mobile.svg'

class MobileHeader extends React.Component {
    constructor(props) { // eslint-disable-line no-useless-constructor
        super(props);
    }

    renderMainMenu() {
        const { mainMenu, intl } = this.props;

        // Nodes are accepted as a prop
        if (!Array.isArray(mainMenu)) {
            return mainMenu;
        }

        const MobileDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
            <button
                ref={ref}
                className="m-0 px-3 d-flex bg-primary-dark justify-content-center align-items-center"
                style={{ border: 0 }}
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
            >
                {children}
            </button>
        ));

        return (
            <Dropdown className="btn-group dropstart">
                <Dropdown.Toggle
                    id="dropdown-basic"
                    as={MobileDropdownToggle}
                >
                    <Avatar src={menu} alt="" />
                    {/*<span className="navbar-toggler-icon" />*/}
                    {/*{username}*/}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {mainMenu.map((menuItem) => {
                            const {
                                type,
                                href,
                                content,
                            } = menuItem;

                            if (type === 'item') {
                                return (
                                    <li className="nav-item pe-4">
                                        <a
                                            key={`${type}-${content}`}
                                            className="dropdown-item"
                                            type="button"
                                            href={href}>{content}
                                        </a>
                                    </li>
                                );
                            }
                    })}
                </Dropdown.Menu>
            </Dropdown>
        );

    }

    renderUserMenu() {
        const {
            userMenu,
            username,
            intl,
        } = this.props;

        const RoundAvatarDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
            <button
                ref={ref}
                className="m-0 px-3 d-flex bg-primary-dark justify-content-center align-items-center"
                style={{ border: 0 }}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
                aria-label={intl.formatMessage(messages['header.label.account.menu.for'], { username })}
            >
                {children}
            </button>
        ));


        return (
            <Dropdown className="btn-group dropstart">
                <Dropdown.Toggle
                    id="dropdown-basic"
                    as={RoundAvatarDropdownToggle}
                >
                    <Avatar src={avatar} alt="" />
                    {/*<i className="fa fa-check"/>*/}
                    {/*{username}*/}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {userMenu.map(({ type, href, content }) => (
                        <li>
                            <a
                                className="dropdown-item"
                                type="button"
                                key={`${type}-${content}`}
                                href={href}
                            >{content}
                            </a>
                        </li>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    renderLoggedOutItems() {
        const { loggedOutItems } = this.props;
        return loggedOutItems.map((item, i, arr) => (
            <button
                key={`${item.type}-${item.content}`}
                className={i < arr.length - 1 ? 'btn mr-2 btn-link' : 'btn mr-2 btn-outline-primary'}
                href={item.href}
            >{item.content}
            </button>

        ));
    }

    render() {
        const {
            logo,
            logoAltText,
            logoDestination,
            loggedIn,
        } = this.props;
        const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
        const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;

        return (
            <nav className="navbar bg-brand py-0 d-flex align-items-stretch justify-content-between">
                {this.renderMainMenu()}
                {logoDestination === null ?
                    <Logo className="logo py-2" src={logo} alt={logoAltText} width="40" height="40" /> :
                    <LinkedLogo className="logo p-2" width="40" height="40" {...logoProps} />}
                {loggedIn ? this.renderUserMenu() : this.renderLoggedOutItems()}
            </nav>
        );
    }
}

MobileHeader.propTypes = {
    mainMenu: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.array,
    ]),
    userMenu: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(['item', 'menu']),
        href: PropTypes.string,
        content: PropTypes.string,
    })),
    loggedOutItems: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(['item', 'menu']),
        href: PropTypes.string,
        content: PropTypes.string,
    })),
    logo: PropTypes.string,
    logoAltText: PropTypes.string,
    logoDestination: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string,
    loggedIn: PropTypes.bool,

    // i18n
    intl: intlShape.isRequired,
};

MobileHeader.defaultProps = {
    mainMenu: [],
    userMenu: [],
    loggedOutItems: [],
    logo: null,
    logoAltText: null,
    logoDestination: null,
    avatar: null,
    username: null,
    loggedIn: false,
};

export default injectIntl(MobileHeader);
