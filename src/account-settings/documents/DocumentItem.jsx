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
            (<div style={ImageCounterStyle}>{this.props.document.files.length}</div>)

        return (
            <Card
                className="mt-3 mr-3"
                style={CardStyle}
            >
                <Card.Body>
                    <Card.Text>
                        <Image 
                            style={ImageStyle}
                            src={this.props.document?.files[0]?.thumbnail} 
                            rounded
                        />
                        {imageCounter}
                        <div
                            style={LabelStyle}
                        >
                            {this.props.document.name}
                        </div>
                        <div
                            style={DateStyle}
                        >Добавлено: {this.props.document.date_create.substring(0, 10)}</div>
                        <Button 
                            variant="link" 
                            style={EditButtonStyle} 
                            onClick={this.handleClick} 
                        >
                            <FontAwesomeIcon className="mr-1" icon={faPencilAlt} />
                        </Button>
                    </Card.Text>
                </Card.Body>
            </Card>
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
    width: '320px',
    height: '100px',

    background: '#F6F7FA',
    /* Border */
    border: '1px solid #EBEBEF',
    box: {sizing: 'border-box'},
    border: {radius: '4px'},
}

const ImageStyle = {
    //position: 'absolute',
    width: '60px',
    height: '60px',
    left: '12px',
    top: '12px',
    
    border: {radius: '4px'},
}

const LabelStyle = {
    position: 'absolute',
    width: '188px',
    height: '17px',
    left: '88px',
    top: '12px',

    font: {
        family: 'Roboto',
        style: 'normal',
        weight: '500',
        size: '14px',
    },
    line: {height: '124%'},
    /* or 17px */

    /* Typography/Black */
    color: '#333333',

    /* Inside Auto Layout */
    flex: 'none',
    order: '0',
    flex: {grow: '0'},
    margin: '4px 0px',
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
    /* or 17px */

    /* Typography/Black */
    color: '#333333',


    /* Inside Auto Layout */
    flex: 'none',
    order: '1',
    flex: {grow: '0'},
}

const EditButtonStyle = {
    position: 'absolute',
    right: '0',
    bottom: '0',
    margin: '12px',
}

const ImageCounterStyle = {
    position: 'absolute',
    width: '24px',
    height: '18px',
    left: '56px',
    top: '62px',
    background: '#553C8B',
    "border-radius": '4px 0',
    display: 'flex',
    "flex-direction": 'column',
    "justify-content": 'center',
    "align-items": 'center',
    color: 'white',
}