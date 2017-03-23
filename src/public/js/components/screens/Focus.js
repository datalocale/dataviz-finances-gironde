import React from 'react';
import { connect } from 'react-redux';

const focusContent = require('../../../../../data/focusContent.json');

export function Focus({focusId}) {
    return React.createElement('article', {className: 'focus'},
        React.createElement('h1', {}, 'Focus ', focusId),
        React.createElement('p', {}, focusContent[focusId])
    );
}

export default connect(
    state => {
        const { breadcrumb } = state;
        return {focusId: breadcrumb.last()};
    },
    () => ({})
)(Focus);