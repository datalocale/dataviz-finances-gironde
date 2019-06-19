import visit from '../../shared/js/finance/visitHierarchical';

import {DF, DI, RF, RI} from '../../shared/js/finance/constants';
import aggregationDescription from '../../../data/finances/description-agrégation.json';

import {fonctionLabels} from '../../../build/finances/m52-strings.json';

const colorClasses = Array(10).fill().map((e, i) => `area-color-${i+1}`);

const colorClassById = new Map();

visit(aggregationDescription, e => {
    if(e.children){
        let i = 0;

        e.children.forEach(c => {
            const id = typeof c === 'string' ? c : c.id;

            colorClassById.set(
                id,
                colorClasses[ id === 'DF.1' || id === 'DF.2' ? 0 : i ]
            )

            i++;
        })
    }
});

Object.keys(fonctionLabels).forEach(r => {
    const lastFigure = Number(r[r.length - 1]);

    [DF, DI, RF, RI].forEach(rdfi => {
        colorClassById.set(`M52-${rdfi}-${r}`, colorClasses[lastFigure]);
    })
    
})

export default colorClassById;