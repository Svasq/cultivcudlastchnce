'use client';

import { useEffect, useRef, useState } from 'react';
import { useOptimistic } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImagePlus, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  createdAt: string;
}

interface LiveChatProps {
  streamId: number;
}

export function LiveChat({ streamId }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const events = new EventSource(`/api/live/${streamId}/chat`);
    
    events.onmessage = (event) => {
      if (event.data === 'connected' || event.data === 'heartbeat') return;
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    };

    return () => events.close();
  }, [streamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch(`/api/live/${streamId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type: 'text' }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) throw new Error('Failed to upload file');
      const { url } = await uploadResponse.json();

      const type = file.type.startsWith('image/') ? 'image' : 'video';
      await fetch(`/api/live/${streamId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaUrl: url, type }),
      });
    } catch (error) {
      toast.error('Failed to upload media');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="h-[calc(100vh-2rem)]">
      <CardHeader>
        <CardTitle>Live Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{msg.username}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
            
            {msg.type === 'text' ? (
              <p className="text-sm">{msg.message}</p>
            ) : msg.type === 'image' ? (
              <img 
                src={msg.mediaUrl} 
                alt="User uploaded image"
                className="max-w-[200px] rounded-lg"
              />
            ) : (
              <video 
                src={msg.mediaUrl} 
                controls 
                className="max-w-[200px] rounded-lg"
              />
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isUploading}
          />
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus size={18} />
          </Button>
          <Button type="submit" size="icon" disabled={!message.trim() || isUploading}>
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 