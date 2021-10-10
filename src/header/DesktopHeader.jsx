import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Navbar, Container, Dropdown, DropdownButton, Button} from 'react-bootstrap';

// Local Components
import { Menu, MenuTrigger, MenuContent } from './Menu';
import Avatar from './Avatar';
import { LinkedLogo, Logo } from './Logo';

// i18n
import messages from './Header.messages';

// Assets
import { CaretIcon } from './Icons';

class DesktopHeader extends React.Component {
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
                submenuContent,
            } = menuItem;

            if (type === 'item') {
                return (
                    <li className="nav-item pe-4">
                        <a key={`${type}-${content}`} className="nav-link text-white" href={href}>{content}</a>
                    </li>
                );
            }

            return (
                <Menu key={`${type}-${content}`} tag="div" className="nav-item" respondToPointerEvents>
                    <MenuTrigger tag="a" className="nav-link d-inline-flex align-items-center" href={href}>
                        {content} <CaretIcon role="img" aria-hidden focusable="false" />
                    </MenuTrigger>
                    <MenuContent className="pin-left pin-right shadow py-2">
                        {submenuContent}
                    </MenuContent>
                </Menu>
            );
        });
    }

    renderUserMenu() {
        const {
            userMenu,
            avatar,
            username,
            intl,
        } = this.props;

        const RoundAvatarDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
            <button
                ref={ref}
                className="btn btn-light btn-circle btn-lg d-flex justify-content-center"
                type="button"
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
            intl,
        } = this.props;
        const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
        const logoClasses = getConfig().AUTHN_MINIMAL_HEADER ? 'mw-100' : null;

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-brand">
                <div className="container-fluid">
                    <a className="nav-skip sr-only sr-only-focusable" href="#main">{intl.formatMessage(messages['header.label.skip.nav'])}</a>
                    <a className="navbar-brand ps-4" href="#">
                        {logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} />}
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse d-flex" id="navbarSupportedContent">
                        <ul className="nav navbar-nav mb-2 mb-lg-0 w-100">
                            <li className="nav-item flex-grow-1 px-4">
                                <div className="input-group d-flex align-items-center">
                                    <input className="form-control border-end-0 border rounded-pill"
                                           type="search"
                                           placeholder={intl.formatMessage(messages['header.input.search.placeholder'])}
                                           id="search-input"
                                    />
                                    <span className="input-group-append">
                                        <a
                                            className="btn ms-n5 py-1"
                                            type="button">
                                            <i className="fa fa-search fa-lg" style={{ color: '#553C8B' }}/>
                                        </a>
                                    </span>
                                </div>
                            </li>
                            {this.renderMainMenu()}
                        </ul>
                    </div>
                    <ul className="nav navbar-nav me-4 mb-2 mb-lg-0">
                        <li className="nav nav-item">
                            {loggedIn ? this.renderUserMenu() : this.renderLoggedOutItems()}
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

DesktopHeader.propTypes = {
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

DesktopHeader.defaultProps = {
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

export default injectIntl(DesktopHeader);
