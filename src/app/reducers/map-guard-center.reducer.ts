import { ActionReducer, Action } from '@ngrx/store';

export const SETMAPCENTER = 'SETMAPCENTER';

export function centerMapReducer(state: any, action: Action, payload) {
	switch (action.type) {
		case SETMAPCENTER:
			return payload;
		default:
			return state;
	}
}