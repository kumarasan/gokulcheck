import React from 'react';
import { connect } from 'react-redux';
import SDK from '../SDK';
import WebChatEmoji from './WebChatEmoji';
import { ls } from '../../Helpers/LocalStorage';
import { encryption, decryption } from '../WebChat/WebChatEncryptDecrypt';
import { isUrl } from '../../Helpers/Utility';
import {
    REACT_APP_API_URL,
    REACT_APP_PROFILE_NAME_CHAR,
    REACT_APP_STATUS_CHAR,
    VIEW_PROFILE_INFO
} from '../processENV';
import { ReactComponent as Close } from '../../assets/images/close.svg';
import { ReactComponent as EditCamera } from '../../assets/images/editcamera.svg';
import { ReactComponent as Edit } from '../../assets/images/edit.svg';
import { ReactComponent as Status } from '../../assets/images/status.svg';
import { ReactComponent as Info } from '../../assets/images/info.svg';
import { ReactComponent as Done } from '../../assets/images/done.svg';
import { ReactComponent as Viewphoto } from '../../assets/images/view.svg';
import { ReactComponent as Upload } from '../../assets/images/upload.svg';
import { ReactComponent as Remove } from '../../assets/images/remove.svg';
import { ReactComponent as Takephoto } from '../../assets/images/takephoto.svg';
import { ReactComponent as CameraIcon } from '../../assets/images/cameraicon.svg';
import { ReactComponent as Tick } from '../../assets/images/Tick.svg';
import { ReactComponent as Reset } from '../../assets/images/reset.svg';
import profilepreview from '../../assets/images/profilepreview.jpg';
import SampleProfile from '../../assets/images/sample-profile.svg';
import loaderSVG from '../../assets/images/loader.svg';
import Store from '../../Store';
import { VCardProfileImageAction } from "../../Actions/VCardActions";
import OutsideClickHandler from 'react-outside-click-handler';

class WebChatVCard extends React.Component {

    /**
     * Following the states used in WebChatVCard Component.
     *
     * @param {object} vCardData VCard Data set into this state.
     * @param {boolean} loaderStatus Display the loader based on the loaderStatus state.
     * @param {boolean} viewProfileStatus Display the profile data into popup to maintain in this state.
     * @param {string} profileImg Profile image path maintain in this state.
     * @param {string} userName username input to maintain in this state.
     * @param {string} userStatus status input to maintain in this state.
     * @param {string} usernameChars Display the characters left for username field.
     * @param {string} statusChars Display the characters left for status field.
     * @param {boolean} viewEdit Display the editable field for username field.
     * @param {boolean} viewEditStatus Display the editable field for status field.
     * @param {boolean} charCount Display the charCount for username field.
     * @param {boolean} charCountStatus Display the charCount for status field.
     */
    constructor(props) {
        super(props);
        this.state = {
            vCardData: '',
            loaderStatus: true,
            viewProfileStatus: false,
            profileImg: '',
            userName: '',
            userStatus: '',
            viewEdit: true,
            viewEditStatus: true,
            viewTick: true,
            viewTickStatus: true,
            charCount: false,
            charCountStatus: false,
            showImgDropDown: false,
            showProfileImg: false,
            profileCamera: false,
            showProfileCamera: false,
            usernameChars: REACT_APP_PROFILE_NAME_CHAR,
            statusChars: REACT_APP_STATUS_CHAR
        }
    }

    /**
     * componentDidMount() method is one of the lifecycle method.
     *
     * In this method to handle loader status and call the handleProfileImg().
     */
    componentDidMount() {
        if (this.props.vCardData.length === 0) {
            this.setState({ loaderStatus: true });
        }
        if ((this.props.vCardData && this.props.vCardData.id) || this.state.vCardData.length !== 0) {
            this.setState({
                loaderStatus: false,
                userName: this.props.vCardData.data.nickname,
                userStatus: this.props.vCardData.data.userstatus,
                usernameChars: REACT_APP_PROFILE_NAME_CHAR - this.props.vCardData.data.nickname.length,
                statusChars: REACT_APP_STATUS_CHAR - this.props.vCardData.data.userstatus.length
            });
            this.handleProfileImg(this.props);
        }
    }

    /**
     * handleProfileImg() method to perform fetch the image form url and encrypt the vcard data.
     *
     * @param {object} response
     */
    handleProfileImg(response) {
        let decryptData = decryption('vcard_data');
        let imageURL = decryptData.image;
        if (isUrl(imageURL)) {
            this.setState({ profileImg: imageURL });
        } else {
            let token = ls.getItem('token');
            if (response.vCardData.data.image !== "" && response.vCardData.data.image !== null && token !== null) {
                let responseURL = `${REACT_APP_API_URL}/chat/media/${response.vCardData.data.image}?mf=${token}`;
                response.vCardData.data.image = responseURL;
                encryption('vcard_data', response.vCardData.data);
                this.setState({ profileImg: responseURL });
            } else {
                this.setState({ profileImg: "" });
            }
        }
    }

    /**
     * handleOnErrorImage() to handle the image not rendering properly means to display the default profile image or retrive to get profile image.
     */
    handleOnErrorImage = () => {
        let token = ls.getItem('token');
        let profileImg = this.state.profileImg;
        let url = new URL(profileImg);
        url.search = `mf=${token}`;
        let imageURL = url.origin + url.pathname + url.search;
        Store.dispatch(VCardProfileImageAction({ user: this.state.vCardData.fromuser, image: imageURL }));
        this.setState({ profileImg: imageURL });
    }

    /**
    * handleSetState() method to handle set the state.
    */
    handleSetState() {
        this.setState({
            userName: this.state.userName,
            userStatus: this.state.userStatus,
        });
    }

    /**
     * componentDidUpdate() method to check the prevProps and current props vCardData and update the profile image.
     *
     * @param {object} prevProps
     * @param {object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.vCardData && prevProps.vCardData.id !== this.props.vCardData.id) {
            this.setState({
                vCardData: this.props.vCardData.data,
                loaderStatus: false,
                userName: this.props.vCardData.data.nickname,
                userStatus: this.props.vCardData.data.userstatus,
                usernameChars: REACT_APP_PROFILE_NAME_CHAR - this.props.vCardData.data.nickname.length,
                statusChars: REACT_APP_STATUS_CHAR - this.props.vCardData.data.userstatus.length,
            });
            this.handleProfileImg(this.props);
        }
    }

    /**
     * handleViewProfile() method to maintain state for view profile popup.
     */
    handleViewProfile = () => {
        this.setState({ viewProfileStatus: true });
    }

    /**
     * handleEdit() method to maintain state for Edit username field.
     */
    handleEdit(e) {
        this.setState({ viewEdit: false, viewTick: false, charCount: true });
    }

    /**
     * handleEditStatus() method to maintain state for Edit status field.
     */
    handleEditStatus(e) {
        this.setState({ viewEditStatus: false, viewTickStatus: false, charCountStatus: true });
    }

    /**
     * handleVCardClose() method to maintain state for view profile popup close window state.
     */
    handleVCardClose = () => {
        this.setState({
            usernameChars: REACT_APP_PROFILE_NAME_CHAR - this.props.vCardData.data.nickname.length,
            statusChars: REACT_APP_STATUS_CHAR - this.props.vCardData.data.userstatus.length,
            viewProfileStatus: false,
            viewEmojiUsername: false,
            userName: this.props.vCardData.data.nickname,
            userStatus: this.props.vCardData.data.userstatus,
            viewEmojiStatus: false,
            viewEdit: true,
            viewEditStatus: true,
            viewTick: true,
            viewTickStatus: true,
            charCount: false,
            charCountStatus: false,
            showImgDropDown: false,
            showProfilePhotoRemove: false
        });
    }

    /**
     * handleVcardSaveUsername() method to store username for view profile.
     */
    handleVcardSaveUsername = async (e) => {
        let { vCardData, userName } = this.state;
        if (userName !== '') {
            let mobileno = vCardData.mobilenumber;
            await SDK.setVcard(userName, vCardData.image, vCardData.userstatus, mobileno, vCardData.email);
            this.setState({
                usernameChars: REACT_APP_PROFILE_NAME_CHAR - this.props.vCardData.data.nickname.length,
                viewEdit: true,
                charCount: false,
                viewTick: true,
                userName: this.state.userName,
                userStatus: this.state.userStatus
            });
        }
    }

    /**
     * handleVcardSaveStatus() method to store status for view profile.
     */
    handleVcardSaveStatus = async (e) => {
        let { vCardData, userStatus } = this.state;
        if (userStatus !== '') {
            let mobileno = vCardData.mobilenumber;
            await SDK.setVcard(vCardData.nickname, vCardData.image, userStatus, mobileno, vCardData.email);
            this.setState({
                statusChars: REACT_APP_STATUS_CHAR - this.props.vCardData.data.userstatus.length,
                viewEditStatus: true,
                charCountStatus: false,
                viewTickStatus: true,
                userStatus: this.state.userStatus,
                userName: this.state.userName
            });
        }
    }

    /**
     * removeProfileImage() method to maintain state to profile picture.
     */
    removeProfileImage = (e) => {
        let { vCardData } = this.state;
        SDK.setVcard(vCardData.nickname, '', vCardData.userstatus, vCardData.mobilenumber, vCardData.email);
        this.setState({
            showImgDropDown: false,
            showProfilePhotoRemove: false
        });
    }

    /**
     * handleWordCount() method to maintain state for characters left for username field.
     */
    handleWordCount = event => {
        const charCount = event.target.value.length;
        const charLeft = REACT_APP_PROFILE_NAME_CHAR - charCount;
        var user_name = event.target.value;
        this.setState({ usernameChars: charLeft, userName: user_name });
        (charLeft == REACT_APP_PROFILE_NAME_CHAR) ? this.setState({ viewTick: true }) : this.setState({ viewTick: false })
    }

    /**
     * handleWordCountStatus() method to maintain state for characters left for status field.
     */
    handleWordCountStatus = event => {
        const user_statusLength = event.target.value.length;
        const charLeftStatus = REACT_APP_STATUS_CHAR - user_statusLength;
        var user_Status = event.target.value;
        this.setState({ statusChars: charLeftStatus, userStatus: user_Status });
        (charLeftStatus == REACT_APP_STATUS_CHAR) ? this.setState({ viewTickStatus: true }) : this.setState({ viewTickStatus: false })
    }

    /**
     * onEmojiClick() method to maintain state to append username and emoji in username field.
     */
    onEmojiClickUsername = (event, emojiObject) => {
        document.getElementById("username").focus();
        if (this.state.usernameChars <= REACT_APP_PROFILE_NAME_CHAR && this.state.usernameChars > 1) {
            var usernameemoji = this.state.userName + emojiObject.emoji;
            const charCount = usernameemoji.length;
            const charLeft = REACT_APP_PROFILE_NAME_CHAR - charCount;
            this.setState({ usernameChars: charLeft, userName: usernameemoji });
            (charLeft == REACT_APP_PROFILE_NAME_CHAR) ? this.setState({ viewTick: true }) : this.setState({ viewTick: false })
        }
    }

    /**
     * onEmojiClickStatus() method to maintain state to append status and emoji in username field.
     */
    onEmojiClickStatus = (event, emojiObjectStatus) => {
        document.getElementById("status").focus();
        if (this.state.statusChars <= REACT_APP_STATUS_CHAR && this.state.statusChars > 1) {
            var userstatusemoji = this.state.userStatus + emojiObjectStatus.emoji;
            const charCountStatus = userstatusemoji.length;
            const charLeftStatus = REACT_APP_STATUS_CHAR - charCountStatus;
            this.setState({ statusChars: charLeftStatus, userStatus: userstatusemoji });
            (charLeftStatus == REACT_APP_STATUS_CHAR) ? this.setState({ viewTickStatus: true }) : this.setState({ viewTickStatus: false })
        }
    }

    /**
     * handleProfileImgDropDown() method to maintain state to show dropdown in profile page.
     */
    handleProfileImgDropDown = (e) => {
        this.state.showImgDropDown === false ? this.setState({ showImgDropDown: true }) : this.setState({ showImgDropDown: false });
    }

    /**
     * handleProfileImageShow() method to maintain state to show profile image in big screen.
     */
    handleProfileImageShow = (e) => {
        this.setState({ showProfileImg: true, showImgDropDown: false });
    }

    /**
     * handleProfileImgClose() method to maintain state to close profile image.
     */
    handleProfileImgClose = (e) => {
        this.setState({ showProfileImg: false });
    }

    handleProfileCameraShow = (e) => {
        this.setState({ showProfileCamera: true, showImgDropDown: false });
    }

    handleProfileCameraClose = (e) => {
        this.setState({ showProfileCamera: false });
    }

    handleProfilePhotoRemoveShow = (e) => {
        this.setState({ showProfilePhotoRemove: true, showImgDropDown: false });
    }

    handleProfileRemovephotoClose = (e) => {
        this.setState({ showProfilePhotoRemove: false });
    }

    handleProfileCameraClose = (e) => {
        this.setState({ showProfileCamera: false });
    }

    handleProfileCameraDone = (e) => {
        this.setState({ showProfileCamera: false });
    }

    /**
     * render() method to render the WebChatVCard Component into browser.
     */
    render() {
        const loaderStyle = {
            width: 40,
            height: 40
        }
        if (this.state.loaderStatus) {
            return <div className="loader-container"> <img src={loaderSVG} alt="loader" style={loaderStyle} /></div>
        }
        let { viewProfileStatus, profileImg, viewEditStatus, viewEdit, charCount, charCountStatus, showImgDropDown,
            showProfileImg, showProfileCamera, showProfilePhotoRemove, userName, userStatus, viewTick, viewTickStatus } = this.state;
        let { vCardData } = this.props;

        return (
            (vCardData && vCardData.data && <>
                <div className="profile-img-name" onClick={(e) => this.handleViewProfile(e)}>
                <div className="image">
                    {profileImg !== "" ? <img src={profileImg} alt="profile-snap" onError={(e) => this.handleOnErrorImage(e)} /> : <img src={SampleProfile} alt="without-profile" />}
                  </div>
                   <span>{vCardData.data.nickname}</span>
                </div>
                {viewProfileStatus && <div className="userprofile">
                    <div className="userprofile-popup">
                        <OutsideClickHandler
                            onOutsideClick={() => {
                                this.handleVCardClose();
                                this.setState({ viewProfileStatus: false, showImgDropDown: false });
                            }}
                        >
                            <div className="userprofile-header">
                                <i onClick={(e) => this.handleVCardClose(e)}>
                                    <Close />
                                </i>
                                <h5>{"Profile"}</h5>
                            </div>
                            <div className="userprofile-body">
                                <div className="userprofile-image">
                                    {profileImg !== "" ? <img src={profileImg} alt="profile-snap" /> : <img src={SampleProfile} alt="without-profile" />}
                                    <OutsideClickHandler
                                        onOutsideClick={() => {
                                            this.setState({ showImgDropDown: false });
                                        }}
                                    >
                                        <i className="camera-edit" onClick={(e) => this.handleProfileImgDropDown(e)}>
                                            <EditCamera />
                                        </i>
                                        {showImgDropDown &&

                                            <ul className="profile-dropdown">

                                                {profileImg && <>
                                                    <li title="View photo" onClick={(e) => this.handleProfileImageShow(e)}><i className="profileedit-options"><Viewphoto /></i><span>View photo</span></li>
                                                    <li title="Take Photo" onClick={(e) => this.handleProfileCameraShow(e)}><i className="profileedit-options"><Takephoto /></i><span>Take Photo</span></li>
                                                    <li title="Removephoto" onClick={(e) => this.handleProfilePhotoRemoveShow(e)}><i className="profileedit-options"><Remove /></i><span>Remove Photo</span></li>
                                                    <li title="Upload Photo"><i className="profileedit-options"><Upload /></i><span>Upload Photo</span></li>
                                                </>}

                                                {!profileImg && <>
                                                    <li title="Upload Photo"><i className="profileedit-options"><Upload /></i><span>Upload Photo</span></li>
                                                    <li title="Take Photo" onClick={(e) => this.handleProfileCameraShow(e)}><i className="profileedit-options"><Takephoto /></i><span>Take Photo</span></li>
                                                </>}
                                            </ul>} </OutsideClickHandler >
                                    {showProfileImg && <div className="Viewphoto-container">
                                        <div className="Viewphoto-preview">
                                            <img src={profileImg} alt="vcard-profile" />
                                            <i className="preview-close" onClick={(e) => this.handleProfileImgClose(e)}><Close /></i>
                                        </div>
                                    </div>}

                                    {showProfileCamera && <div className="camera-container">
                                        <div className="camera-popup">
                                            <h4>Camera Not Found</h4>
                                            <i>
                                                <CameraIcon />
                                            </i>
                                            <p>There was an error with accessing the camera</p>
                                            <div className="popup-controls">
                                                <button type="button" className="btn-okay" onClick={(e) => this.handleProfileCameraClose(e)} name="btn-cancel">{"Okay"}</button>
                                            </div>
                                        </div>
                                        <div className="camera-popup-visible">
                                            <div className="userprofile-header">
                                                <i onClick={(e) => this.handleProfileCameraClose(e)}><Close /></i>
                                                <h5>Take photo</h5>
                                            </div>
                                            <div className="cameraview">
                                                <img src={profilepreview} className="camera-pic" alt="" />
                                            </div>
                                            <div className="popup-controls">
                                                <i><Reset /></i>
                                                <i onClick={(e) => this.handleProfileCameraDone(e)}><Tick /></i>
                                            </div>
                                        </div>
                                    </div>}

                                    {showProfilePhotoRemove && <div className="removephoto-container">
                                        <div className="removephoto-popup">
                                            <div className="removephoto-label">
                                                <label>{"Remove your profile photo?"}</label>
                                            </div>
                                            <div className="removephoto-noteinfo">
                                                <button type="button" className="btn-cancel" onClick={(e) => this.handleProfileRemovephotoClose(e)} name="btn-cancel">{"Cancel"}</button>
                                                <button type="button" className="btn-removephoto" onClick={(e) => this.removeProfileImage(e)} name="btn-remove" >{"Remove"}</button>
                                            </div>
                                        </div>
                                    </div>}

                                </div>

                                <div className="profile">
                                    <div className="profile-details username">
                                        <i className="status"><Status /></i>
                                        <div className="form-control">
                                            {!viewEdit && <input type="text" value={userName}
                                                id="username"
                                                name="userName"
                                                onChange={this.handleWordCount}
                                                maxLength={REACT_APP_PROFILE_NAME_CHAR}
                                                autoFocus
                                            ></input>}
                                            {charCount && <span className="char-count">
                                                {this.state.usernameChars}
                                            </span>}
                                            {!viewEdit && <i className="emoji">
                                                <WebChatEmoji onEmojiClick={this.onEmojiClickUsername} />
                                            </i>}{viewEdit && <h4>
                                                {userName}
                                            </h4>}
                                        </div>
                                        <div className="controls">
                                            {!viewTick && <i className="done"
                                                onClick={(e) => this.handleVcardSaveUsername()}
                                            ><Done /></i>}
                                            {viewEdit && <i className="edit" onClick={(e) => this.handleEdit()}><Edit /></i>}
                                        </div>
                                    </div>

                                    <label className="">{"Your Status"}</label>
                                    <div className="profile-details status">
                                        <i className="status"><Status /></i>
                                        <div className="form-control">
                                            {!viewEditStatus && <input type="text" value={userStatus}
                                                id="status"
                                                name="userStatus"
                                                onChange={this.handleWordCountStatus}
                                                maxLength={REACT_APP_STATUS_CHAR}
                                                autoFocus
                                            ></input>}
                                            {charCountStatus && <span className="char-count">
                                                {this.state.statusChars}
                                            </span>}
                                            {!viewEditStatus && <i className="emoji">
                                                <WebChatEmoji onEmojiClick={this.onEmojiClickStatus} />
                                            </i>}{viewEditStatus && <h4>
                                                {userStatus}
                                            </h4>}
                                        </div>

                                        <div className="controls">
                                            {!viewTickStatus && <i className="done"
                                                onClick={(e) => this.handleVcardSaveStatus()}
                                            ><Done /></i>}
                                            {viewEditStatus &&
                                                <i className="edit" onClick={(e) => this.handleEditStatus()}><Edit /></i>}
                                        </div>
                                    </div>
                                    <div className="info">
                                        <i> <Info /> </i>
                                        <span>{VIEW_PROFILE_INFO}</span>
                                    </div>
                                </div>
                            </div>
                        </OutsideClickHandler>
                    </div>
                </div>}
            </>)
        )
    }
}

const mapStateToProps = (state, props) => {
    return ({
        vCardData: state.vCardData
    });
};

export default connect(mapStateToProps, null)(WebChatVCard);