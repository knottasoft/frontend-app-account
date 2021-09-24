import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Hyperlink } from '@edx/paragon';

// Actions
import {
  deleteAccount,
  deleteAccountConfirmation,
  deleteAccountFailure,
  deleteAccountReset,
  deleteAccountCancel,
} from './data/actions';

// Messages
import messages from './messages';

// Components
import ConnectedConfirmationModal from './ConfirmationModal';
import PrintingInstructions from './PrintingInstructions';
import ConnectedSuccessModal from './SuccessModal';
import BeforeProceedingBanner from './BeforeProceedingBanner';

import iconInfo from "../../assets/icon-info.svg"
import iconWarning from "../../assets/icon-warning.svg"

export class DeleteAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
    };
  }

  handleSubmit = () => {
    if (this.state.password === '') {
      this.props.deleteAccountFailure('empty-password');
    } else {
      this.props.deleteAccount(this.state.password);
    }
  };

  handleCancel = () => {
    this.setState({ password: '' });
    this.props.deleteAccountCancel();
  };

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value.trim() });
    this.props.deleteAccountReset();
  };

  handleFinalClose = () => {
    global.location = getConfig().LOGOUT_URL;
  };

  render() {
    const {
      hasLinkedTPA, isVerifiedAccount, status, errorType, intl,
    } = this.props;
    const canDelete = isVerifiedAccount && !hasLinkedTPA;

    // TODO: We lack a good way of providing custom language for a particular site.  This is a hack
    // to allow edx.org to fulfill its business requirements.
    const deleteAccountText2MessageKey = getConfig().SITE_NAME === 'edX'
      ? 'account.settings.delete.account.text.2.edX'
      : 'account.settings.delete.account.text.2';

    return (
      <div>
          <h2 className="section-heading mb-4">
              <span className="pe-1">😢</span> {intl.formatMessage(messages['account.settings.delete.account.header'])}
          </h2>
          <p>{intl.formatMessage(messages['account.settings.delete.account.subheader'])}</p>

          <ul className="list-inline d-flex align-items-center mt-4">
              <li className="list-inline-item"><img src={iconInfo} alt={null} /></li>
              <li className="list-inline-item"><li className="list-inline-item">
                  <strong>
                      {intl.formatMessage(messages['account.settings.delete.account.text.1.title'])}
                  </strong>
              </li></li>
          </ul>
          <div className="bg-light pt-4 px-4 pb-2 mb-4">
              <p>
                  {intl.formatMessage(
                      messages['account.settings.delete.account.text.1'],
                      { siteName: getConfig().SITE_NAME },
                  )}
              </p>
              <p>
                  {intl.formatMessage(
                      messages[deleteAccountText2MessageKey],
                      { siteName: getConfig().SITE_NAME },
                  )}
              </p>
              <p>
                  <PrintingInstructions />
              </p>
          </div>

          <ul className="list-inline d-flex align-items-center">
              <li className="list-inline-item"><img src={iconWarning} alt={null} /></li>
              <li className="list-inline-item">
                  <strong>
                      {intl.formatMessage(messages['account.settings.delete.account.title.warning'])}
                  </strong>
              </li>
          </ul>
          <div className="bg-alert-brand pt-4 px-4 pb-2 mb-4">
              <p>
                  {intl.formatMessage(messages['account.settings.delete.account.text.warning'],
                      { siteName: getConfig().SITE_NAME })}
              </p>
          </div>

          <ul className="list-inline d-flex align-items-center">
              {isVerifiedAccount ? null : (
                  <li className="list-inline-item">
                      <BeforeProceedingBanner
                          instructionMessageId="account.settings.delete.account.please.activate"
                          supportArticleUrl="https://support.edx.org/hc/en-us/articles/115000940568-How-do-I-activate-my-account-"
                      />
                  </li>
              )}

              {hasLinkedTPA ? (
                  <li className="list-inline-item">
                      <BeforeProceedingBanner
                          instructionMessageId="account.settings.delete.account.please.unlink"
                          supportArticleUrl="https://support.edx.org/hc/en-us/articles/207206067"
                      />
                  </li>
              ) : null}
          </ul>

          <div className="d-flex justify-content-center flex-column align-content-stretch">
              <Button
                  variant="danger"
                  onClick={canDelete ? this.props.deleteAccountConfirmation : null}
                  disabled={!canDelete}
              >
                  {intl.formatMessage(messages['account.settings.delete.account.button'])}
              </Button>
          </div>

          <div className="mt-4 text-center">
              <Hyperlink destination="https://support.edx.org/hc/en-us/sections/115004139268-Manage-Your-Account-Settings">
                  {intl.formatMessage(messages['account.settings.delete.account.text.change.instead'])}
              </Hyperlink>
          </div>

          <ConnectedConfirmationModal
              status={status}
              errorType={errorType}
              onSubmit={this.handleSubmit}
              onCancel={this.handleCancel}
              onChange={this.handlePasswordChange}
              password={this.state.password}
          />
          <ConnectedSuccessModal status={status} onClose={this.handleFinalClose} />
      </div>
    );
  }
}

DeleteAccount.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  deleteAccountConfirmation: PropTypes.func.isRequired,
  deleteAccountFailure: PropTypes.func.isRequired,
  deleteAccountReset: PropTypes.func.isRequired,
  deleteAccountCancel: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['confirming', 'pending', 'deleted', 'failed']),
  errorType: PropTypes.oneOf(['empty-password', 'server']),
  hasLinkedTPA: PropTypes.bool,
  isVerifiedAccount: PropTypes.bool,
  intl: intlShape.isRequired,
};

DeleteAccount.defaultProps = {
  hasLinkedTPA: false,
  isVerifiedAccount: true,
  status: null,
  errorType: null,
};

// Assume we're part of the accountSettings state.
const mapStateToProps = state => state.accountSettings.deleteAccount;

export default connect(
  mapStateToProps,
  {
    deleteAccount,
    deleteAccountConfirmation,
    deleteAccountFailure,
    deleteAccountReset,
    deleteAccountCancel,
  },
)(injectIntl(DeleteAccount));
