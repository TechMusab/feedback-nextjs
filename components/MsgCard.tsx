"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { Message } from '@/app/models/User';
import { toast } from 'sonner';
import axios from 'axios';
import { Trash2, MessageCircle, Calendar } from 'lucide-react';

type msgCardProps={
    message:Message,
    onDelete?: (messageId: string) => void,
}

export default function MsgCard({message, onDelete}:msgCardProps) {

    const handleDelete = async (messageId: string) => {
     const res=  await axios.delete(`/api/delete-message/${messageId}`)
        if (res.status === 200) {
            toast.success("Message deleted successfully");
            onDelete?.(messageId);
        } else {
            toast.error("Failed to delete message");
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Anonymous Message</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(message.createdAt)}
                            </CardDescription>
                        </div>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this message? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => handleDelete(message._id)}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {message.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
