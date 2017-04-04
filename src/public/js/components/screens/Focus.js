import React from 'react';
import { connect } from 'react-redux';

import Placeholder from '../../../../shared/js/components/Placeholder';

const focusContent = require('../../../../../data/focusContent.json');

export function Focus({focusId}) {
    return React.createElement('article', {className: 'focus'},
        React.createElement('h1', {}, 'Focus ', focusId),
        React.createElement('p', {}, focusContent[focusId]),
        React.createElement(Placeholder, {}),
        React.createElement(Placeholder, {}),
        React.createElement(Placeholder, {}),
        React.createElement(Placeholder, {}),
        React.createElement(Placeholder, {})
    );
}

export default connect(
    state => {
        const { breadcrumb } = state;
        return {focusId: breadcrumb.last()};
    },
    () => ({})
)(Focus);