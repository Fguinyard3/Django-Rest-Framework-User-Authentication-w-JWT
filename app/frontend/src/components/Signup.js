import  React,{Component} from 'react'
import axiosInstance from "../axiosApi";

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            password_confirmation: "",
            non_field_errors: "",
            message: "",
            isLoading: false
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
                password: this.state.password,
                password_confirmation: this.state.password_confirmation
            };
            const res = await axiosInstance.post("register/", user,{
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(res.data);
            this.setState({
                message: res.data.message
            });
            this.setState({
                isLoading: false
            });
        } catch (err) {
            console.log(err);
            this.setState({
                isLoading: false
            });
            this.setState({
                non_field_errors: err.response.data.non_field_errors
            });
            return err


        }

    }

    render() {
        const { email, password, password_confirmation, non_field_errors, message, isLoading } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-light">Sign Up</h1>
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={email}
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
                                            value={password}
                                            onChange={this.onChange}
                                            placeholder="Enter password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password_confirmation">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password_confirmation"
                                            value={password_confirmation}
                                            onChange={this.onChange}
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        {isLoading ? "Loading..." : "Sign Up"}
                                    </button>
                                </form>
                                {non_field_errors && (
                                        <div className="alert alert-danger">
                                            {non_field_errors}
                                        </div>
                                    )}
                                    {message && (
                                        <div className="alert alert-success my-2">
                                            {message}
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

export default SignUp;