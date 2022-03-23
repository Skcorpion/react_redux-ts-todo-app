import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatusType = {
  [key: string]: string
}

export const StatusFilters: StatusType = {
  All: 'all',
  Active: 'active',
  Completed: 'completed'
}

export type IStatus = 'All' | 'Active' | 'Completed'

export interface FiltersState {
  status: string
}

const initialState: FiltersState = {
  status: StatusFilters.All
}

// some thunk

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    statusFilterChange(state, action: PayloadAction<string>){
      state.status = action.payload
    }
  }
})

export const { statusFilterChange } = filtersSlice.actions

// some selectors

export default filtersSlice.reducer