import type { RootState } from '../index'
import { createSelector } from '@reduxjs/toolkit'

const selectAuth = (state: RootState) => state.auth

export const selectAccessToken = createSelector(selectAuth, (auth) => auth.accessToken)
export const selectExpiry = createSelector(selectAuth, (auth) => auth.expiry)
export const selectTokenType = createSelector(selectAuth, (auth) => auth.tokenType)
export const selectUser = createSelector(selectAuth, (auth) => auth.user)
export const selectUserGroups = createSelector(selectUser, (user) => user?.groups ?? [])
export const selectUserRoles = createSelector(selectUser, (user) => user?.roles ?? [])
