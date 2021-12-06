import { AppContext } from '@edx/frontend-platform/react';
import { getConfig, history, getQueryParameters } from '@edx/frontend-platform';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';
import findIndex from 'lodash.findindex';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import {
  injectIntl,
  intlShape,
  FormattedMessage,
  getCountryList,
  getLanguageList,
} from '@edx/frontend-platform/i18n';

import { Button, Alert} from 'react-bootstrap';

import {
  Hyperlink, Icon,
} from '@edx/paragon';

import { CheckCircle, Error, WarningFilled } from '@edx/paragon/icons';

import messages from './AccountSettingsPage.messages';
import { fetchSettings, saveSettings, updateDraft } from './data/actions';
import { accountSettingsPageSelector } from './data/selectors';
import PageLoading from './PageLoading';
import JumpNav from './JumpNav';
import DeleteAccount from './delete-account';
import EditableField from './EditableField';
import ResetPassword from './reset-password';
import ThirdPartyAuth from './third-party-auth';
import BetaLanguageBanner from './BetaLanguageBanner';
import EmailField from './EmailField';
import OneTimeDismissibleAlert from './OneTimeDismissibleAlert';
import {
  YEAR_OF_BIRTH_OPTIONS,
  EDUCATION_LEVELS,
  GENDER_OPTIONS,
  COUNTRY_WITH_STATES,
  getStatesList,
} from './data/constants';
import { fetchSiteLanguages } from './site-language';
import CoachingToggle from './coaching/CoachingToggle';
import DemographicsSection from './demographics/DemographicsSection';
import DocumentList from "./documents/DocumentList";
import {getStudentDocuments, getStudentDocumentTypes} from "./documents/data/actions";

class DesktopAccountSettingsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    // If there is a "duplicate_provider" query parameter, that's the backend's
    // way of telling us that the provider account the user tried to link is already linked
    // to another user account on the platform. We use this to display a message to that effect,
    // and remove the parameter from the URL.
    const duplicateTpaProvider = getQueryParameters().duplicate_provider;
    if (duplicateTpaProvider !== undefined) {
      history.replace(history.location.pathname);
    }
    this.state = {
      duplicateTpaProvider,
    };

    this.navLinkRefs = {
      '#basic-information': React.createRef(),
      '#profile-information': React.createRef(),
      '#demographics-information': React.createRef(),
      '#social-media': React.createRef(),
      '#site-preferences': React.createRef(),
      '#linked-accounts': React.createRef(),
      '#delete-account': React.createRef(),
    };
  }

  componentDidMount() {
    this.props.fetchSettings();
    this.props.fetchSiteLanguages();
    this.props.getStudentDocuments();
    this.props.getStudentDocumentTypes();
    sendTrackingLogEvent('edx.user.settings.viewed', {
      page: 'account',
      visibility: null,
      user_id: this.context.authenticatedUser.userId,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !prevProps.loaded && this.props.loaded) {
      const locationHash = global.location.hash;
      // Check for the locationHash in the URL and then scroll to it if it is in the
      // NavLinks list
      if (typeof locationHash !== 'string') {
        return;
      }
      if (Object.keys(this.navLinkRefs).includes(locationHash) && this.navLinkRefs[locationHash].current) {
        window.scrollTo(0, this.navLinkRefs[locationHash].current.offsetTop);
      }
    }
  }

  // NOTE: We need 'locale' for the memoization in getLocalizedTimeZoneOptions.  Don't remove it!
  // eslint-disable-next-line no-unused-vars
  getLocalizedTimeZoneOptions = memoize((timeZoneOptions, countryTimeZoneOptions, locale) => {
    const concatTimeZoneOptions = [{
      label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.default']),
      value: '',
    }];
    if (countryTimeZoneOptions.length) {
      concatTimeZoneOptions.push({
        label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.country']),
        group: countryTimeZoneOptions,
      });
    }
    concatTimeZoneOptions.push({
      label: this.props.intl.formatMessage(messages['account.settings.field.time.zone.all']),
      group: timeZoneOptions,
    });
    return concatTimeZoneOptions;
  });

  getLocalizedOptions = memoize((locale, country) => ({
    countryOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.country.options.empty']),
    }].concat(getCountryList(locale).map(({ code, name }) => ({ value: code, label: name }))),
    stateOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.state.options.empty']),
    }].concat(getStatesList(country)),
    languageProficiencyOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.language_proficiencies.options.empty']),
    }].concat(getLanguageList(locale).map(({ code, name }) => ({ value: code, label: name }))),
    yearOfBirthOptions: [{
      value: '',
      label: this.props.intl.formatMessage(messages['account.settings.field.year_of_birth.options.empty']),
    }].concat(YEAR_OF_BIRTH_OPTIONS),
    educationLevelOptions: EDUCATION_LEVELS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.education.levels.${key || 'empty'}`]),
    })),
    genderOptions: GENDER_OPTIONS.map(key => ({
      value: key,
      label: this.props.intl.formatMessage(messages[`account.settings.field.gender.options.${key || 'empty'}`]),
    })),
  }));

  sortDates = (a, b) => {
    const aTimeSinceEpoch = new Date(a).getTime();
    const bTimeSinceEpoch = new Date(b).getTime();

    return bTimeSinceEpoch - aTimeSinceEpoch;
  }

  sortVerifiedNameRecords = verifiedNameHistory => {
    if (Array.isArray(verifiedNameHistory)) {
      return [...verifiedNameHistory].sort(this.sortDates);
    }

    return [];
  }

  handleEditableFieldChange = (name, value) => {
    this.props.updateDraft(name, value);
  }

  handleSubmit = (formId, values) => {
    this.props.saveSettings(formId, values);
  }

  isEditable(fieldName) {
    return !this.props.staticFields.includes(fieldName);
  }

  isManagedProfile() {
    // Enterprise customer profiles are managed by their organizations. We determine whether
    // a profile is managed or not by the presence of the profileDataManager prop.
    return Boolean(this.props.profileDataManager);
  }

  renderDuplicateTpaProviderMessage() {
    if (!this.state.duplicateTpaProvider) {
      return null;
    }

    return (
      <div>
        <Alert variant="danger">
          <FormattedMessage
            id="account.settings.message.duplicate.tpa.provider"
            defaultMessage="The {provider} account you selected is already linked to another {siteName} account."
            description="alert message informing the user that the third-party account they attempted to link is already linked to another account"
            values={{
              provider: <b>{this.state.duplicateTpaProvider}</b>,
              siteName: getConfig().SITE_NAME,
            }}
          />
        </Alert>
      </div>
    );
  }

  renderManagedProfileMessage() {
    if (!this.isManagedProfile()) {
      return null;
    }

    return (
      <div>
        <Alert variant="info">
          <FormattedMessage
            id="account.settings.message.managed.settings"
            defaultMessage="Your profile settings are managed by {managerTitle}. Contact your administrator or {support} for help."
            description="alert message informing the user their account data is managed by a third party"
            values={{
              managerTitle: <b>{this.props.profileDataManager}</b>,
              support: (
                <Hyperlink destination={getConfig().SUPPORT_URL} target="_blank">
                  <FormattedMessage
                    id="account.settings.message.managed.settings.support"
                    defaultMessage="support"
                    description="website support"
                  />
                </Hyperlink>
              ),
            }}
          />
        </Alert>
      </div>
    );
  }

  renderVerifiedNameSuccessMessage = () => (
    <OneTimeDismissibleAlert
      id="dismissedVerifiedNameSuccessMessage"
      variant="success"
      icon={CheckCircle}
      header={this.props.intl.formatMessage(messages['account.settings.field.name.verified.success.message.header'])}
      body={this.props.intl.formatMessage(messages['account.settings.field.name.verified.success.message'])}
    />
  )

  renderVerifiedNameFailureMessage = (verifiedName, created) => {
    const dateValue = new Date(created).valueOf();
    const id = `dismissedVerifiedNameFailureMessage-${verifiedName}-${dateValue}`;

    return (
      <OneTimeDismissibleAlert
        id={id}
        variant="danger"
        icon={Error}
        header={this.props.intl.formatMessage(messages['account.settings.field.name.verified.failure.message.header'])}
        body={
          (
            <>
              <div className="d-flex flex-row">
                {this.props.intl.formatMessage(
                  messages['account.settings.field.name.verified.failure.message'], {
                    verifiedName,
                  },
                )}
              </div>
              <div className="d-flex flex-row-reverse mt-3">
                <Button
                  variant="primary"
                  href="https://support.edx.org/hc/en-us/articles/360004381594-Why-was-my-ID-verification-denied"
                >
                  {this.props.intl.formatMessage(messages['account.settings.field.name.verified.failure.message.help.link'])}
                </Button>{' '}
              </div>
            </>
          )
        }
      />
    );
  }

  renderVerifiedNameSubmittedMessage = () => (
    <Alert
      variant="warning"
      icon={WarningFilled}
    >
      <Alert.Heading>
        {this.props.intl.formatMessage(messages['account.settings.field.name.verified.submitted.message.header'])}
      </Alert.Heading>
      <p>
        {this.props.intl.formatMessage(messages['account.settings.field.name.verified.submitted.message'])}
      </p>
    </Alert>
  )

  renderVerifiedNameMessage = verifiedNameRecord => {
    const { created, status, verified_name: verifiedName } = verifiedNameRecord;

    switch (status) {
      case 'approved':
        return this.renderVerifiedNameSuccessMessage();
      case 'denied':
        return this.renderVerifiedNameFailureMessage(verifiedName, created);
      case 'submitted':
        return this.renderVerifiedNameSubmittedMessage();
      default:
        return null;
    }
  }

  renderVerifiedNameIcon = (status) => {
    switch (status) {
      case 'approved':
        return (<Icon src={CheckCircle} className="ml-1" style={{ height: '18px', width: '18px', color: 'green' }} />);
      case 'submitted':
        return (<Icon src={WarningFilled} className="ml-1" style={{ height: '18px', width: '18px', color: 'yellow' }} />);
      default:
        return null;
    }
  }

  renderVerifiedNameHelpText = (status) => {
    switch (status) {
      case 'approved':
        return (this.props.intl.formatMessage(messages['account.settings.field.name.verified.help.text.verified']));
      case 'submitted':
        return (this.props.intl.formatMessage(messages['account.settings.field.name.verified.help.text.submitted']));
      default:
        return null;
    }
  }

  renderFullNameHelpText = (status) => {
    switch (status) {
      case 'submitted':
        return (this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text.submitted']));
      default:
        return (this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text']));
    }
  }

  renderEmptyStaticFieldMessage() {
    if (this.isManagedProfile()) {
      return this.props.intl.formatMessage(messages['account.settings.static.field.empty'], {
        enterprise: this.props.profileDataManager,
      });
    }
    return this.props.intl.formatMessage(messages['account.settings.static.field.empty.no.admin']);
  }

  renderSecondaryEmailField(editableFieldProps) {
    if (!this.props.formValues.secondary_email_enabled) {
      return null;
    }

    return (
      <EmailField
        name="secondary_email"
        label={this.props.intl.formatMessage(messages['account.settings.field.secondary.email'])}
        emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.secondary.email.empty'])}
        value={this.props.formValues.secondary_email}
        confirmationMessageDefinition={messages['account.settings.field.secondary.email.confirmation']}
        {...editableFieldProps}
      />
    );
  }

  renderDemographicsSection() {
    // check the result of an LMS API call to determine if we should render the DemographicsSection component
    if (this.props.formValues.shouldDisplayDemographicsSection) {
      return (
        <DemographicsSection forwardRef={this.navLinkRefs['#demographics-information']} />
      );
    }
    return null;
  }

  renderContent() {
    const editableFieldProps = {
      onChange: this.handleEditableFieldChange,
      onSubmit: this.handleSubmit,
    };

    // Memoized options lists
    const {
      countryOptions,
      stateOptions,
      languageProficiencyOptions,
      yearOfBirthOptions,
      educationLevelOptions,
      genderOptions,
    } = this.getLocalizedOptions(this.context.locale, this.props.formValues.country);

    // Show State field only if the country is US (could include Canada later)
    const showState = this.props.formValues.country === COUNTRY_WITH_STATES;

    const { verifiedName } = this.props.formValues;
    const verifiedNameEnabled = this.props.formValues.verifiedNameHistory.verified_name_enabled;

    const timeZoneOptions = this.getLocalizedTimeZoneOptions(
      this.props.timeZoneOptions,
      this.props.countryTimeZoneOptions,
      this.context.locale,
    );

    const hasLinkedTPA = findIndex(this.props.tpaProviders, provider => provider.connected) >= 0;
    return (
      <>
        <div className="account-section" id="basic-information" ref={this.navLinkRefs['#basic-information']}>
          {verifiedNameEnabled && this.renderVerifiedNameMessage(this.props.formValues.mostRecentVerifiedName)}

          <div className="mb-4">
            <h2 className="section-heading">
              <span className="pe-1">🤖</span> {this.props.intl.formatMessage(messages['account.settings.section.account.information'])}
            </h2>
            <p className="text-secondary">{this.props.intl.formatMessage(messages['account.settings.section.account.information.description'])}</p>
          </div>

          {this.renderManagedProfileMessage()}
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EditableField
                  name="username"
                  type="text"
                  value={this.props.formValues.username}
                  label={this.props.intl.formatMessage(messages['account.settings.field.username'])}
                  helpText={this.props.intl.formatMessage(
                      messages['account.settings.field.username.help.text'],
                      { siteName: getConfig().SITE_NAME },
                  )}
                  isEditable={false}
                  {...editableFieldProps}
              />
            </div>
            <div className="col-6 pe-4">
              <EditableField
                  name="name"
                  type="text"
                  value={this.props.formValues.name}
                  label={this.props.intl.formatMessage(messages['account.settings.field.full.name'])}
                  emptyLabel={
                    this.isEditable('name')
                        ? this.props.intl.formatMessage(messages['account.settings.field.full.name.empty'])
                        : this.renderEmptyStaticFieldMessage()
                  }
                  helpText={
                    verifiedNameEnabled && verifiedName
                        ? this.renderFullNameHelpText(verifiedName.status)
                        : this.props.intl.formatMessage(messages['account.settings.field.full.name.help.text'])
                  }
                  isEditable={
                    verifiedNameEnabled && verifiedName
                        ? this.isEditable('verifiedName') && this.isEditable('name')
                        : this.isEditable('name')
                  }
                  isGrayedOut={
                    verifiedNameEnabled && verifiedName && !this.isEditable('verifiedName')
                  }
                  {...editableFieldProps}
              />
            </div>
          </div>
          {verifiedNameEnabled && verifiedName
            && (
            <EditableField
              name="verifiedName"
              type="text"
              value={this.props.formValues.verifiedName.verified_name}
              label={
                (
                  <div className="d-flex">
                    {this.props.intl.formatMessage(messages['account.settings.field.name.verified'])}
                    {
                      this.renderVerifiedNameIcon(verifiedName.status)
                    }
                  </div>
                )
              }
              helpText={this.renderVerifiedNameHelpText(verifiedName.status)}
              isEditable={this.isEditable('verifiedName')}
              isGrayedOut={!this.isEditable('verifiedName')}
              {...(this.isEditable('verifiedName') && editableFieldProps)}
            />
            )}
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EmailField
                  name="email"
                  label={this.props.intl.formatMessage(messages['account.settings.field.email'])}
                  emptyLabel={
                    this.isEditable('email')
                        ? this.props.intl.formatMessage(messages['account.settings.field.email.empty'])
                        : this.renderEmptyStaticFieldMessage()
                  }
                  value={this.props.formValues.email}
                  confirmationMessageDefinition={messages['account.settings.field.email.confirmation']}
                  helpText={this.props.intl.formatMessage(
                      messages['account.settings.field.email.help.text'],
                      { siteName: getConfig().SITE_NAME },
                  )}
                  isEditable={this.isEditable('email')}
                  {...editableFieldProps}
              />
              {this.renderSecondaryEmailField(editableFieldProps)}
            </div>
            <div className="col-6">
              <ResetPassword email={this.props.formValues.email} />
            </div>
          </div>
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EditableField
                  name="year_of_birth"
                  type="select"
                  label={this.props.intl.formatMessage(messages['account.settings.field.dob'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.dob.empty'])}
                  value={this.props.formValues.year_of_birth}
                  options={yearOfBirthOptions}
                  {...editableFieldProps}
              />
            </div>
            <div className="col-6 pe-4">
              <EditableField
                  name="country"
                  type="select"
                  value={this.props.formValues.country}
                  options={countryOptions}
                  label={this.props.intl.formatMessage(messages['account.settings.field.country'])}
                  emptyLabel={
                    this.isEditable('country')
                        ? this.props.intl.formatMessage(messages['account.settings.field.country.empty'])
                        : this.renderEmptyStaticFieldMessage()
                  }
                  isEditable={this.isEditable('country')}
                  {...editableFieldProps}
              />
              {showState
              && (
                  <EditableField
                      name="state"
                      type="select"
                      value={this.props.formValues.state}
                      options={stateOptions}
                      label={this.props.intl.formatMessage(messages['account.settings.field.state'])}
                      emptyLabel={
                        this.isEditable('state')
                            ? this.props.intl.formatMessage(messages['account.settings.field.state.empty'])
                            : this.renderEmptyStaticFieldMessage()
                      }
                      isEditable={this.isEditable('state')}
                      {...editableFieldProps}
                  />
              )}
            </div>
          </div>
        </div>
        <hr className="mt-2 mb-3"/>
        <div className="account-section" id="profile-information" ref={this.navLinkRefs['#profile-information']}>
          <div className="mb-4">
            <h2 className="section-heading">
              <span className="pe-1">👤</span> {this.props.intl.formatMessage(messages['account.settings.section.profile.information'])}
            </h2>
          </div>
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EditableField
                  name="level_of_education"
                  type="select"
                  value={this.props.formValues.level_of_education}
                  options={educationLevelOptions}
                  label={this.props.intl.formatMessage(messages['account.settings.field.education'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.education.empty'])}
                  {...editableFieldProps}
              />
            </div>
            <div className="col-6 pe-4">
              <EditableField
                  name="gender"
                  type="select"
                  value={this.props.formValues.gender}
                  options={genderOptions}
                  label={this.props.intl.formatMessage(messages['account.settings.field.gender'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.gender.empty'])}
                  {...editableFieldProps}
              />
            </div>
          </div>
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EditableField
                  name="language_proficiencies"
                  type="select"
                  value={this.props.formValues.language_proficiencies}
                  options={languageProficiencyOptions}
                  label={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.language.proficiencies.empty'])}
                  {...editableFieldProps}
              />
              {getConfig().COACHING_ENABLED
              && this.props.formValues.coaching.eligible_for_coaching
              && (
                  <CoachingToggle
                      name="coaching"
                      phone_number={this.props.formValues.phone_number}
                      coaching={this.props.formValues.coaching}
                  />
              )}
            </div>
          </div>

        </div>
        <hr className="mt-2 mb-3"/>
        {getConfig().ENABLE_DEMOGRAPHICS_COLLECTION && this.renderDemographicsSection()}
        <div className="account-section" id="social-media">
          <div className="mb-4">
            <h2 className="section-heading">
              <span className="pe-1">📱</span>{this.props.intl.formatMessage(messages['account.settings.section.social.media'])}
            </h2>
            <p className="text-secondary">
              {this.props.intl.formatMessage(
                  messages['account.settings.section.social.media.description'],
                  { siteName: getConfig().SITE_NAME },
              )}
            </p>
          </div>
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EditableField
                  name="social_link_linkedin"
                  type="text"
                  value={this.props.formValues.social_link_linkedin}
                  label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.linkedin.empty'])}
                  {...editableFieldProps}
              />
            </div>
            <div className="col-6 pe-4">
              <EditableField
                  name="social_link_facebook"
                  type="text"
                  value={this.props.formValues.social_link_facebook}
                  label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.facebook'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.facebook.empty'])}
                  {...editableFieldProps}
              />
            </div>
          </div>
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EditableField
                  name="social_link_twitter"
                  type="text"
                  value={this.props.formValues.social_link_twitter}
                  label={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.twitter'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.social.platform.name.twitter.empty'])}
                  {...editableFieldProps}
              />
            </div>
          </div>

        </div>
        <hr className="mt-2 mb-3"/>
        <div className="account-section" id="site-preferences" ref={this.navLinkRefs['#site-preferences']}>
          <div className="mb-4">
            <h2 className="section-heading">
              <span className="pe-1">⚙</span>️{this.props.intl.formatMessage(messages['account.settings.section.site.preferences'])}
            </h2>
          </div>
          <BetaLanguageBanner />
          <div className="hstack gap-2 align-items-stretch">
            <div className="col-6 pe-4">
              <EditableField
                  name="siteLanguage"
                  type="select"
                  options={this.props.siteLanguageOptions}
                  value={this.props.siteLanguage.draft !== undefined ? this.props.siteLanguage.draft : this.context.locale}
                  label={this.props.intl.formatMessage(messages['account.settings.field.site.language'])}
                  helpText={this.props.intl.formatMessage(messages['account.settings.field.site.language.help.text'])}
                  {...editableFieldProps}
              />
            </div>
            <div className="col-6 pe-4">
              <EditableField
                  name="time_zone"
                  type="select"
                  value={this.props.formValues.time_zone}
                  options={timeZoneOptions}
                  label={this.props.intl.formatMessage(messages['account.settings.field.time.zone'])}
                  emptyLabel={this.props.intl.formatMessage(messages['account.settings.field.time.zone.empty'])}
                  helpText={this.props.intl.formatMessage(messages['account.settings.field.time.zone.description'])}
                  {...editableFieldProps}
                  onSubmit={(formId, value) => {
                    // the endpoint will not accept an empty string. it must be null
                    this.handleSubmit(formId, value || null);
                  }}
              />
            </div>
          </div>
        </div>
        <hr className="mt-2 mb-3"/>
        <div className="account-section" id="linked-accounts" ref={this.navLinkRefs['#linked-accounts']}>
          <div className="mb-4">
            <h2 className="section-heading">
              <span className="pe-1">🔗</span>{this.props.intl.formatMessage(messages['account.settings.section.linked.accounts'])}
            </h2>
            <p className="text-secondary">
              {this.props.intl.formatMessage(
                  messages['account.settings.section.linked.accounts.description'],
                  { siteName: getConfig().SITE_NAME },
              )}
            </p>
          </div>
          <ThirdPartyAuth />
        </div>
        <hr className="mt-2 mb-3"/>

        <div className="account-section" id="documents" ref={this.navLinkRefs['#documents']}>
          <div className="mb-4">
            <h2 className="section-heading">
              <span className="pe-1">📄</span>{this.props.intl.formatMessage(messages['account.settings.section.documents'])}
            </h2>
          </div>
          <DocumentList/>
        </div>
        <hr className="mt-2 mb-3"/>
        <div className="account-section" id="delete-account" ref={this.navLinkRefs['#delete-account']}>
          <DeleteAccount
            isVerifiedAccount={this.props.isActive}
            hasLinkedTPA={hasLinkedTPA}
          />
        </div>

      </>
    );
  }

  renderError() {
    return (
      <div>
        {this.props.intl.formatMessage(messages['account.settings.loading.error'], {
          error: this.props.loadingError,
        })}
      </div>
    );
  }

  renderLoading() {
    return (
      <PageLoading srMessage={this.props.intl.formatMessage(messages['account.settings.loading.message'])} />
    );
  }

  render() {
    const {
      intl,
      loading,
      loaded,
      loadingError,
    } = this.props;

    const dashboard_url = `${getConfig().LMS_BASE_URL}/dashboard`;

    return (
      <div className="page__account-settings container-fluid py-5">
        {this.renderDuplicateTpaProviderMessage()}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb ps-4">
            <li className="breadcrumb-item"><a href={dashboard_url}>{intl.formatMessage(messages['account.settings.page.breadcrumb.prev'])}</a></li>
            <li className="breadcrumb-item active" aria-current="page">{intl.formatMessage(messages['account.settings.page.breadcrumb.current'])}</li>
          </ol>
        </nav>
        <h2 className="mb-4 ps-4">
          {this.props.intl.formatMessage(messages['account.settings.page.heading'])}
        </h2>
        <hr className="mt-2 mb-3"/>
        <div className="ps-4">
          <div className="row">
            <div className="col-md-9">
              {loading ? this.renderLoading() : null}
              {loaded ? this.renderContent() : null}
              {loadingError ? this.renderError() : null}
            </div>
            <div className="col-md-3">
              <JumpNav
                  displayDemographicsLink={this.props.formValues.shouldDisplayDemographicsSection}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DesktopAccountSettingsPage.contextType = AppContext;

DesktopAccountSettingsPage.propTypes = {
  intl: intlShape.isRequired,
  loading: PropTypes.bool,
  loaded: PropTypes.bool,
  loadingError: PropTypes.string,

  // Form data
  formValues: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    secondary_email: PropTypes.string,
    secondary_email_enabled: PropTypes.bool,
    year_of_birth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    country: PropTypes.string,
    level_of_education: PropTypes.string,
    gender: PropTypes.string,
    language_proficiencies: PropTypes.string,
    phone_number: PropTypes.string,
    social_link_linkedin: PropTypes.string,
    social_link_facebook: PropTypes.string,
    social_link_twitter: PropTypes.string,
    time_zone: PropTypes.string,
    coaching: PropTypes.shape({
      coaching_consent: PropTypes.bool.isRequired,
      user: PropTypes.number.isRequired,
      eligible_for_coaching: PropTypes.bool.isRequired,
    }),
    state: PropTypes.string,
    shouldDisplayDemographicsSection: PropTypes.bool,
    verifiedNameHistory: PropTypes.shape({
      verified_name_enabled: PropTypes.bool,
      use_verified_name_for_certs: PropTypes.bool,
      results: PropTypes.arrayOf(
        PropTypes.shape({
          verified_name: PropTypes.string,
          status: PropTypes.string,
        }),
      ),
    }),
    verifiedName: PropTypes.shape({
      verified_name: PropTypes.string,
      status: PropTypes.string,
    }),
    mostRecentVerifiedName: PropTypes.shape({
      verified_name: PropTypes.string,
      status: PropTypes.string,
    }),
  }).isRequired,
  siteLanguage: PropTypes.shape({
    previousValue: PropTypes.string,
    draft: PropTypes.string,
  }),
  siteLanguageOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  profileDataManager: PropTypes.string,
  staticFields: PropTypes.arrayOf(PropTypes.string),
  isActive: PropTypes.bool,
  secondary_email_enabled: PropTypes.bool,

  timeZoneOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  countryTimeZoneOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  fetchSiteLanguages: PropTypes.func.isRequired,
  updateDraft: PropTypes.func.isRequired,
  saveSettings: PropTypes.func.isRequired,
  fetchSettings: PropTypes.func.isRequired,
  tpaProviders: PropTypes.arrayOf(PropTypes.object),
};

DesktopAccountSettingsPage.defaultProps = {
  loading: false,
  loaded: false,
  loadingError: null,
  siteLanguage: null,
  siteLanguageOptions: [],
  timeZoneOptions: [],
  countryTimeZoneOptions: [],
  profileDataManager: null,
  staticFields: [],
  tpaProviders: [],
  isActive: true,
  secondary_email_enabled: false,
};

export default connect(accountSettingsPageSelector, {
  fetchSettings,
  saveSettings,
  updateDraft,
  fetchSiteLanguages,
  getStudentDocuments,
  getStudentDocumentTypes,
})(injectIntl(DesktopAccountSettingsPage));
