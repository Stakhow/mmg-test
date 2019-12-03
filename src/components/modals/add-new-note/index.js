import React, { Component } from "react";
import Modal from "react-modal";
import uuid from "react-uuid";



class AddNewNoteModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			isSendFormAllowed: false,
			fieldsValidated: {
				name: false,
				content: false
			}
		};
		this.addNewNoteFormRef = React.createRef();
		this.validateField = this.validateField.bind(this);
		this.checkIsFormValid = this.checkIsFormValid.bind(this);
	}
	
	submitForm(e){
		e.preventDefault();
		const formData = new FormData(this.addNewNoteFormRef.current);
		this.props.addNewNote({
			id: uuid(),
			name: formData.get('name'),
			content: formData.get('content'),
			created_at: new Date().toLocaleDateString(),
			storage: localStorage.getItem('storage')
		})
	};
	
	validateField(name, value){
		this.setState(({fieldsValidated})=>{fieldsValidated[name] = value})
	}
	
	checkIsFormValid = async (name, val) => {
		const {fieldsValidated} = this.state;
		await this.validateField(name, val);
		for(const prop in fieldsValidated){
			if (fieldsValidated.hasOwnProperty(prop)){
				if (fieldsValidated[prop] !== true){
					this.setState({isSendFormAllowed : false});
					break;
				} else {
					this.setState({isSendFormAllowed : true});
				}
			}
		}
	};
	
	onChangeHandler(e){
		const target = e.target,
					errorLable = document.createElement("div"),
					// form = this.addNewNoteFormRef.current,
					children = target.parentNode.childNodes;
		
		errorLable.classList.add('invalid-feedback');
		errorLable.append('This field is required');
		
		if (target.value === '') {
			if(!checkInvalidFeedbackExists()) target.parentNode.append(errorLable);
			target.classList.add('is-invalid');
			this.checkIsFormValid(target.getAttribute('name'), false);
		
		} else {
			target.classList.add('is-valid');
			target.classList.remove('is-invalid');
			this.checkIsFormValid(target.getAttribute('name'), true);
		}
		
		function checkInvalidFeedbackExists(){
			for(let i=0; i<children.length; i++){
				if (children[i].classList.contains('invalid-feedback'))	return true
			}
			return false
		}
		
	};
	
	render() {
		const { onRequestClose } = this.props;
		const { isSendFormAllowed } = this.state;
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
		const submitFormHandler = e => {
			e.preventDefault();
			e.stopPropagation();
			if(isSendFormAllowed === true){
				onRequestClose();
				this.submitForm(e);
			}
		};
		
		return (
			<Modal isOpen onRequestClose={onRequestClose} style={customStyles}>
				<div className="modal-dialog m-0" role="document">
					<form onChange={(e)=>{ this.onChangeHandler(e) }}
					      onSubmit={(e)=>{ submitFormHandler(e) }}
					      ref={this.addNewNoteFormRef}>
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Add new note</h5>
								<button type="button" className="close" onClick={onRequestClose}>
									<span>&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="form-group">
									<label htmlFor="name">Name</label>
									<input type="text" name="name" className="form-control" id="name" placeholder="Enter name of note"/>
								</div>
								<div className="form-group">
									<label htmlFor="content">Note message</label>
									<textarea name="content" className="form-control" id="content" rows="6" placeholder="Enter text of note"/>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" onClick={onRequestClose}>Close</button>
								<button type="submit" className="btn btn-primary" disabled={!isSendFormAllowed}>Save</button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		)
	}
}

export default AddNewNoteModal;