import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";
import { useUser } from "../lib/hooks/useUser";
import { useRouter } from "next/router";
import { v4 } from "uuid";

import "katex/dist/katex.min.css";
import { Editor } from "@bytemd/react";
//import gfmPlugin from "@bytemd/plugin-gfm";
//import highlightSsrPlugin from "@bytemd/plugin-highlight-ssr";
//import mermaidPlugin from "@bytemd/plugin-mermaid";
//import breaksPlugin from "@bytemd/plugin-breaks";
//import gemojiPlugin from "@bytemd/plugin-gemoji";
//import mathSsrPlugin from "@bytemd/plugin-math-ssr";
//import mediumZoom from "@bytemd/plugin-medium-zoom";

//import byteMDLocale from "bytemd/locales/pt_BR.json";
//import gfmLocale from "@bytemd/plugin-gfm/locales/pt_BR.json";
//import mermaidLocale from "@bytemd/plugin-mermaid/locales/pt_BR.json";

import "bytemd/dist/index.min.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import findUser from "../lib/db/findUser";

export default function Publicar({ userFetched }) {
  const router = useRouter();
  const user = useUser({ redirectTo: "/cadastro" });

  //const bytemdPluginList = [
  //  gfmPlugin({ locale: gfmLocale }),
  //  highlightSsrPlugin(),
  //  mermaidPlugin({ locale: mermaidLocale }),
  //  breaksPlugin(),
  //  gemojiPlugin(),
  //  mathSsrPlugin(),
  //  mediumZoom(),
  //];

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [email, setEmail] = useState("");
  const [canPublish, setCanPublish] = useState(true);

  useEffect(() => {
    setTitle(window.localStorage.getItem("title"));
    setImages(
      JSON.parse(window.localStorage.getItem("images") || JSON.stringify("[]"))
    );
    setContent(window.localStorage.getItem("content"));
    setSource(window.localStorage.getItem("source"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("title", title || "");
  }, [title]);

  useEffect(() => {
    window.localStorage.setItem("images", JSON.stringify(images || []));
  }, [images]);

  useEffect(() => {
    window.localStorage.setItem("content", content || "");
  }, [content]);

  useEffect(() => {
    window.localStorage.setItem("source", source || "");
  }, [source]);

  async function handlePublish(event) {
    event.preventDefault();

    if (canPublish && title != "" && content.length > 50) {
      setCanPublish(false);

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
          auth: {
            email: email,
          },
        });

        if (responsePublish.status == 200) {
          window.localStorage.setItem("title", "");
          window.localStorage.setItem("images", JSON.stringify([]));
          window.localStorage.setItem("internalContent", "");
          window.localStorage.setItem("externalContent", "");
          window.localStorage.setItem("source", "");
          window.localStorage.setItem("confetti", "on");

          router.push(`/pagina/${formatText(by)}/${formatText(title)}`);
        }
      }
    }
  }

  function handleFile(event) {
    const fileReader = new FileReader();
    const { files } = event.target;

    fileReader.onload = async (e) => {
      const fileCode = v4();
      const fileContent = e.target.result;

      setImages((state) => [
        ...state,
        {
          text: fileCode,
          data: fileContent,
        },
      ]);

      setContent((state) => `${state}\n![](${fileCode})`);
    };

    for (let index = 0; index <= files.length - 1; index++) {
      fileReader.readAsDataURL(files[index]);
    }
  }

  useEffect(() => {
    setEmail(user?.email);
  }, [user]);

  return (
    <Layout>
      {!userFetched.nuked ? (
        <div>
          <h1 className="font-semibold text-[2rem] mt-[1.5rem] ml-[1.625rem] md:text-[2rem] md:mt-[1.5rem] md:ml-[1.625rem]">
            Publicar novo conteúdo
          </h1>
          <input
            onChange={(e) => {
              setTitle(e.currentTarget.value);
            }}
            className="text-5 px-4 py-[0.5rem] top-[6rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[6rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
            placeholder="Título"
            value={title}
            required={true}
          ></input>
          <div>
            <Editor
              onChange={(value) => {
                setContent(value);
              }}
              value={content}
              
            ></Editor>
          </div>
          <input
            onChange={(e) => {
              setSource(e.currentTarget.value);
            }}
            value={source}
            className="px-4 py-[0.5rem] top-[28.75rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[28.75rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
            placeholder="Fonte (Opicional)"
          ></input>
          <button
            onClick={() => {
              router.back();
            }}
            className="top-[33rem] left-[14rem] text-gray-600 md:text-base md:top-[34rem] md:left-[52rem] absolute"
          >
            Cancelar
          </button>
          <button
            onClick={handlePublish}
            className="text-base top-[32.75rem] left-[19.5rem] border border-gray-500 px-3 py-[0.15rem] rounded-md text-white bg-[#2DA44E] md:text-base md:top-[33.75rem] md:left-[57.5rem] absolute"
          >
            Publicar
          </button>
          <style global jsx>{`
            .bytemd {
              position: absolute;
              height: 18rem;
              border-color: #000000;
              border-opacity: 0.2;
              outline: 0;
              padding-left: 8rem;
              padding-right: 1.5rem;
              top: 9.725rem;
              left: 1.625rem;
              width: 22.5rem;
              padding: 1px;
              border-radius: 0.375rem;
              border: 2px solid #d0d7de;
              position: absolute;
            }

            .bytemd .CodeMirror * {
              font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo,
                monospace;
            }

            .is-invalid .bytemd {
              border-color: #cf222e;
            }

            .is-invalid .bytemd:focus-within {
              border-color: #cf222e;
              box-shadow: 0 0 0 3px rgb(164 14 38 / 40%);
            }

            .bytemd .bytemd-toolbar {
              border-top-left-radius: 6px;
              border-top-right-radius: 6px;
            }

            .bytemd
              .bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:nth-of-type(1),
            .bytemd
              .bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:nth-of-type(4) {
              display: none;
            }

            .bytemd .bytemd-status {
              display: none;
            }

            .bytemd-fullscreen.bytemd {
              z-index: 100;
              width: 100%;
              border-radius: 0px;
            }

            .tippy-box {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                Helvetica, Arial, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji";
            }

            @media (min-width: 768px) {
              .bytemd {
                top: 9.725rem;
                left: 1.625rem;
                width: 60.75rem;
              }
            }
          `}</style>
        </div>
      ) : (
        <div>
          <svg
            width="800"
            height="800"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="800" height="800" fill="white" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M575 225C616.422 225 650 258.579 650 300V550C650 591.423 616.422 625.001 575 625.001H225C183.579 625.001 150 591.423 150 550V300C150 258.579 183.579 225 225 225H575ZM600 365.62H425.002C411.197 365.62 396.107 355.127 391.302 342.183L366.357 275H225C211.193 275 200 286.193 200 300V550C200 563.808 211.193 575.001 225 575.001H575C588.807 575.001 600 563.808 600 550V365.62Z"
              fill="#24292F"
            />
            <path
              d="M364.951 488H240C247.806 515.143 272.822 535 302.475 535C332.129 535 357.145 515.143 364.951 488Z"
              fill="#24292F"
            />
            <path
              d="M559.951 488H435C442.806 515.143 467.822 535 497.475 535C527.129 535 552.145 515.143 559.951 488Z"
              fill="#24292F"
            />
            <path
              d="M495 187.571C495 180.628 499.925 175 506 175H554C560.075 175 565 180.628 565 187.571V242.429C565 249.372 560.075 255 554 255H506C499.925 255 495 249.372 495 242.429V187.571Z"
              fill="#24292F"
            />
            <path
              d="M235 187.571C235 180.628 239.925 175 246 175H294C300.075 175 305 180.628 305 187.571V242.429C305 249.372 300.075 255 294 255H246C239.925 255 235 249.372 235 242.429V187.571Z"
              fill="#24292F"
            />
          </svg>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  const { data } = await findUser({
    limit: 1000,
    page: 0,
  });

  return {
    props: {
      userFetched: data[0],
      page: 0,
    },
  };
}
