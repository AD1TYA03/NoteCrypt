// src/components/NoteItem.js
import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from "date-fns";

function NoteItem({ note , onEdit }) {
  const handleDelete = async () => {
    try {
      const noteDocRef = doc(db, 'notes', note.id);
      await deleteDoc(noteDocRef);
    } catch (error) {
      console.error('Error deleting note: ', error);
    }
  };

  const handleEdit = ()=>{
    onEdit(note);
  }

  const formatDate =(timestamp)=>{
    if(timestamp && timestamp.toDate){
      const date=timestamp.toDate();
      return format(date, 'yyyy-MM-dd HH:mm');
    }
    return 'No Date'
  }


  return (
    <div className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition duration-200">
      <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
      <p className="text-gray-700 text-sm line-clamp-3">{note.content}</p>
      <span className="text-gray-500 text-xs">{formatDate(note.timestamp)}</span>
      <div className="mt-4 flex justify-end space-x-2">
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleDelete}>
          Delete
        </button>
        <button className=" bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleEdit}>
          Edit
        </button>
      </div>
    </div>
  );
}

export default NoteItem;