"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");



  const handleLogin = async () => {


    const { data, error } = await supabase.auth.signInWithPassword({

      email,

      password,

    });



    if(error){

      setError(error.message);

      return;

    }

    await supabase.auth.refreshSession();

    setEmail("");
    setPassword("");

    router.push("/admin");


  };



  return(

    <main className="login-page">


      <h1>
        WELMEG Admin Login
      </h1>


      <input
  type="email"
  placeholder="Admin Email"
  autoComplete="off"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/> 

      



      <input
  type="password"
  placeholder="Password"
  autoComplete="new-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>



      {
        error && (

          <p>
            {error}
          </p>

        )
      }



      <button
        onClick={handleLogin}
      >

        Login

      </button>


    </main>

  );

}