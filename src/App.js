import React, {Component} from 'react';
import './App.sass';
import NoteList from "./components/note-list";
import Header from "./components/header";
import Modal from 'react-modal';
import * as actions from './actions';
import { bindActionCreators } from "redux";
import {connect} from "react-redux";

Modal.setAppElement('#root');

class App extends Component{

	componentDidMount() {
		if (!localStorage.getItem('storage')){
			this.props.setSavingProps('localStorage');
		}
	}
	
	openModal() {
		this.setState({modalIsOpen: true});
	}
	
	 setSavingProp = () => {
		console.log('setSavingProp');
	};
	
	afterOpenModal() {
		// references are now sync'd and can be accessed.
		// this.subtitle.style.color = '#f00';
	}
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	render() {
		return (
			<div className="App">
				<Header storage={this.props.storage}/>
				<NoteList/>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	storage: state.storage,
	
});

const mapDispatchToProps = dispatch => {
	const { setSavingProps } = bindActionCreators(actions, dispatch);
	return {
		setSavingProps: val => {
			setSavingProps(val)
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
