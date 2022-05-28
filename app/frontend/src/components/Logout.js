import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.logout = this.logout.bind(this);
    }
    async logout(all) {
        // the user has the choice to logout of this device or all devices
        // if the user chooses to logout of all devices, send "all":"1" to the server
        // if the user chooses to logout of this device, send "all":"0" to the server
        // in both cases, remove the access and refresh tokens from sessionStorage
        this.setState({
            isLoading: true
        });
        try {
            const res = await axiosInstance.post("logout/", {
                all: all
            });
            console.log(res.data);
            axiosInstance.defaults.headers['Authorization'] = null;
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            //push to login page
            window.location.href = "login/";
            this.setState({
                isLoading: false
            });
        } catch (err) {
            console.log(err);
            this.setState({
                isLoading: false
            });
        }
    }
    render() {
        return (
            <div className="container">
                <h1 className="text-light">Logout</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text">
                                    Do you want to logout of this device or all devices?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <button
                                    className="mx-1 btn btn-primary"
                                    onClick={() => this.logout(0)}
                                >
                                    This Device
                                </button>
                                <button
                                    className="mx-1 btn btn-primary"
                                    onClick={() => this.logout(1)}
                                >
                                    All devices
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Logout;


