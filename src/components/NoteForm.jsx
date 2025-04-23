// src/components/NoteForm.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { encrypt } from '../util/encryption';

function NoteForm({ editingNote, onNoteSaved }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user] = useAuthState(auth);
  const notesCollectionRef = collection(db, 'notes');

  useEffect(() => {
    // Update form values when editingNote changes
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((title.trim() || content.trim()) && user) {
      try {
        const encryptedTitle = encrypt(title);
        const encryptedContent=encrypt(content);
        if (editingNote) {
          const noteDocRef = doc(db, 'notes', editingNote.id);
          await updateDoc(noteDocRef, { title:encryptedTitle, content:encryptedContent, timestamp: new Date() });
        } else {
          await addDoc(notesCollectionRef, { title:encryptedTitle, content:encryptedContent, timestamp: new Date(), userId: user.uid });
        }
        onNoteSaved(); // Call the callback to clear editing state in parent
        setTitle('');
        setContent('');
      } catch (error) {
        console.error('Error saving note: ', error);
      }
    } else if (!user) {
      alert("Please log in to add notes.");
    }
  };

  const handleCancelEdit = () => {
    onNoteSaved(); // Call the callback to clear editing state
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Take a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {editingNote ? 'Save Edit' : 'Add Note'}
        </button>
        {editingNote && (
          <button
            className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
            type="button"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;