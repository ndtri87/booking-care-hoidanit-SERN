import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter!",
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    // Check email có tồn tại hay không
    // So sánh password người dùng nhập
    // return userInfo
    // access_token: JWT json web token

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
        // Nếu user tồn tại trả ra userinfo, nếu không trả ra case sau
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // ALL, id

    // Validate - nếu không có user nào => mảng rổng
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}

// [BƯỚC 2] - Tạo controller chuyển qua service xử lý deleteUser()
let handleDeleteUser = async (req, res) => {
    // Nếu không nhập Id
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!"
        })
    }
    // Nếu có nhập Id sử dụng service để xử lý
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 2,
            errMessage: "Missing required parameters!"
        })
    }

    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser
}