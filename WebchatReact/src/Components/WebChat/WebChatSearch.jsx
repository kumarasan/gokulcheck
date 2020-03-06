import React from 'react';
import { ReactComponent as Search } from '../../assets/images/search.svg';

class WebChatSearch extends React.Component {

  /**
   * Following the states used in WebChatSearch Component.
   *
   */
  constructor(props) {
    super(props);
    this.searchFilterList = this.searchFilterList.bind(this);
  }

  /**
   * Following the states used in WebChatSearch Component.
   *
   * @param {object} event to handle the searched element.
   */
  searchFilterList(event) {
    var updatedList = this.props.rosterDataResponse;
    let searchType = this.props.searchIn;
    updatedList = updatedList.filter(function (item) {
      let filterData = (searchType == 'recent-chat') ? item.roster : item ;
      let filterVariable = (filterData.emailId) ? filterData.name : (filterData.displayName ? filterData.displayName : (filterData.nickName ? filterData.nickName : filterData.msgfrom));
      if(isNaN(filterVariable) && typeof(filterVariable) !== "undefined") {
        return filterVariable.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
      }
    });

    this.props.handleSearchFilterList(updatedList, event.target.value)
  }

  /**
   * render() method to render the WebChatSearch component into browser.
   */
  render() {
    return (
      <div className="search">
        <input type="text" name="search-contacts" placeholder="Search" onChange={this.searchFilterList}></input>
        <i className=""><Search/></i>
      </div>
    );
  }
}

export default WebChatSearch;