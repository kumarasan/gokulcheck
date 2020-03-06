import Utility from "../Helpers/Utility";
import { ls } from "./LocalStorage";

class Authorization {
  /**
   * Used for the futrue purpose
   */
  // static ROLE_CONFIG_MANAGER = "CONFIG MANAGER";
  // static ROLE_ADMIN = "ADMIN";

  constructor() {
    this.authUser = null;
    this.authUserId = null;
    this.authRole = null;
  }

  /**
   * set auth user details to class property
   *
   * @return void
   */
  setAuthUser() {
    this.authUser = JSON.parse(ls.getItem("auth_user"));
  }

  /**
   * check is active user is logged in
   *
   * @return boolean
   */
  isLoggedIn() {
    return typeof ls.getItem("auth_user") === "string";
  }

  /**
   * Once user is logged in, redirect the user to view permission page
   * By default will redirect to 'dashboard' page.
   * If user does not have permission to access dashboard page,
   * find the view permission page from the his permission object
   * and redirect the user to respective path.
   *
   * @param {*} props
   */
  redirectAfterLogin(props) {
    props.navigate("/");
  }

  /**
   * check user is having the expected role
   *
   * @param role
   * @return boolean
   */
  // isUserRole(role) {
  //   let user = this.getAuthUser();

  //   return (
  //     Utility.isObject(user) &&
  //     Utility.isObject(user.userRole) &&
  //     user.userRole.name === role
  //   );
  // }

  /**
   * check logged user is admin
   *
   * @return boolean
   */
  // isAdmin() {
  //   return this.isUserRole(Authorization.ROLE_ADMIN);
  // }

  /**
   * check logged user is config manager
   *
   * @return boolean
   */
  // isConfigManager() {
  //   return this.isUserRole(Authorization.ROLE_CONFIG_MANAGER);
  // }

  /**
   * get logged in user details
   *
   * @return boolean
   */
  getAuthUser() {
    if (this.isLoggedIn() && !this.authUser) {
      this.setAuthUser();
    }

    return this.authUser;
  }

  /**
   * get auth user identifier
   *
   * @return int
   */
  getAuthUserId() {
    let user = this.getAuthUser();
    user = user.data;
    return Utility.isObject(user) && user.userID ? user.userID : 0;
  }

  /**
   * Get authentication access token
   *
   * @return string
   */
  getAccessToken() {
    const authUser = this.getAuthUser();
    return authUser && Utility.isString(authUser.token) ? authUser.token : null;
  }

  /**
   * login the user by setting it in local storage
   *
   * @return boolean
   */
  login(data) {
    if (typeof Storage !== "undefined") {
      ls.removeItem("auth_user");
      ls.setItem("auth_user", JSON.stringify(data));
    } else {
      console.error("local storage is not supported");
    }
  }

  /**
   * get logged in user details
   *
   * @return boolean
   */
  logout() {
    //clear URL stored in localStorage
    if (typeof Storage !== "undefined") {
      ls.removeItem("auth_user");
      ls.removeItem("userProfile");
      this.authUser = null;
    } else {
      console.error("local storage is not supported");
    }
  }

  
}

export default new Authorization();
