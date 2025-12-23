import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle } from "lucide-react";

export const AuthDialogs = () => {
  const { toast } = useToast();
  const { user, register, login, logout } = useAuth();

  const [regOpen, setRegOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doRegister = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await register(
        phone,
        email,
        password,
        pos.coords.latitude,
        pos.coords.longitude
      );
      if (res.success) {
        toast({ title: "Registered successfully" });
        setRegOpen(false);
      } else toast({ title: "Error", description: res.message });
    });
  };

  const doLogin = async () => {
    const res = await login(phone, password);
    if (res.success) {
      toast({ title: "Signed in" });
      setLoginOpen(false);
    } else toast({ title: "Error", description: res.message });
  };

  return (
    <div className="flex gap-2">
      {!user && (
        <>
          <Dialog open={regOpen} onOpenChange={setRegOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost">Register</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create account</DialogTitle>
              </DialogHeader>

              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />

              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />

              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <DialogFooter>
                <Button onClick={doRegister}>Register</Button>
              </DialogFooter>

              <div className="mt-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 text-xs"> <div className="flex gap-2"> <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" /> <div> <p className="font-semibold">AQI alerts will be sent to your registered email id.<br />WhatsApp Alerts (Sandbox)</p> <p className="text-muted-foreground mt-1"> To receive WhatsApp AQI alerts: </p> <ol className="list-decimal ml-4 mt-1 text-muted-foreground"> <li>Save <b>+1 415 523 8886</b></li> <li> Send <b>join nails-feathers</b> on WhatsApp </li> <li>Sandbox valid for 72 hours</li> </ol> </div> </div> </div> </DialogContent> </Dialog>

          <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Sign In</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
              </DialogHeader>

              <Input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <DialogFooter>
                <Button onClick={doLogin}>Sign In</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {user && (
        <>
          <span>{user.phone}</span>
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </>
      )}
    </div>
  );
};
