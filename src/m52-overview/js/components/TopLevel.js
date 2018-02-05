import React from 'react'

import M52Viz from '../../../shared/js/components/M52Viz';
import AggregatedViz from './AggregatedViz';
import TextualAggregated from './TextualAggregated';
import TextualSelected from './TextualSelected';
import RDFISelector from './RDFISelector';
import DepartmentFinanceHeader from './DepartmentFinanceHeader';

import {M52_INSTRUCTION, AGGREGATED_INSTRUCTION} from '../../../shared/js/finance/constants';

/*
    rdfi, dfView,
    documentBudgetaire, aggregatedInstruction,
    M52Hierarchical, M52OveredNodes,
    aggregatedHierarchical, aggregatedOveredNodes,
    over
*/

export default function({
        rdfi, dfView,
        documentBudgetaire, aggregatedInstruction,
        M52Hierarchical, M52HighlightedNodes,
        aggregatedHierarchical, aggregatedHighlightedNodes,
        selection,
        onM52NodeOvered, onAggregatedNodeOvered,
        onM52NodeSelected, onAggregatedNodeSelected,
        onRDFIChange, onAggregatedDFViewChange,
        onNewM52CSVFile
    }){

    return documentBudgetaire ? React.createElement('div', {className: 'top-level'},
        React.createElement(
            DepartmentFinanceHeader,
            {
                LibelleColl: documentBudgetaire.LibelleColl,
                Exer: documentBudgetaire.Exer,
                NatDec: documentBudgetaire.NatDec
            },
            React.createElement('label', {},
                'Fichier XML au format <DocumentBudgetaire>: ',
                React.createElement('input', {type: 'file', onChange(e){
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.readAsText(file, "UTF-8");
                        reader.onload = e => onNewM52CSVFile(e.target.result);
                        // TODO error case
                    }
                }})
            )
        ),
        React.createElement('div', {},
            React.createElement(M52Viz, {
                M52Hierarchical,
                M52HighlightedNodes,
                selectedNode: selection && selection.type === M52_INSTRUCTION ? selection.node : undefined,
                onSliceOvered: onM52NodeOvered,
                onSliceSelected: onM52NodeSelected,
                width: 450,
                height: 450,
            }),
            React.createElement(RDFISelector, { rdfi, onRDFIChange }),
            React.createElement(AggregatedViz, {
                aggregatedHierarchical,
                aggregatedHighlightedNodes,
                selectedNode: selection && selection.type === AGGREGATED_INSTRUCTION ? selection.node : undefined,
                rdfi, dfView,
                onSliceOvered: onAggregatedNodeOvered,
                onSliceSelected: onAggregatedNodeSelected,
                onAggregatedDFViewChange,
                width: 450,
                height: 450,
            })
        ),
        selection ? React.createElement(TextualSelected, {selection}) : undefined,
        React.createElement(TextualAggregated, {documentBudgetaire, aggregatedInstruction})
    ) : React.createElement('div', {});
}
