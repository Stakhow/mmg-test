import ServiceDB from './../service';
import uuid from "react-uuid";

const service_db = new ServiceDB();


export const loadNotes = () => async dispatch => {
	const _notes = await getAllNotes();
	dispatch({
		type: 'LOAD_NOTES',
		payload: () => (_notes)
	});
};

export const addNewNote = note => async dispatch => {
	
	switch (localStorage.getItem('storage')) {
		
		case 'localStorage' :
			note.id = uuid();
			const notesFromLocalStorage = getDataFromLocalStorage('notes');
			localStorage.setItem('notes', notesFromLocalStorage !== null ?
				JSON.stringify([...notesFromLocalStorage, ...[note]]) : JSON.stringify([note]));
			getDataFromLocalStorage('notes');
			break;
		
		case 'fireBase' :
			await service_db.addNote(note);
			break;
		
		default :
			break;
	}
	
	dispatch({
		type: 'ADD_NEW_NOTE',
		payload: () => ([note])
	});
	
};

export const editNote = data => async dispatch => {
	switch (data.storage) {
		
		case 'localStorage' :
			const notesFromLocalStorage = getDataFromLocalStorage('notes') || [];
			const len = notesFromLocalStorage.length;
			for(let i=0; i<len; i++){
				if(notesFromLocalStorage[i]['id'] === data.id){
					notesFromLocalStorage[i]['name'] = data.name;
					notesFromLocalStorage[i]['content'] = data.content;
					break;
				}
			}
			localStorage.setItem('notes', JSON.stringify(notesFromLocalStorage));
			break;
		
		case 'fireBase' :
			await service_db.editNote(data);
			break;
		
		default :
			break;
	}
	const _notes =	await getAllNotes();
	dispatch({
		type: 'EDIT_NOTE',
		payload: () => (_notes)
	})
};

export const removeNote = (id, storage) => async dispatch => {
	switch (storage) {
		
		case 'localStorage' :
			const notesFromLocalStorage = getDataFromLocalStorage('notes');
			const updatesNotes = notesFromLocalStorage.filter(item => (item.id !== id));
			localStorage.setItem('notes', JSON.stringify(updatesNotes));
			break;
		
		case 'fireBase' :
			await service_db.removeNote(id);
			break;
		
		default :
			break;
	}
	
	
	dispatch({
		type: "REMOVE_NOTE",
		payload: () => (id)
	});
};


export const getSavingProps = () => {
	return{
		type: "GET_SETTINGS",
		payload: () => (localStorage.getItem('storage'))
	}};

export const setSavingProps = prop => ({
	type: "SAVE_SETTINGS",
	payload: () => {
		localStorage.setItem('storage', prop);
		return {key: prop, val: true}
	}
});

export const addNewComment = (id, data) => async dispatch => {
	
	switch (data.storage) {
		
		case 'localStorage' :
			const notesFromLocalStorage = getDataFromLocalStorage('notes');
			const updatesNotes = notesFromLocalStorage.filter(item => (item.id !== id));
			localStorage.setItem('notes', JSON.stringify(updatesNotes));
			const len = notesFromLocalStorage.length;
			for (let i = 0; i < len; i++) {
				if (notesFromLocalStorage[i]['id'] === id) {
					if (!notesFromLocalStorage[i].hasOwnProperty('comments')) {
						notesFromLocalStorage[i]['comments'] = [data];
					} else {
						notesFromLocalStorage[i]['comments'].push(data);
					}
					break;
				}
			}
			
			localStorage.setItem('notes', JSON.stringify(notesFromLocalStorage));
			break;
		
		case 'fireBase' :
			await service_db.addComment(id, data);
			break;
		
		default :
			break;
	}
	
	const _notes =	await getAllNotes();
	
	dispatch ({
		type: "ADD_NEW_COMMENT",
		payload: () => (_notes)
	})
};


/** Get data from localStorage
 * @param {string} key
 * @return {array}
 * */
function getDataFromLocalStorage(key){
	return	JSON.parse(localStorage.getItem(key))
}

/** Get all notes from LocalStorage and FireStore
 *
 * */
async function getAllNotes() {
	const notesFromFB = await service_db.getNotes() || [];
	const notesFromLocalStorage = await getDataFromLocalStorage('notes') || [];
	const notes = [...notesFromLocalStorage, ...notesFromFB];
	return notes ? notes : [];
}