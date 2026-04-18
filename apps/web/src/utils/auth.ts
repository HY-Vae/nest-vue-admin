const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setRefreshToken = (token: string) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, token)

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
