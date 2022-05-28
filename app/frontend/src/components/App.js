import React, { Component} from "react";
import {Switch,Route,Link}  from 'react-router-dom'
import axiosInstance from "../axiosApi";
import SignUp from "./Signup"
import Login from "./Login"
import Info from "./Info"
import Logout from "./Logout"
import EditInfo from "./EditInfo";
import EditPassword from "./EditPassword";
import Home from "./Home";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            last_login: "",
            balance: "",
            isLoggedIn: false,
            isLoading: false
        };
        this.getData = this.getData.bind(this);
    }
    async getData() {
        this.setState({
            isLoading: true
        });
        try {
            const res = await axiosInstance.get("user/");
            console.log(res.data);
            this.setState({
                email: res.data.email,
                last_login: res.data.last_login,
                balance: res.data.balance,
                isLoggedIn: true,
                isLoading: false
            });
        } catch (err) {
            console.log(err);
            this.setState({
                isLoading: false
            });
        }
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        const { email, last_login, balance, isLoggedIn, isLoading } = this.state;
        return (
          <div className="h-100">                
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            App
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                {!isLoggedIn && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                      </Link>
                      </li>
                      )}
                      {!isLoggedIn && (
                      <li className="nav-item">
                      <Link className="nav-link" to="/signup">
                      Signup
                      </Link>
                      </li>
                      )}

                  {isLoggedIn ? (
                      <li className="nav-item">
                          <Link className="nav-link" to="/logout">
                              Logout
                              </Link>
                              </li>
                              ) : null}

                  {isLoggedIn ? (
                      <li className="nav-item">
                          <Link className="nav-link" to="/info">
                              Info
                              </Link>
                              </li>
                              ) : null}
                  {isLoggedIn ? (
                      <li className="nav-item">
                          <Link className="nav-link" to="/editinfo">
                              EditInfo
                              </Link>
                              </li>
                              ) : null}
                  {isLoggedIn ? (
                      <li className="nav-item">
                          <Link className="nav-link" to="/editpassword">
                              EditPassword
                              </Link>
                              </li>
                              ) : null}
              </ul>
          </div>
      </nav>
            <div className="container">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/signup">
                        <SignUp />
                    </Route>
                    <Route path="/logout">
                        <Logout />
                    </Route>
                    <Route path="/info">
                        <Info email={email} last_login={last_login} balance={balance} />
                    </Route>
                    <Route path="/editinfo">
                        <EditInfo />
                    </Route>
                    <Route path="/editpassword">
                        <EditPassword />
                    </Route>
                </Switch>
            </div>
            </div>
        );
    }
}
export default App;
