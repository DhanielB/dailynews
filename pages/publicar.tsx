import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";
import { useUser } from "../lib/hooks/useUser";
import Router from "next/router";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import ReactMarkdown from '../components/Markdown'

export default function Publicar() {
  const user = useUser({ redirectTo: "/cadastro" });

  const [mode, setMode] = useState("write");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [email, setEmail] = useState("");
  const [canPublish, setCanPublish] = useState(true)

  async function handlePublish(event) {
    event.preventDefault();

    if(canPublish) {
      setCanPublish(false)

      const responseUser = await axios.post("/api/v1/db/findUser", {
        email: email,
      });

      if (responseUser.data?.data.length > 0) {
        const by = responseUser.data?.data[0]?.name;

        const responsePublish = await axios.post("/api/v1/db/createNews", {
          title: title,
          by: by,
          slug: `/pagina/${formatText(by)}/${formatText(title)}`,
          sourceUrl: source,
          content: content,
        });

        if (responsePublish.status == 200) {
          Router.push(`/pagina/${formatText(by)}/${formatText(title)}`);
        }
      }
    }
  }

  useEffect(() => {
    setEmail(user?.email);
  }, [user])

  return (
    <Layout>
      <form onSubmit={handlePublish}>
        <h1 className="font-semibold text-[2rem] mt-[1.5rem] ml-[1.625rem] md:text-[2rem] md:mt-[1.5rem] md:ml-[1.625rem]">
          Publicar novo conteúdo
        </h1>

        <input
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
          className="text-5 px-4 py-[0.5rem] top-[6rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[6rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
          placeholder="Título"
        ></input>

        <div>
          {mode == "view" ? (
            <div className="flex flex-col overflow-auto">
              <ReactMarkdown children={content} className="markdown-body flex flex-col overflow-auto box-border h-72 pl-[8rem] pr-[1.5rem] first-line:pr-[8rem] py-[3rem] top-[9.725rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-[8rem] md:py-[3rem] md:top-[9.725rem] md:left-[1.625rem] md:w-[60.75rem] absolute"/>
            </div>
          ) : (
            <div>
              <textarea
              className="h-72 pl-[8rem] pr-[1.5rem] first-line:pr-[8rem] py-[3rem] top-[9.725rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-[8rem] md:py-[3rem] md:top-[9.725rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
                onChange={(e) => {
                  setContent(e.currentTarget.value);
                }}
              defaultValue={content}
              value={content}
            ></textarea>
          </div>
        )}

        <button
          onClick={() => {
            setMode("write");
          }}
          className="write z-50 text-[0.9rem] top-[10rem] left-[3rem] md:text-[0.9rem] md:top-[10rem] md:left-[3rem] absolute"
        >
          Escrever
        </button>
        <button
          onClick={() => {
            setMode("view");
          }}
          className="view z-50 text-[0.9rem] top-[10rem] left-[7.5rem] md:text-[0.9rem] md:top-[10rem] md:left-[7.5rem] absolute"
        >
          Visualizar
        </button>
      </div>

      <input
        onChange={(e) => {
          setSource(e.currentTarget.value);
        }}
        className="px-4 py-[0.5rem] top-[28.75rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[28.75rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
        placeholder="Fonte (Opicional)"
      ></input>

      <button className="top-[33rem] left-[14rem] text-gray-600 md:text-base md:top-[34rem] md:left-[52rem] absolute">
        Cancelar
      </button>
      <button
        onClick={handlePublish}
        className="text-base top-[32.75rem] left-[19.5rem] border border-gray-500 px-3 py-[0.15rem] rounded-md text-white bg-[#2DA44E] md:text-base md:top-[33.75rem] md:left-[57.5rem] absolute"
      >
        Publicar
      </button>

      <style jsx>{`
        .view {
          ${mode == "view" ? "color: RoyalBlue;" : null}
        }

        .write {
          ${mode == "write" ? "color: RoyalBlue;" : null}
        }
      `}</style>
     </form>
    </Layout>
  );
}
