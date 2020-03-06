import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ls } from './Helpers/LocalStorage';
import Loader from './Components/Layouts/Loader';
import "./assets/scss/common.scss";

window.addEventListener("DOMContentLoaded", function() {
    ls.removeItem("new_recent_chat_data");
 });

let ProviderComponent = React.lazy(() => import('./Provider/ProviderComponent'));
ReactDOM.render(<Suspense fallback={<Loader />}><ProviderComponent /></Suspense>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
