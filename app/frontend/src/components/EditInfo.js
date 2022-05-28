import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class EditInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {},
            non_field_errors: "",
            isLoading: false,
            isLoggedIn: false
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
                email: this.state.email,
                password: this.state.password
            };

            const res = await axiosInstance.post("edit/", user, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(res.data);
            this.setState({
                isLoading: false
            });
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            this.setState({
                isLoggedIn: false
            });
            window.location.href = "/";
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
        const { email, password, errors, isLoading, non_field_errors } = this.state;
        return (
            <div className="container">
                <h1 className="text-light">Change Email</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email"
                                            className="form-control"
                                            name="email"
                                            value={email}
                                            onChange={this.onChange}
                                            required
                                        />
                                        {errors.email && (
                                            <div className="alert alert-danger">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input type="password"
                                            className="form-control"
                                            name="password"
                                            value={password}
                                            onChange={this.onChange}
                                            required
                                        />
                                        {non_field_errors && (
                                            <div className="my-2 alert alert-danger">
                                                {non_field_errors}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                                "Submit"
                                            )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditInfo;


