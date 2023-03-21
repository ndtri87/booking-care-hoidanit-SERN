import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
};

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user tồn tại
                let user = await db.User.findOne({
                    attributes: ["email", "roleId", "password"],
                    where: { email: email },
                    raw: true // Chuyển data về dạng Object
                });
                if (user) {
                    // kiểm tra password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password; // không hiện password trước
                        userData.user = user; // hiện toàn bộ thông tin trong userData sau khi delete password
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Mật khẩu không đúng!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found!`
                }

            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = `Email không đúng!`

            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"] //bỏ thông tin password
                    },
                })
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"] //bỏ thông tin password
                    },
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra email có tồn tại?
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Email đã tồn tại!",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    errMessage: "OK"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}


// [BƯỚC 3] - Hàm xử lý cho dùng ở [BƯỚC 2]
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        //Tìm user
        let user = await db.User.findOne({
            where: { id: userId }
        })
        // Nếu user không tồn tại
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        // User có tồn tại, thì xóa
        // await user.destroy(); // sử dụng khi bỏ "raw": true trong config
        await db.User.destroy({
            where: { id: userId }
        })

        resolve({
            errCode: 0,
            message: `The user is deleted`
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                // })
                resolve({
                    errCode: 0,
                    message: "Update the user sucessfully!"
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found!"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}