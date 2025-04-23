import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import NoteItem from './NoteItem';
import NoteForm from './NoteForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { decrypt } from '../util/encryption';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const notesCollectionRef = collection(db, 'notes');
      const q = query(notesCollectionRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: decrypt(doc.data().title),
          content: decrypt(doc.data().content),
          timestamp: doc.data().timestamp,
          userId: doc.data().userId,
        }));
        setNotes(notesData);
      });
      return () => unsubscribe();
    } else {
      setNotes([]);
    }
  }, [user]);

  const handleEditNote = (noteToEdit) => {
    setEditingNote(noteToEdit);
  };

  const handleNoteSaved = () => {
    setEditingNote(null);
  };

  async function handleDeleteNote(noteId) {
    if (user) {
      try {
        const noteDocRef = doc(db, 'notes', noteId);
        await deleteDoc(noteDocRef);
        console.log(`Note with ID ${noteId} deleted successfully.`);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    } else {
      alert('Please log in to delete notes.');
    }
  }

  return (
    <div className="p-4">
      <NoteForm editingNote={editingNote} onNoteSaved={handleNoteSaved} />
      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.isArray(notes) ? ( // Added check to ensure notes is an array
          notes.map((note) => (
            <NoteItem key={note.id} note={note} onEdit={handleEditNote} onDelete={handleDeleteNote} />
          ))
        ) : (
          <div className="text-red-500">Error loading notes.</div>
        )}
        {Array.isArray(notes) && notes.length === 0 && (
          <div className="text-gray-500 italic">No notes yet. Add a new one!</div>
        )}
      </div>
    </div>
  );
}

export default NotesList;