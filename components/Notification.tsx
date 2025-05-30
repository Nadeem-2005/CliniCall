"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { Bell } from "lucide-react";

export default function NotificationPage({
  id,
  role,
}: {
  id: string;
  role: string;
}) {
  const [notifications, setNotifications] = useState<string[]>([]);
  const pusherRef = useRef<Pusher | null>(null);
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!id || !role) return;

    console.log("🔧 Setting up notifications for:", { id, role });

    // Clean up existing connections
    if (pusherRef.current) {
      channelsRef.current.forEach((channel) => {
        channel.unbind_all();
        channel.unsubscribe();
      });
      pusherRef.current.disconnect();
    }

    // Create new Pusher instance
    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    console.log(
      "📡 Pusher initialized with key:",
      process.env.NEXT_PUBLIC_PUSHER_KEY?.substring(0, 8) + "..."
    );

    channelsRef.current = [];

    // Admin notifications
    if (role === "admin") {
      console.log("👑 Setting up admin channel");
      const channel = pusherRef.current.subscribe("admin-channel");
      channelsRef.current.push(channel);

      channel.bind("new-doctor", (data: { name: string }) => {
        console.log("Admin received new-doctor notification:", data);
        setNotifications((prev) => [
          `New doctor: ${data.name} is waiting for approval`,
          ...prev,
        ]);
      });
    }

    // Doctor (user or doctor) notifications
    if (role === "user" || role === "doctor" || role === "hospital") {
      const channelName = `user-${id}`;
      console.log("Setting up public channel:", channelName);

      const channel = pusherRef.current.subscribe(channelName);
      channelsRef.current.push(channel);

      // Debug subscription status
      channel.bind("pusher:subscription_succeeded", () => {
        console.log(" Successfully subscribed to public channel:", channelName);
      });

      channel.bind("pusher:subscription_error", (error: any) => {
        console.error(
          "Failed to subscribe to public channel:",
          channelName,
          error
        );
      });

      channel.bind("doctor-approved", (data: { message: string }) => {
        console.log(" Received doctor-approved notification:", data);
        setNotifications((prev) => [data.message, ...prev]);
      });

      channel.bind("doctor-rejected", (data: { message: string }) => {
        console.log(" Received doctor-rejected notification:", data);
        setNotifications((prev) => [data.message, ...prev]);
      });

      channel.bind("hospital-approved", (data: { message: string }) => {
        console.log(" Received hospital-approved notification:", data);
        setNotifications((prev) => [data.message, ...prev]);
      });

      channel.bind("hospital-rejected", (data: { message: string }) => {
        console.log(" Received hospital-rejected notification:", data);
        setNotifications((prev) => [data.message, ...prev]);
      });
    }

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up Pusher connections");
      if (pusherRef.current) {
        channelsRef.current.forEach((channel) => {
          channel.unbind_all();
          channel.unsubscribe();
        });
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      channelsRef.current = [];
    };
  }, [id, role]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-blue-600" />
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong>
        <br />
        User ID: {id}
        <br />
        Role: {role}
        <br />
        Channel: user-{id}
      </div>

      {notifications.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No notifications yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((note, i) => (
            <li
              key={i}
              className="bg-muted p-4 rounded-lg shadow-sm border text-sm md:text-base"
            >
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
