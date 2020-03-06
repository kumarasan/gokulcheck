import React from 'react';
import SDK from '../SDK';
import { connect } from 'react-redux';
import {
    REACT_APP_XMPP_SOCKET_HOST,
    REACT_APP_XMPP_SOCKET_PORT,
    REACT_APP_ADMIN_USER_UNIQUE_ID,
    REACT_APP_SSL,
    REACT_APP_ENCRYPT_KEY,
    REACT_APP_API_URL,
    REACT_APP_SOCKETIO_SERVER_HOST,
    CHECK_INTERENT_CONNECTIVITY
} from '../processENV';
import { callbacks } from '../callbacks';
import logo from '../../assets/images/logo.png';
import loader from '../../assets/images/loader.svg';
import { ls } from '../../Helpers/LocalStorage';
import WebChatConversationSection from '../WebChat/WebChatConversationSection'
import Sidebar from './Sidebar';
import { encryption, decryption } from '../WebChat/WebChatEncryptDecrypt';
import InstructionComponent from './InstructionComponent';
import ScanQRLogo from "../../assets/images/scan-code-middle.png";
import "../../assets/scss/common.scss";
import 'react-toastify/dist/ReactToastify.css';

const createHistory = require("history").createBrowserHistory;
export const history = createHistory();

class Login extends React.Component {

    /**
     * WebChatQRCode Constructor <br />
     *
     * Following states in this WebChatQRCode Component.
     *
     * @param { boolean } connectionInitialize Connection Initialize status
     * @param { boolean } loaderStatus To check the loader status
     * @param { boolean } webChatStatus To check the web chat statu login or logout
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            connectionInitialize: false,
            loaderStatus: true,
            webChatStatus: false,
            onLineStatus: true,
            connectionStatusLoader: false
        }
        this.setIntervalTime = 0;
        this.handleQRCode = this.handleQRCode.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleState = this.handleState.bind(this);
    }

    /**
     * ComponentDidMount is one of the react lifecycle method. <br>
     * In this method to call the SDK.initialize() method.
     */
    componentDidMount() {
        this.setIntervalTime = setInterval(this.handleState, 3000);
        this.handleSDKIntialize();
    }

    handleState() {
        if (document.getElementById("login-container") !== null) {
            navigator.onLine ? this.setState({ onLineStatus: true }) : this.setState({ onLineStatus: false });
        }
    }

    /**
     * componentDidUpdate is one of the react lifecycle method. <br>
     *
     * @param {object} prevProps
     * @param {object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevState.onLineStatus !== this.state.onLineStatus) {
            if (this.state.onLineStatus) {
                this.handleSDKIntialize();
            }
        }

        if (prevProps.ConnectionStateData && prevProps.ConnectionStateData.id !== this.props.ConnectionStateData.id) {
            if (this.props.ConnectionStateData.data === "CONNECTED") {
                this.setState({ connectionStatusLoader: true });
            }
        }
    }

    /**
     * componentWillUnmount is one of the react lifecycle method. <br>
     *
     * In this method, to removed the setInterval time.
     */
    componentWillUnmount() {
        clearInterval(this.setIntervalTime);
        this.setState({
            connectionStatusLoader: "",
            onLineStatus: "",
            loaderStatus: ""
        });
    }

    handleSDKIntialize = () => {
        let response = SDK.initialize(REACT_APP_XMPP_SOCKET_HOST,
            REACT_APP_XMPP_SOCKET_PORT,
            REACT_APP_SSL,
            REACT_APP_ADMIN_USER_UNIQUE_ID,
            REACT_APP_ENCRYPT_KEY,
            callbacks,
            REACT_APP_API_URL, '');
        if (response.statusCode === 200) {
            console.log("SDK initialize: ", response);
            if (localStorage.getItem('auth_user') !== null) {
                let decryptResponse = decryption('auth_user');
                this.handleLogin(decryptResponse);
                this.setState({ webChatStatus: true });
            }
            setTimeout(() => {
                this.setState({ loaderStatus: false });
                this.handleQRCode(response);
            }, 300);
        } else {
            console.log("Intialize error, ", response);
        }
    }

    /**
     * Generate the QRCode using the SDK.generateQrCode() method. <br />
     *
     * Following the SDK.generateQrCode() params <br />
     *
     * @param { string } divQRCode - HTML element id.
     * @param { string } ImageId QRCode inside image id.
     * @param { string } REACT_APP_SOCKETIO_SERVER_HOST SocketIO Server Host
     */
    handleQRCode() {
        try {
            SDK.generateQrCode("divQRCode", document.getElementById("qr-logo"), REACT_APP_SOCKETIO_SERVER_HOST, (response) => {
                this.handleLogin(response);
            });
        } catch (error) {
            console.log("handleQRCode error: ", error);
        }
    }

    /**
     * Get the login token using fetch method.
     *
     * Once login success to call the following SDK methods.<br />
     * <ul>
     *       <li>SDK.getVcard()</li>
     *      <li>SDK.getBlockedUserList()</li>
     *      <li>SDK.getGroupsList()</li>
     *      <li>SDK.getRoster()</li>
     *      <li>SDK.getBlockedList()</li>
     *      <li>SDK.getFavouriteMessageList()</li>
     *      <li>SDK.getRecentChat()</li>
     *  </ul>
     *
     */
    handleLoginToken(data) {
        fetch(`${REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(response => response.json())
            .then(async (res) => {
                if (res.status === 200) {
                    encryption('auth_user', data);
                    await SDK.getVcard(data.username + '@' + REACT_APP_XMPP_SOCKET_HOST);
                    //await SDK.getBroadcastList();
                    await SDK.getBlockedUserList();
                    await SDK.getGroupsList();
                    await SDK.getRoster();
                    await SDK.getBlockedList();
                    await SDK.getFavouriteMessageList();
                    await SDK.getRecentChat();
                    setTimeout(() => {
                        this.setState({ webChatStatus: true });
                    }, 100);
                    localStorage.setItem("token", res.data.token);
                } else if (res.status === 400) {
                    this.setState({connectionStatusLoader: false});
                    console.log(res.message);
                }
            }).catch((error) => {
                console.log("Failed to fetch login token");
                ls.removeItem("auth_user");
                this.setState({ webChatStatus: false });
            });
    }

    /**
     * handleLogin()
     *
     * To call the SDK.login() method with user name and password.
     */
    handleLogin(response) {
        let loginResponse = { username: response.username, password: response.password, type: "WEB" };
        SDK.login(response.username, response.password).then(async (res) => {
            if (res.statusCode === 200) {
                this.handleLoginToken(loginResponse);
            } else {
                this.setState({ webChatStatus: false });
            }
        }).catch((error) => {
            console.log("handleLogin error, ", error);
        });
    }

    /**
     * handleLoaderQRCode() method to handle the loader or display QR Code div element.
     */
    handleLoaderQRCode = () => {
        let { loaderStatus } = this.state;
        return <>
            <InstructionComponent />
            <div className="right-side">
                <div className="logo-side-block">
                    <div className="logo">
                        <img src={ScanQRLogo} alt="scan-logo" id="qr-logo"/>
                        <img src={logo} alt="logo"/>
                    </div>
                    {loaderStatus ? <img src={loader} alt="loader" /> : <><div id="divQRCode" className="qr-code"></div>{this.state.connectionStatusLoader && <div className="qr-load-container"><img className="qr-load" src={loader} alt="loader" /></div>}</>}
                </div>
            </div>
        </>
    }

    /**
     * handleWebChatConnect() method to handle properly connectted with socket.
     */
    handleWebChatConnect = () => {
        let { webChatStatus } = this.state;
        return (
            (!webChatStatus) ? <div className="container"><div className="login-container" id="login-container">
                {this.handleLoaderQRCode()}
            </div></div> : <div className="container"><Sidebar /> <WebChatConversationSection /> </div>
        );
    }

    /**
     * handleWebChatOffLine() method to handle interent disconnecting state.
     */
    handleWebChatOffLine() {
        return <div className="container"><div className="login-container" id="login-container">
            <InstructionComponent />
            <div className="right-side">
                <div className="logo-side-block">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="network-disconnect">
                        {<img src={loader} alt="loader" />}
                        <h4>{CHECK_INTERENT_CONNECTIVITY}</h4>
                    </div>
                </div>
            </div>
        </div></div>
    }

    render() {
        return <>
            {this.state.onLineStatus ? this.handleWebChatConnect() : this.handleWebChatOffLine()}
        </>
    }
}

const mapStateToProps = (state, props) => {
    return {
        ConnectionStateData: state.ConnectionStateData
    }
}

export default connect(mapStateToProps, null)(Login);
