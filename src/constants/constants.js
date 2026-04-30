export const PROJ_SUB_PATH = `${import.meta.env.VITE_BACKEND_BASE_URI}/projects/addproject`
export const PROJ_GET_PATH = `${import.meta.env.VITE_BACKEND_BASE_URI}/projects/fetchproject`
export const PROJ_GET_TITLE = `${import.meta.env.VITE_BACKEND_BASE_URI}/projects/fetch-titles?title=`
export const TAGS = ['ML', 'Fullstack', 'C', 'Web3',
    'Python', 'React', 'Express', 'Node', 'MongoDB', 'Electrical']
export const PATH_DEL_PROJ = `${import.meta.env.VITE_BACKEND_BASE_URI}/projects/delete-project`
export const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GIT_URL + '/login')}&scope=user:email,public_repo,read:user,repo,delete_repo`
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
export const PATH_USER_UPD_PWD = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/update-pwd`
export const PATH_USR_UPD_IMG = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/update-cover-image`
export const PATH_PWD_RESET_MAIL = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/forgot-pwd`
export const PATH_DEl_USER = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/delete-user`
export const PATH_DEl_GHUSER = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/delete-ghuser`
export const PATH_OTP_USER = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/usr-otp`
export const PATH_OTP_GHUSER = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/ghusr-otp`
export const PATH_VER_TOKEN = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/verify-token`
export const PATH_STAR_GIT_REPO = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/star-repo`
export const PATH_FORK_GIT_REPO = `${import.meta.env.VITE_BACKEND_BASE_URI}/users/fork-repo`
export const MAIL_ID = "contact@anirbanbuilds.online"