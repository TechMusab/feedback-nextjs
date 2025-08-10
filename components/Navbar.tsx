"use client";
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { MessageCircle, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-6 h-6" />
                        Mystery Message
                    </Link>
                    
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="hidden sm:inline">
                                        Welcome, {user?.username || user?.email}
                                    </span>
                                </div>
                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button 
                                    onClick={() => signOut()} 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Log out</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/sign-in">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
