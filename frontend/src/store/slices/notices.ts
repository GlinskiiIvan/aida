import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../store";

type NoticeType = 'error' | 'info' | 'success';
interface INotice {type: NoticeType, message: string};
export type NoticeItemType = (INotice & {id: number});

export interface State {
    notices: NoticeItemType[];
}

const initialState: State = {
    notices: []
};

const noticesSlice = createSlice({
    name: 'notices',
    initialState,
    reducers: {
        addNotice: (state, action: PayloadAction<INotice>) => {
            if (!action.payload) return;

            const id = state.notices.length;
            state.notices.push({...action.payload, id});
        },
        removeNotice: (state, action: PayloadAction<number>) => {
            state.notices = state.notices.filter(n => n.id !== action.payload);
        }
    },
});

export const {addNotice, removeNotice} = noticesSlice.actions;

export const selectNoticesList = (state: RootState) => state.notices.notices;

export const noticesReducer = noticesSlice.reducer;