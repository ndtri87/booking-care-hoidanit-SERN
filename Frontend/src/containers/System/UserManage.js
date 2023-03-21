import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./UserManage.scss";
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from "../../services/userService";
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from "../../utils/emitter";


/**
 * Life cycle
 * 1. Run constructor - init state
 * 2. Did mount - set state (Gọi APIs gán cho state)
 * 3. Render
 */

class UserManage extends Component {

    // Khởi tạo biến
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
        }
    }

    // Call Api
    async componentDidMount() {
        await this.getAllUserFromReact();
    }

    getAllUserFromReact = async () => {
        let response = await getAllUsers("ALL");
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            })
        }
    }

    // Hảm mở modal
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    // Hàm đóng modal
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    // Hàm createNewUser ở đi để add user mới vào list không reload
    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage)
            } else {
                await this.getAllUserFromReact();
                this.setState({
                    isOpenModalUser: false
                })
                // Truyền clear dữ liệu cho child
                emitter.emit("EVENT_CLEAR_MODAL_DATA");
            }
        } catch (e) {
            console.log(e)
        }
    }

    // Click delete & đóng modal
    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUserFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Click edut mở modal edit
    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })
    }

    // Click save changes & đóng modal
    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUserFromReact()
            } else {
                alert(res.errCode);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    // Truyền props cho childrent
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />

                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        // Truyền props cho childrent
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className='title text-center'>Users Manage</div>
                <div className='mx-1'>
                    <button
                        className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}
                    ><i className="px-1 fas fa-plus"></i>Add new users</button>
                </div>
                <div className='user-table mt-4 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                            {
                                arrUsers && arrUsers.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button className='btn-edit' onClick={() => this.handleEditUser(item)}>
                                                    <i className="far fa-edit"></i>
                                                </button>
                                                <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}>
                                                    <i className="far fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
