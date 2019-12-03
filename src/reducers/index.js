const reducer = (state = [], action) => {
	switch (action.type) {
		case "LOAD_NOTES" : {
			const {notes} = state;
			state.notes = [...notes, ...action.payload()];
			
			return {...state}
		}
		case "ADD_NEW_NOTE" : {
			const { notes } = state;
			state.notes = [ ...notes, ...action.payload()];
			return {...state}
		}
		case "REMOVE_NOTE" : {
			const { notes } = state;
			const updatedNotes = notes.filter(note => note.id !== action.payload());
			state.notes = [...updatedNotes];
			return {...state}
		}
		case "EDIT_NOTE" : {
			state.notes = [...action.payload()];
			return {...state}
		}
		case "SAVE_SETTINGS" : {
			const selectedStorage = action.payload();
			const { storage } = state;
			const __newObj = {};
			for (const property in storage) {
				if (storage.hasOwnProperty(property)) {
					if(property === selectedStorage.key) {
						__newObj[property] = selectedStorage.val;
					} else {
						__newObj[property] = !selectedStorage.val;
					}
				}
			}
			const res = Object.assign({}, storage, __newObj);
			
			return {...state, storage : {...res}}
		}
		case "GET_SETTINGS" : {
			const data = action.payload();
			if(data !== '' && data !== undefined) {
				for (const property in state.storage) {
					if (property === data) {
						state.storage[property] = true;
					} else {
						state.storage[property] = false;
					}
				}
			}
			return {...state}
		}
		case "ADD_NEW_COMMENT" : {
			state.notes = [...action.payload()];
			return {...state}
		}
		case "TEST" : {
			state.test.inner = true;
			return {...state}
		}
		default: return {...state}
	}
};

export default reducer;

