import Router from "next/router";

import { Magic } from "magic-sdk";
import { useState } from "react";
import Layout from "../components/Layout";
import { useUser } from "../lib/hooks/useUser";
import axios from "axios";
import InputForm from "../components/InputForm";

const Login = () => {
  useUser({ redirectTo: "/publicar", redirectIfFound: true });

  const [emailError, setEmailError] = useState("");
  const [emailData, setEmailData] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    const body = {
      email: emailData,
    };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);

      const responseUser = await axios.post("/api/v1/db/findUser", {
        email: body.email,
      });

      if (responseUser.data.count > 0) {
        const didToken = await magic.auth.loginWithMagicLink({
          email: body.email,
        });

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
      }else{
        setEmailError("Não foi possível encontrar este usúario")
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
    }
  }

  return (
    <Layout>
      <form>
        <h1 className="text-[2rem] pt-[2rem] pl-[0.85rem] font-semibold md:pt-[2rem] md:pl-[15.5rem] md:text-[1.95rem]">
          Login
        </h1>

        <InputForm error={emailError} text="Email" type="email"
          onChange={(e) => {
            setEmailData(e.currentTarget.value);
          }}
          required
        />
        <button
          className="w-[24.7rem] text-base top-[11.5rem] left-[0.5rem] border border-gray-400 px-3 py-[0.5rem] rounded-md text-white bg-[#2DA44E] focus:bg-[#8ac79b] md:text-base md:top-[10.5rem] md:left-[16rem] md:w-[31.5rem] absolute"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
    </Layout>
  );
};

export default Login;
