import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { NavHashLink } from 'react-router-hash-link';
import Scrollspy from 'react-scrollspy';

import { getConfig } from '@edx/frontend-platform';
import {
    Card
} from 'react-bootstrap';

import PropTypes from 'prop-types';
import messages from './AccountSettingsPage.messages';

function JumpNav({ intl, displayDemographicsLink }) {
  return (
    <div className="menu sticky-top p-3 me-4 bg-light">
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
        // TODO: Перевод
        <li className="py-2">
          <NavHashLink to="#documents" className="text-decoration-none">
            Документы
          </NavHashLink>
        </li>
        <li className="py-2">
          <NavHashLink to="#delete-account" className="text-decoration-none">
            {intl.formatMessage(messages['account.settings.jump.nav.delete.account'])}
          </NavHashLink>
        </li>
      </div>
    </div>
  );
}

JumpNav.propTypes = {
  intl: intlShape.isRequired,
  displayDemographicsLink: PropTypes.bool.isRequired,
};

export default injectIntl(JumpNav);
