import { BREADCRUMB_CHANGE } from './constants/actions';

export default function (dispatch) {
    return {
        onContentChange(breadcrumb) {
            dispatch({
                type: BREADCRUMB_CHANGE,
                breadcrumb
            });
        }
    };
}