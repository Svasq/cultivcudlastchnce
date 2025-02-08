"use client";

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { useState, useEffect } from 'react';

interface Thread {
  id: number;
  title: string;
  body: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export default function ForumsPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadBody, setNewThreadBody] = useState('');

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
        setThreads([]);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  const handleCreateThread = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Assuming a default authorId for now
      const response = await fetch('/api/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newThreadTitle, body: newThreadBody, authorId: 1 }), // Hardcoded authorId
      });
      if (response.ok) {
        fetchThreads(); // Refresh the thread list
        setNewThreadTitle(''); // Clear the input field
        setNewThreadBody(''); // Clear the textarea
      } else {
        console.error('Failed to create thread');
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Forums</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Thread</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <Input
                type="text"
                placeholder="Thread title"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
              />
              <Textarea
                placeholder="Thread body"
                value={newThreadBody}
                onChange={(e) => setNewThreadBody(e.target.value)}
              />
              <Button type="submit">Create Thread</Button>
            </form>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Threads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {threads.map((thread) => (
            <Card key={thread.id}>
              <CardHeader>
                <CardTitle>{thread.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{thread.body}</p>
                <p className="text-sm text-gray-500">
                  Created at:{" "}
                  {new Date(thread.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
