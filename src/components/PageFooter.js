import React from 'react'
import Footer from 'rc-footer';
import 'rc-footer/assets/index.css'; // import 'rc-footer/asssets/index.less';
import { render } from 'react-dom';

function PageFooter(props) {
    return (
        <Footer className={props.className} bottom="Made with ❤️ by Piyush Khanna" />
    )
}

export default PageFooter

