import Router from "next/router";

import { Magic } from "magic-sdk";
import { useState } from "react";
import Layout from "../components/Layout";
import { useUser } from "../lib/hooks/useUser";
import axios from "axios";

const Login = () => {
  useUser({ redirectTo: "/publicar", redirectIfFound: true });

  const [emailData, setEmailData] = useState("");

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

      const responseUser = await axios.post("/api/v1/db/findUser", {
        email: body.email,
      });

      if (responseUser.data.count > 0) {
        const responseLogin = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + didToken,
          },
          body: JSON.stringify(body),
        });

        if (responseLogin.status == 200) {
          Router.push("/publicar");
        } else {
          console.log(await responseLogin.text());
        }
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
    }
  }

  return (
    <Layout>
      <form onSubmit={handleLogin}>
        <h1 className="text-[2rem] pt-[2rem] pl-[0.85rem] font-semibold md:pt-[2rem] md:pl-[15.5rem] md:text-[1.95rem]">
          Login
        </h1>

        <p className="text-[0.8rem] font-semibold top-[5.9rem] left-[1rem] md:left-[16rem] md:top-[5.45rem] md:text-[0.875rem] absolute">
          Email
        </p>
        <input
          onChange={(e) => {
            setEmailData(e.currentTarget.value);
          }}
          type="email"
          value={emailData}
          required
          className="text-5 px-4 py-[0.75rem] top-[7rem] left-[0.5rem] w-[24.7rem] border border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[6.725rem] md:left-[16rem] md:w-[31.5rem] absolute"
        ></input>

        <button className="w-[24.7rem] text-base top-[11.5rem] left-[0.5rem] border border-gray-400 px-3 py-[0.5rem] rounded-md text-white bg-[#2DA44E] focus:bg-[#8ac79b] md:text-base md:top-[10.5rem] md:left-[16rem] md:w-[31.5rem] absolute">
          Login
        </button>
      </form>
    </Layout>
  );
};

export default Login;
