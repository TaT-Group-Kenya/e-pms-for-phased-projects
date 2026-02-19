import type { RootState } from '../index'
import { createSelector } from '@reduxjs/toolkit'

const selectAuth = (state: RootState) => state.auth

export const selectAccessToken = createSelector(selectAuth, (auth) => auth.accessToken)
export const selectExpiry = createSelector(selectAuth, (auth) => auth.expiry)
export const selectUser = createSelector(selectAuth, (auth) => auth.user)
