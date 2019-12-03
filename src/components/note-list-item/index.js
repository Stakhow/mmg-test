import React, {Component, Fragment} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faComment } from '@fortawesome/free-solid-svg-icons';
import * as actions from './../../actions/index';
import {bindActionCreators} from "redux";
import { connect } from "react-redux";
import Modal from "react-modal";
import ContentEditable from 'react-contenteditable'

class NoteListItem extends Component {
	constructor(props){
		super(props);
		this.state = {
			modal: false,
			editable: false,
			commentable: false
		};
		this.noteName = React.createRef();
		this.noteContent = React.createRef();
		this.commentAuthor = React.createRef();
		this.commentContent = React.createRef();
		
		this.editableToggle = this.editableToggle.bind(this);
		this.commentableToggle = this.commentableToggle.bind(this);
	}
	
	editableToggle(){
		this.setState(({editable, modal})=>({editable: !editable, modal: !modal, }));
	}
	commentableToggle(e){
		e.stopPropagation();
		this.setState(({commentable, modal})=>({commentable: !commentable, modal: !modal}));
	}
	
	render() {
		const { note: {id, name, content, created_at, comments, storage}, editNote, removeNote, addNewComment } = this.props;
		const customStyles = {
			overlay: {
				backgroundColor: 'rgba(0,0,0,0.8)',
			},
			content : {
				top        : '50%',
				left       : '50%',
				right      : 'auto',
				bottom     : 'auto',
				marginRight: '-50%',
				padding    : '0',
				border     : 'none',
				transform  : 'translate(-50%, -50%)',
				maxWidth   : '90vw',
				width      : '280px',
				overflow   : 'visible'
			}
		};
		
		
		const CommentBlock = () => {
			if(comments && comments.length > 0 ) {
				return (comments.map((comment, idx) => (
					<div key={`comment-item_${idx}`} className="comment-item border-top border-secondary py-2">
						<div className="comment-item__author mb-2"><b>{comment.author}</b></div>
						<div className="d-flex">
							<div className="comment-item__img rounded-circle mr-2"><img src="/user-ico.png" alt=""/></div>
							<div className="comment-item__content">{comment.content}</div>
						</div>
						<div className="comment-item__date text-right">{comment.created_at}</div>
					</div>))
				)
			} else return ''
		};
		
		const closeModal = e =>{
			if(this.state.editable &&
				 this.noteName.current.innerText.length &&
				 this.noteContent.current.innerText.length ){
				editNote({
					id : id,
					name : this.noteName.current.innerHTML,
					content : this.noteContent.current.innerHTML,
					storage: storage
				});
				
			}
			
			if(this.state.commentable){
				if(this.commentAuthor.current.innerHTML.length &&
					this.commentContent.current.innerHTML.length > 0) {
					addNewComment(id,{
						author : this.commentAuthor.current.innerText,
						content : this.commentContent.current.innerText,
						created_at: new Date().toLocaleDateString(),
						storage: storage
					});
				}
			}
			
			this.setState({
				editable: false,
				commentable: false,
				modal: false,
			});
		};
		
		const removeNoteHandler = e => {
			e.stopPropagation();
			removeNote(id, storage);
		};
	
		const Note = () => (
			<div className={`rounded p-4 ${this.state.editable ? 'note-list-item editable' : 'note-list-item'}`}>
				<div className="note-list-item__inner">
					{this.state.editable ? <h5>Edit note</h5> : this.state.commentable ? <h5>Comment note</h5> : null}
					<div className="note-created-at text-right"><small>{created_at}</small></div>
					<ContentEditable
						innerRef={this.noteName}
						html={name}
						disabled={!this.state.editable}
						onChange={this.handleChange}
						tagName='h5'
						className={`title mb-3  ${this.state.editable ? 'editable-field' : '' }`}
					/>
					<ContentEditable
						innerRef={this.noteContent}
						html={content}
						disabled={!this.state.editable}
						onChange={this.handleChange}
						tagName='div'
						className={`content ${this.state.editable ? 'editable-field' : '' }`}
					/>
					
				</div>
				<div className="note-btn-manage pt-2">
					<button onClick={(e)=>{removeNoteHandler(e)}} type="button" title="Delete note" className="btn btn-light m-1 shadow-sm"><FontAwesomeIcon icon={faTrash} /></button>
					{!this.state.editable && !this.state.commentable ?
						<button onClick={this.commentableToggle} type="button" title="To comment" className="btn btn-light m-1 shadow-sm"><FontAwesomeIcon icon={faComment} /></button>
						:
						null
					}
					
				</div>
				
				{comments && comments.length > 0 && !this.state.commentable && !this.state.editable ? <div className="comment-wrap pt-3"><CommentBlock/></div> : null}

				{this.state.commentable ?
					<div className="new-comment border-top pt-2">
						<div>New Comment</div>
						<label htmlFor={this.commentAuthor}><small>Comment author</small></label>
						<ContentEditable
							innerRef={this.commentAuthor}
							html=''
							disabled={!this.state.commentable}
							onChange={this.handleChange}
							tagName='div'
							className={this.state.commentable ? 'editable-field mb-2' : '' }
						/>
						<label htmlFor={this.commentContent}><small>Comment message</small></label>
						<ContentEditable
							innerRef={this.commentContent}
							html=''
							disabled={!this.state.commentable}
							onChange={this.handleChange}
							tagName='div'
							className={this.state.commentable ? 'editable-field editable-field_textarea ' : '' }
						/>
					</div>
					:
					null
				}
			</div>
		);
		
		return(
			<Fragment>
				<Modal isOpen={this.state.modal} onRequestClose={closeModal} style={customStyles}>
					<Note/>
				</Modal>
				<div onClick={this.editableToggle} className={`col-xl-3 col-lg-4 col-md-6 col-12 mb-4 ${this.state.modal ? 'invisible' : ''}`}>
					<Note/>
				</div>
			</Fragment>
		)
	}
};

const mapDispatchToProps = dispatch => {
	const { editNote, removeNote, addNewComment} = bindActionCreators(actions, dispatch);
	return {
		editNote: data => {
			editNote(data)
		},
		removeNote: (id, storage) => {
			removeNote(id, storage)
		},
		addNewComment: (commentId, commentBody) => {
			addNewComment(commentId, commentBody)
		}
	}
};

export default connect(null, mapDispatchToProps)(NoteListItem);