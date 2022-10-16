import Router from "next/router";
import { useUser } from "../lib/auth/hooks";

import { Magic } from "magic-sdk";
import { useState } from "react";
import Layout from "../components/Layout";

const Login = () => {
  const [emailData, setEmailData] = useState("");

  useUser({ redirectTo: "/profile", redirectIfFound: true });

  async function handleLogin(event) {
    event.preventDefault();

    const body = {
      email: emailData,
    };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      });
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken
        },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        Router.push("/profile");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
    }
  }

  return (
    <Layout>
      
    </Layout>
  );
};

export default Login;
