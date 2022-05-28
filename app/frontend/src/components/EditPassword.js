import React, { Component } from "react";
import axiosInstance from "../axiosApi";


class EditPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: "",
            new_password: "",
            non_field_errors: ""
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    async handleSubmit(e) {
        e.preventDefault();
        this.setState({
            isLoading: true
        });
        try {
            const user = {
                old_password: this.state.old_password,
                new_password: this.state.new_password
            };

            const res = await axiosInstance.post("change-password/", user, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status === 201) {
                sessionStorage.removeItem("access_token");
                sessionStorage.removeItem("refresh_token");
                this.setState({
                    isLoggedIn: false
                });
                window.location.href = "/";
            }
            this.setState({
                isLoading: false
            });
        } catch (err) {
            console.log(err);
            this.setState({
                isLoading: false
            })
            this.setState({
                non_field_errors: err.response.data.non_field_errors
            });

            return err

        }
    }
    render() {
        const { old_password, new_password, non_field_errors } = this.state;
        return (
            <div className="container">
            <h1 className="text-light">Change Password</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="old_password">Old Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="old_password"
                                            name="old_password"
                                            value={old_password}
                                            onChange={this.onChange}
                                            placeholder="Enter old password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="new_password">New Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="new_password"
                                            name="new_password"
                                            value={new_password}
                                            onChange={this.onChange}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </form>
                                {non_field_errors && (
                                    <div className="my-2 alert alert-danger">
                                        {non_field_errors}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default EditPassword;

