import React from 'react';
import { REACT_APP_SECONDARY_COLOR } from '../processENV';

class Footer extends React.Component {

    render() {

        let styles={
            color: REACT_APP_SECONDARY_COLOR
        }

        return(
            <>
                <div>
                    <footer style={styles}>
                        Footer Page
                    </footer>
                </div>
            </>
        )
    }
}

export default Footer;