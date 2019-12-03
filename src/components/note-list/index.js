import React, {Component} from 'react';
import './index.sass';
import NoteListItem from "../note-list-item";
import * as actions from "../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class NoteList extends Component{
	
	componentDidMount() {
		this.props.loadNotes();
	}
	
	render() {
		const {notes}= this.props;
		const NotesList = () => {
			return notes.map((note, idx) => {
				return (<NoteListItem key={`noteListItem_${idx}`} note={note}/>)
			})
		};
		
		const Empty = <div className="text-muted display-1 text-center w-100">Empty...</div>;
		return (
			<div className="container">
				<div className="row">
					{notes && notes.length ? <NotesList/> : Empty}
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	notes: state.notes,
});

const mapDispatchToProps = dispatch => {
	const { loadNotes } = bindActionCreators(actions, dispatch);
	return {
		loadNotes: () => {
			loadNotes()
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);