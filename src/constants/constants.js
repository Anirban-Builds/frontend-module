export const PROJ_SUB_PATH = `${import.meta.env.VITE_BACKEND_BASE_URI}/projects/addproject`
export const PROJ_GET_PATH = `${import.meta.env.VITE_BACKEND_BASE_URI}/projects/fetchproject`
export const PROJ_GET_TITLE = `${import.meta.env.VITE_BACKEND_BASE_URI}/projects/fetch-titles?title=`
export const TAGS = ['ML', 'Fullstack', 'C', 'Web3',
    'Python', 'React', 'Express', 'Node', 'MongoDB']
// const BACKEND = 'http://localhost:8000'
export const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GIT_URL + '/login')}&scope=user:email`
export const PATH_GH_LOGIN = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/gh-login?code=`
export const PATH_USER_LOGIN = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/login`
export const PATH_USER_SIGNUP = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/signup`
export const PATH_CHK_UNAME = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/check-uname?username=`
export const PATH_GH_USER = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/gh-users`
export const PATH_USER = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/users`
export const PATH_GH_LOGOUT = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/gh-logout`
export const PATH_USER_LOGOUT = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/logout`
export const PATH_GH_LINK = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/gh-link`
export const PATH_GH_UNLINK = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/gh-unlink`
export const PATH_USR_UPD_IMG = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/update-cover-image`
export const MAIL_ID = "anir1bn@gmail.com"