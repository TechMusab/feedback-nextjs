"use client";
import { Message } from "@/app/models/User";
import { acptmsgSchema } from "@/app/schemas/actmsgSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/app/types/apiResponse";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MsgCard from "@/components/MsgCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Link as LinkIcon, MessageCircle, Settings } from "lucide-react";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acptmsgSchema),
  });
  const { register, watch, setValue } = form;
  const acceptedMessages = watch("acceptMessages");

  const fetchAcceptedMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-msg");
      if (res.data.success) {
        setValue("acceptMessages", !!res.data.isAcceptingMsg);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching accepted messages:", error);
      toast.error("Failed to fetch accepted messages");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/get-msgs");
      
     
      if (res.data.success) {
        setMessages(res.data.messeges || []);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptedMessages();
  }, [session, fetchAcceptedMessages, fetchMessages]);

  const handleAcceptMessagesChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-msg", {
        acceptMessages: !acceptedMessages,
      });
      if (response.data.success) {
        setValue("acceptMessages", !acceptedMessages);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating accept messages:", error);
      toast.error("Failed to update accept messages");
    }
  };
const username= session?.user.username
 const baseUrl=`${window.location.protocol}//${window.location.host}`;
 const profileUrl= `${baseUrl}/u/${username}`;
 const copyToClipboard =  () => {
  navigator.clipboard.writeText(profileUrl)
  toast.success("Copied successfully")
 }
  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              Please login to access the dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session.user.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your anonymous messages and settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Link & Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Link Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Your Profile Link
                </CardTitle>
                <CardDescription>
                  Share this link to receive anonymous messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={profileUrl}
                    readOnly
                    className="flex-1"
                    placeholder="Profile URL"
                  />
                  <Button onClick={copyToClipboard} size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Anyone with this link can send you anonymous messages
                </p>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Message Settings
                </CardTitle>
                <CardDescription>
                  Control who can send you messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Accept Messages</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow others to send you messages
                    </p>
                  </div>
                  <Switch
                    {...register("acceptMessages")}
                    checked={acceptedMessages}
                    onCheckedChange={handleAcceptMessagesChange}
                    disabled={isSwitchLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Message Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Messages</span>
                    <span className="font-semibold">{messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                    <span className={`text-sm font-medium ${acceptedMessages ? 'text-green-600' : 'text-red-600'}`}>
                      {acceptedMessages ? 'Accepting' : 'Not Accepting'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Messages */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Anonymous Messages
                </CardTitle>
                <CardDescription>
                  Messages from your anonymous senders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No messages yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Share your profile link to start receiving anonymous messages
                    </p>
                    <Button onClick={copyToClipboard} variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Profile Link
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <MsgCard key={message._id} message={message} onDelete={handleDeleteMessage} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
