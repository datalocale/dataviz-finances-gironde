import { OrderedSet as ImmutableSet, Map as ImmutableMap } from 'immutable';
import TreeApply from './finance/TreeApply.js';

export function computeRowUiState (M52Hierarchical, M52HoveredRows) {
    return TreeApply(M52Hierarchical, (TreeNode, FlatMap) => {
        M52HoveredRows.forEach(M52Row => {
            FlatMap.add({
                M52Row,
                uiState: TreeNode.elements.contains(M52HoveredRows) ? 'hover' : 'idle'
            });
        });
    });
}
