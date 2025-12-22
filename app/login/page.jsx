"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    setMessage(error ? error.message : "Check your email to confirm signup");
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setMessage(error.message);
    } else {
      router.push("/games");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Pickup Soccer</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={signIn}>Log In</button>
      <button onClick={signUp}>Sign Up</button>

      <p>{message}</p>
    </div>
  );
}
