import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import * as firebase from 'firebase/app';
// import 'firebase/firestore';
// import { firebaseConfig } from './configs';
import initialState from './initial-state';
import { createStore, applyMiddleware, compose } from "redux";
import reducer from './reducers';
import {Provider} from "react-redux";
import thunk from "redux-thunk";

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)) );

store.subscribe(()=>{
	console.log(store.getState());
});



ReactDOM.render(
	<Provider store={store}><App /></Provider>,
	document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
