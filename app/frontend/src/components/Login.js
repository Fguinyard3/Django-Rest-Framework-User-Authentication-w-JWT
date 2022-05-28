import React, { Component } from "react";

import axiosInstance from "../axiosApi";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {},
            message: "",
            isLoading: false
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitThen = this.handleSubmitThen.bind(this);

    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmitThen(e) {
        e.preventDefault();
        this.setState({
            isLoading: true
        });
        const user = {
            email: this.state.email,
            password: this.state.password
        };
        axiosInstance.post("login/", user).then(res => {
            console.log(res.data);
            axiosInstance.defaults.headers["Authorization"] = "Bearer" + res.data.access;
            sessionStorage.setItem("access_token", res.data.access);
            sessionStorage.setItem("refresh_token", res.data.refresh);
            this.setState({
                message: res.data.detail
            });
            this.setState({
                isLoading: false
            });
        }
        ).catch(err => {
            console.log(err);
            this.setState({
                isLoading: false
            });
        }
        );
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
            const res = await axiosInstance.post("login/", user);
            console.log(res.data);
            axiosInstance.defaults.headers["Authorization"] = "Bearer" + res.data.access;
            sessionStorage.setItem("access_token", res.data.access);
            sessionStorage.setItem("refresh_token", res.data.refresh);
            window.location.href = "/";
            this.setState({
                isLoading: false
            });
        } catch (err) {
            console.log(err);
            this.setState({
                isLoading: false,
                message: err.response.data.detail
            });
            return err
        }
    }
    render() {
        const { errors, message } = this.state;
        return (
            <div className="container">
                <h1 className="text-light">Login</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.onChange}
                                            placeholder="Enter email"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.onChange}
                                            placeholder="Enter password"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </form>
                                {message && <div className="alert alert-danger my-2">
                                    {message}
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;


