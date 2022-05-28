import React, { Component } from "react";
import axiosInstance from "../axiosApi";

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            last_login: "",
            balance: "",
            isLoggedIn: false,
        };
        this.getData = this.getData.bind(this);

    }

    async getData() {
        try {
            const res = await axiosInstance.get("user/");
            console.log(res.data);
            this.setState({
                email: res.data.email,
                last_login: Date(res.data.last_login),
                balance: res.data.balance,
                isLoggedIn: true,
            });
        } catch (err) {
            console.log(err);
        }
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        const { email, last_login, balance, isLoggedIn } = this.state;
        return (
            <div className="container">
                <h1 className="text-light">Info</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                {isLoggedIn ? (
                                    <div>
                                        <h3>Email: {email}</h3>
                                        <h3>Last login: {last_login}</h3>
                                        <h3>Balance: ${balance}</h3>
                                    </div>
                                ) : (
                                        <h3>You are not logged in</h3>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Info;






