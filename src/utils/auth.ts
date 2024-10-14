// 定义存储 Token 的键名常量
const TOKEN_KEY = 'token'

// 检查用户是否已登录，判断 localStorage 中是否有 Token
const isLogin = () => {
    return !!localStorage.getItem(TOKEN_KEY) // 如果获取到 Token 则返回 true，否则返回 false
}

// 获取当前存储的 Token
const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) // 从 localStorage 中获取并返回 Token
}

// 设置新的 Token 并存储到 localStorage
const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token) // 将传入的 Token 存储到 localStorage
}

// 清除存储的 Token，退出登录时使用
const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY) // 从 localStorage 中移除 Token
}

// 导出定义的函数供其他模块使用
export { isLogin, getToken, setToken, clearToken }
