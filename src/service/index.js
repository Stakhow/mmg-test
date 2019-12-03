import 'firebase/firestore';
import * as firebase from 'firebase/app';
import { firebaseConfig } from './../configs';

export default class ServiceDB {
	constructor(){
		try {
			firebase.initializeApp(firebaseConfig);
			this.db = firebase.firestore();
		} catch (e) {
			console.error('Error connect to FireBase', e);
		}
		
	}
	
	async getNotes(){
		const _notes = [];
		try {
			await this.db.collection("notes").get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						_notes.push( doc.data() );
					});
				});
			return _notes;
		} catch (e) {
			console.error('Error', e);
		}
	}
	
	async addNote(note) {
		try {
			await this.db.collection("notes").doc(note.id).set(note)
				.then( docRef => {})
				.catch( error => {
					console.error("Error adding document: ", error);
				});
		} catch (e) {
			console.error('Error', e);
		}
	}
	
	async removeNote(id){
		try {
			await this.db.collection('notes')
				.doc(id)
				.delete()
				.then(function () {
					console.log("Document successfully deleted!");
				}).catch(
					function(error) {
						console.error("Error removing document: ", error);
					});
		} catch (e) {
			console.error("Error", e);
		}

	}
	
	async editNote(data){
		try {
			await this.db.collection("notes").doc(data.id).update({
				id : data.id,
				name : data.name ,
				content : data.content ,
				storage: data.storage
			});
			
		} catch (e) {
			console.error("Error", e);
		}
	}
	
	async addComment(id, data){
		try {
			let _comments = [];
			await this.db.collection("notes").doc(id)
				.get()
				.then(doc => {
					if (doc.data().comments) {
						_comments = doc.data().comments;
					}
				}).catch(error => {
				console.log("Error getting document:", error);
			});
			
			_comments.push(data);
			
			await this.db.collection("notes").doc(id).update({ comments: _comments });
		} catch (e) {
			console.error("Error", e);
		}
	}
}






