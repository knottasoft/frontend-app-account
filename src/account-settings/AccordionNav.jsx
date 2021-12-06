import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';
import { Accordion } from "react-bootstrap";
import { getConfig } from '@edx/frontend-platform';

import PropTypes from 'prop-types';
import messages from './AccountSettingsPage.messages';

function AccordionNav({ intl, displayDemographicsLink }) {
    return (
        <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="1">
                <Accordion.Header><strong>{intl.formatMessage(messages['account.settings.page.accordition.title'])}</strong></Accordion.Header>
                <Accordion.Body>
                    <div className="nav flex-column list-unstyled">
                        <li className="py-2">
                            <NavHashLink to="#basic-information" className="text-decoration-none">
                                {intl.formatMessage(messages['account.settings.section.account.information'])}
                            </NavHashLink>
                        </li>
                        <li className="py-2">
                            <NavHashLink to="#profile-information" className="text-decoration-none">
                                {intl.formatMessage(messages['account.settings.section.profile.information'])}
                            </NavHashLink>
                        </li>
                        {getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && displayDemographicsLink
                        && (
                            <li className="py-2">
                                <NavHashLink to="#demographics-information" className="text-decoration-none">
                                    {intl.formatMessage(messages['account.settings.section.demographics.information'])}
                                </NavHashLink>
                            </li>
                        )}
                        <li className="py-2">
                            <NavHashLink to="#social-media" className="text-decoration-none">
                                {intl.formatMessage(messages['account.settings.section.social.media'])}
                            </NavHashLink>
                        </li>
                        <li className="py-2">
                            <NavHashLink to="#site-preferences" className="text-decoration-none">
                                {intl.formatMessage(messages['account.settings.section.site.preferences'])}
                            </NavHashLink>
                        </li>
                        <li className="py-2">
                            <NavHashLink to="#linked-accounts" className="text-decoration-none">
                                {intl.formatMessage(messages['account.settings.section.linked.accounts'])}
                            </NavHashLink>
                        </li>
                        <li className="py-2">
                            <NavHashLink to="#documents" className="text-decoration-none">
                                {intl.formatMessage(messages['account.settings.section.documents'])}
                            </NavHashLink>
                        </li>
                        <li className="py-2">
                            <NavHashLink to="#delete-account" className="text-decoration-none">
                                {intl.formatMessage(messages['account.settings.jump.nav.delete.account'])}
                            </NavHashLink>
                        </li>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>

    );
}

AccordionNav.propTypes = {
    intl: intlShape.isRequired,
    displayDemographicsLink: PropTypes.bool.isRequired
};

export default injectIntl(AccordionNav);
