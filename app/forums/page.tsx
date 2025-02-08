"use client";

import { useState, useEffect } from 'react';

interface Thread {
  id: number;
  title: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export default function ForumsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/forums');
      const data = await response.json();
      if (Array.isArray(data)) {
        setThreads(data);
      } else {
        console.error('Data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Assuming a default authorId for now
      const response = await fetch('/api/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newThreadTitle, authorId: 1 }), // Hardcoded authorId
      });
      if (response.ok) {
        fetchThreads(); // Refresh the thread list
        setNewThreadTitle(''); // Clear the input field
      } else {
        console.error('Failed to create thread');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  return (
    <div>
      <h1>Forums</h1>
      <form onSubmit={handleCreateThread}>
        <input
          type="text"
          placeholder="Thread title"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
        />
        <button type="submit">Create Thread</button>
      </form>
      <h2>Threads</h2>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>{thread.title}</li>
        ))}
      </ul>
    </div>
  );
}
