import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { Button, Card, Image, Icon } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faExclamationCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

class DocumentItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log('DocumentItem handleClick')
        this.props.onClick(this.props.document);
    }

    getStatusIcon() {
        if (this.props.document.status == "n"){
            return ( 
                <div 
                    className="align-self-start" 
                    style={StatusIconVaitStyle}
                    title="На проверке"
                >
                    <FontAwesomeIcon className="mr-1" icon={faClock} />
                </div>
            )
        }
        if (this.props.document.status == "r") {
            return ( 
                <div 
                className="align-self-start" 
                style={StatusIconInvalidStyle}
                title="Не действительный"
                >
                    <FontAwesomeIcon className="mr-1" icon={faExclamationCircle} />
                </div>
            )
        }

        const isExpired = new Date(this.props.document.expiry_date) < Date.now()
        if (isExpired) {
            return ( 
                <div 
                className="align-self-start" 
                style={StatusIconInvalidStyle}
                title="Просрочен"
                >
                    <FontAwesomeIcon className="mr-1" icon={faExclamationCircle} />
                </div>
            )
        }
        
        return (
            <div 
                className="align-self-start" 
                style={StatusIconValidStyle}
                title="Действительный"
            >
                <FontAwesomeIcon className="mr-1" icon={faCheckCircle} />
            </div>
        )
    }

    render () {
        const imageCounter = this.props.document.files.length < 2 ? null :
            (<div className="position-absolute bottom-0 end-0 py-0 px-1 m-0" style={ImageCounterStyle}>{this.props.document.files.length}</div>)

        const statusIcon = this.getStatusIcon()

        return (
            <div className="card mb-3 bg-light me-4">
                <div className="d-flex no-gutters">
                    <div className="p-2 align-self-center">
                        <div className="position-relative">
                            <img src={this.props.document?.files[0]?.thumbnail} className="border border-black" alt="..." style={ImageStyle} />
                            {imageCounter}
                        </div>
                    </div>
                    <div className="ps-0 py-2 d-flex align-self-center">
                        <div className="p-0 card-body">
                            <h6 style={{ fontSize: 16 }}>{this.props.document.name}</h6>
                            <p style={{ fontSize: 12 }}>Добавлено: {this.props.document.date_create.substring(0, 10)}</p>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        { statusIcon }
                        <div className="align-self-end">
                            <Button
                                variant="link"
                                style={EditButtonStyle}
                                onClick={this.handleClick}
                            >
                                <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DocumentItem.propTypes = {
    document: PropTypes.object,
    onClick: PropTypes.func.isRequired,
};

DocumentItem.defaultProps = {
    document: null
}

export default connect ()(injectIntl(DocumentItem));

const CardStyle = {
    borderRadius: '4px',
    background: '#F6F7FA',
    border: '1px solid #EBEBEF',
    boxSizing: 'border-box',

}

const ImageStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '4px',
    objectFit: 'cover',
    zIndex: 1

}

const LabelStyle = {
    font: {
        family: 'Roboto',
        style: 'normal',
        weight: '500',
        size: '14px',
    },
}

const DateStyle = {
    position: 'absolute',
    height: '20px',
    left: '88px',
    top: '43px',

    font: {
        family: 'Roboto',
        style: 'normal',
        weight: 'normal',
        size: '14px',
    },
    line: {height: '140%'},
    color: '#333333',
    flex: 'none',
    order: '1',
    flexGrow: 0
}

const EditButtonStyle = {
    right: '0',
    bottom: '0',
    margin: '12px',
}

const StatusIconValidStyle = {
    right: '0',
    top: '0',
    margin: '12px',
    color: '#553C8B',
}

const StatusIconInvalidStyle = {
    right: '0',
    top: '0',
    margin: '12px',
    color: '#dc3545',
}

const StatusIconVaitStyle = {
    right: '0',
    top: '0',
    margin: '12px',
    color: '#999999',
}

const ImageCounterStyle = {
    background: '#553C8B',
    borderRadius: '4px 0',
    color: 'white',
    fontSize: '12px',
}
