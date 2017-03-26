import React from 'react';
import { connect } from 'react-redux';

export function Strategy() {
    return React.createElement('article', {className: 'strategy'},
        React.createElement('h1', {}, 'Stratégie budgétaire'),
        React.createElement('p', {}, 'Ca se fait en 4 étapes. 1, 2, 3, 4!')
    );
}

export default connect(
    () => ({}),
    () => ({})
)(Strategy);