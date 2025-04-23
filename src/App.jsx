// src/App.js
import React from "react";
import NotesList from "./components/NotesList";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signOut } from "../config/firebase";
import Auth from "./components/Auth";

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="bg-blue-500 py-4 px-4 rounded-md flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-white tracking-tight">NoteCrypt</h1>
          {user && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
              onClick={() => signOut(auth)}
            >
              Sign Out
            </button>
          )}
        </header>

        {user ? (
          <div className="mt-6">
            <NotesList />
          </div>
        ) : (
          <>
            <Auth />
            <div className="mb-8 p-4 bg-amber-50 rounded-md shadow-md mt-10">
          <p className="text-lg leading-relaxed text-gray-700">
            <span className=" text-red-600">info :</span>  NoteCrypt is a secure digital note-taking application enabling users to create, store, edit, and delete their thoughts with end-to-end encryption ensuring enhanced privacy. The app prioritizes recency, displaying the latest notes prominently at the top of the user's list.
          </p>
        </div>
          </>
          
          
        )}
      </div>
      
    </div>
  );
}

export default App;