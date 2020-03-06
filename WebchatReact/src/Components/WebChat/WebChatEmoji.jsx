import React from 'react';
import Picker from 'emoji-picker-react';
import OutsideClickHandler from 'react-outside-click-handler';
import "../../assets/scss/emoji.scss";

class WebChatEmoji extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewEmoji: false
    }
  }

  /**
   * handleEmoji(e) method to maintain state for emoji box to open/close.
   */
  handleEmoji(e) {
    this.setState({ viewEmoji: !this.state.viewEmoji });
  }

  /**
   * render() method to render the WebChatVCard Component into browser.
   */
  render() {
    let { viewEmoji } = this.state;
    return (
      <>
        <OutsideClickHandler
          onOutsideClick={() => {
            this.setState({ viewEmoji: false });
          }}
        >
          <i className="em em-slightly_smiling_face" onClick={(e) => this.handleEmoji()}></i>
          {viewEmoji && <Picker onEmojiClick={this.props.onEmojiClick} />}
        </OutsideClickHandler>
      </>
    );
  }
}

export default WebChatEmoji;
