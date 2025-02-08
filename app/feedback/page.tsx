'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FeedbackForm from './FeedbackForm';

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Feedback</h1>
      <p className="text-xl mb-8">Share your thoughts and help us improve.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature Requests</CardTitle>
            <CardDescription>Suggest new features for the platform</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bug Reports</CardTitle>
            <CardDescription>Report issues you've encountered</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>General Feedback</CardTitle>
            <CardDescription>Share your overall experience</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Community Ideas</CardTitle>
            <CardDescription>Suggest improvements for the community</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
