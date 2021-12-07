import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import { Button, Card, Image, Icon } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

class DocumentItem extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log('DocumentItem handleClick')
        this.props.onClick(this.props.document);
    }

    render () {
        const imageCounter = this.props.document.files.length < 2 ? null :
            (<div className="position-absolute bottom-0 end-0 py-0 px-1 m-0" style={ImageCounterStyle}>{this.props.document.files.length}</div>)

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

const ImageCounterStyle = {
    background: '#553C8B',
    borderRadius: '4px 0',
    color: 'white',
    fontSize: '12px',
}
