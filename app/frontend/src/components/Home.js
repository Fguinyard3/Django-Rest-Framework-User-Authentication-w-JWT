import React, { Component } from "react";
import axiosInstance from "../axiosApi";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        };
        this.verifyToken = this.verifyToken.bind(this);
    }
    async verifyToken() {
        try {
            const res = await axiosInstance.post("verify/",{
                token : sessionStorage.getItem("access_token")
            });
            console.log(res.data);
            this.setState({
                isLoggedIn: true,
            });
        } catch (err) {
            console.log(err);
        }
    }
    componentDidMount() {
        this.verifyToken();
    }
    render() {
        const { isLoggedIn } = this.state;
        return (
            <div className="container">
                <h1 className="text-light">Home</h1>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                {isLoggedIn ? (
                                    <div>
                                        <h3>You are logged in</h3>
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
export default Home;
