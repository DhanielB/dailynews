import Router from "next/router";

import { Magic } from "magic-sdk";
import { useState } from "react";
import Layout from "../components/Layout";
import { useUser } from "../lib/hooks/useUser";
import axios from "axios";
import formatText from "../lib/hooks/formatText";
import InputForm from "../components/InputForm";

const SignUp = () => {
  useUser({ redirectTo: "/publicar", redirectIfFound: true });

  const [userError, setUserError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userData, setUserData] = useState("");
  const [emailData, setEmailData] = useState("");

  async function handleSignUp(event) {
    event.preventDefault();

    const body = {
      email: emailData,
    };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);

      const responseUser = await axios.post("/api/v1/db/findUser", {
        email: body.email,
      }, {
        headers: {
          request: process.env.NEXT_SECRET_API_KEY
        }
      });

      if (responseUser.data.count == 0) {
        const didToken = await magic.auth.loginWithMagicLink({
          email: body.email,
        });

        const responseCreateUser = await axios.post("/api/v1/db/createUser", {
          name: formatText(userData),
          email: body.email,
        }, {
          headers: {
            request: process.env.NEXT_SECRET_API_KEY
          }
        });

        if (responseCreateUser.status == 200) {
          const responseLogin = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
              request: process.env.NEXT_SECRET_API_KEY,
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
      } else {
        setEmailError("Usúario já existente");
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSignUp}>
        <h1 className="text-[2rem] pt-[2rem] pl-[0.85rem] font-semibold md:pt-[2rem] md:pl-[15.5rem] md:text-[1.95rem]">
          Cadastro
        </h1>

        <InputForm
          error={userError}
          className="name"
          text="Nome de Usuário"
          onChange={(e) => {
            setUserData(e.currentTarget.value);
          }}
          required
          maxLength={25}
        />

        <InputForm
          error={emailError}
          className="email"
          text="Email"
          type="email"
          onChange={(e) => {
            setEmailData(e.currentTarget.value);
          }}
          required
        />

        <button className="w-[24.7rem] text-base top-[18rem] left-[0.5rem] border border-gray-400 px-3 py-[0.5rem] rounded-md text-white bg-[#2DA44E] focus:bg-[#8ac79b] md:text-base md:top-[16rem] md:left-[16rem] md:w-[31.5rem] absolute">
          Criar Cadrastro
        </button>
      </form>

      <style jsx global>{`
        .email {
          top: 5.5rem;
          position: absolute;
        }

        @media (min-width: 768px) {
          .email {
            top: 5.225rem;
            position: absolute;
          }
        }
      `}</style>
    </Layout>
  );
};

export default SignUp;
