import React, { Fragment } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare, faTools} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import {ModalConsumer, ModalProvider} from "../modals/modals-src/modal-context";
import ModalRoot from "../modals/modals-src/modal-root";
import {bindActionCreators} from "redux";
import * as actions from "../../actions";
import {connect} from "react-redux";
import AddNewNoteModal from "../modals/add-new-note";


const Header = props => {
	const { setSavingProps, addNewNote, storage, getSavingProps} = props;
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
	getSavingProps();
	
	const StorageOptions = Object.keys(storage).map((key, idx) => (
		<div key={`StorageOptions_${idx}`} className="form-group col-6">
			<label htmlFor="name">{key}</label>
			<input type="radio" name="storage" value={key} className="form-control" id={key} defaultChecked={storage[key]}/>
		</div>
	));
	
	const SetSavingSettingModal = ({ onRequestClose, ...otherProps }) => {
		const formHandler = e => {
			otherProps.setSavingProps(e);
			onRequestClose();
		};
		return (
			<Modal isOpen onRequestClose={onRequestClose} {...otherProps} style={customStyles}>
				<div className="modal-dialog m-0" role="document">
					<form onSubmit={(e)=>{formHandler(e)}}>
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Set storage</h5>
								<button type="button" className="close" onClick={onRequestClose}>
									<span>&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<div className="row">{otherProps.storageOpts}</div>
							</div>
							<div className="modal-footer d-flex justify-content-center">
								<button type="button" className="btn btn-secondary"onClick={onRequestClose} >Close</button>
								<button type="submit" className="btn btn-primary" >Save</button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
		)};
	
	const setSavingFormHandler = e => {
		e.preventDefault();
		const formData = new FormData(e.target);
		setSavingProps(formData.get('storage'))
	};
	
	return (
		<header className="main-header jumbotron text-center py-5 position-relative">
			<h1>Simple Notes</h1>
			<div className="btn-manage position-absolute">
				<ModalProvider>
					<ModalRoot/>
					<ModalConsumer>
						{({ showModal }) => (
							<Fragment>
								<button onClick={() => showModal(AddNewNoteModal, {addNewNote: addNewNote})} type="button" title="Add new note" className="btn btn-light m-1 shadow-sm"><FontAwesomeIcon icon={faPlusSquare} /></button>
								<button onClick={() => showModal(SetSavingSettingModal, {setSavingProps: setSavingFormHandler, storageOpts: StorageOptions})} type="button" title="Set saving props" className="btn btn-light m-1 shadow-sm"><FontAwesomeIcon icon={faTools} /></button>
								<button onClick={()=>localStorage.clear()}>Clear localStorage</button>
							</Fragment>
						)}
					</ModalConsumer>
				</ModalProvider>
			</div>
		</header>
	)
};

const mapStateToProps = state => ({
	storage : state.storage,
});

const mapDispatchToProps = dispatch => {
	const { setSavingProps, addNewNote, getSavingProps } = bindActionCreators(actions, dispatch);
	return {
		addNewNote: note => {
			addNewNote(note)
		},
		setSavingProps: val => {
			setSavingProps(val)
		},
		getSavingProps: () => {
			getSavingProps()
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);