import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";
import { useUser } from "../lib/hooks/useUser";
import { useRouter } from "next/router";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { v4 } from "uuid"
import { Editor } from "@bytemd/react"
import 'bytemd/dist/index.min.css';

export default function Publicar() {
  const router = useRouter();
  //const user = useUser({ redirectTo: "/cadastro" });

  const [images, setImages] = useState([])
  const [mode, setMode] = useState("write");
  const [title, setTitle] = useState("");
  const [internalContent, setInternalContent] = useState("");
  const [externalContent, setExternalContent] = useState("");
  const [source, setSource] = useState("");
  const [email, setEmail] = useState("");
  const [canPublish, setCanPublish] = useState(true);

  useEffect(() => {
    setTitle(window.localStorage.getItem("title"));
    setImages(JSON.parse(window.localStorage.getItem("images") || JSON.stringify("[]")))
    setInternalContent(window.localStorage.getItem("internalContent"));
    setExternalContent(window.localStorage.getItem("externalContent"));
    setSource(window.localStorage.getItem("source"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("title", title || "");
  }, [title]);

  useEffect(() => {
    window.localStorage.setItem("images", JSON.stringify(images || []));
  }, [images])

  useEffect(() => {
    window.localStorage.setItem("externalContent", externalContent || "");
  }, [externalContent]);

  useEffect(() => {
    window.localStorage.setItem("internalContent", internalContent || "");
  }, [internalContent]);

  useEffect(() => {
    window.localStorage.setItem("source", source || "");
  }, [source]);

  useEffect(() => {
    let contentWithImage = externalContent

    for(let image of images) {
      contentWithImage = contentWithImage.replaceAll(image.text, image.data)
    }

    setInternalContent(contentWithImage)
    console.log(`1: ${internalContent}, 2: ${externalContent}, 3: ${images}, 4: ${contentWithImage}`)
  }, [externalContent])

  async function handlePublish(event) {
    event.preventDefault();

    if (canPublish && title != "" && externalContent.length > 50) {
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
          content: internalContent,
          auth: {
            email: "user.email",
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
      const fileCode = v4()
      const fileContent = e.target.result;

      setImages(state => [...state, {
        text: fileCode,
        data: fileContent
      }])

      setExternalContent((state) => `${state}\n![](${fileCode})`);
    };

    for (let index = 0; index <= files.length - 1; index++) {
      fileReader.readAsDataURL(files[index]);
    }
  }

  //useEffect(() => {
  //  setEmail(user?.email);
  //}, [user]);

  return (
    <Layout>
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
        {mode == "view" ? (
          <div className="flex flex-col overflow-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              className="markdown-body flex flex-col overflow-auto box-border h-72 pl-[8rem] pr-[1.5rem] first-line:pr-[8rem] py-[3rem] top-[9.725rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-[8rem] md:py-[3rem] md:top-[9.725rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
            >
              {internalContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div>
            <Editor
              onChange={(e) => {
                setExternalContent(e);
              }}
              value={externalContent}
              mode="tab"
            ></Editor>

            <div className="bg-gray-100 border-t-[2px] border-black border-opacity-20 top-[25.15rem] left-[1.75rem] w-[22.25rem] h-[2.5rem] rounded-b-md md:w-[60.5rem] absolute">
              <input
                className="px-[1rem] py-[0.25rem] text-sm w-[22.25rem] md:w-[60.5rem] absolute"
                type="file"
                accept="images/*"
                onChange={handleFile}
                multiple
              />
            </div>
          </div>
        )}

        {/*<button
          onClick={() => {
            setMode("write");
          }}
          className="write z-40 text-[0.9rem] top-[10rem] left-[3rem] md:text-[0.9rem] md:top-[10rem] md:left-[3rem] absolute"
        >
          Escrever
        </button>
        <button
          onClick={() => {
            setMode("view");
          }}
          className="view z-40 text-[0.9rem] top-[10rem] left-[7.5rem] md:text-[0.9rem] md:top-[10rem] md:left-[7.5rem] absolute"
        >
          Visualizar
        </button>*/}
      </div>

      <input
        onChange={(e) => {
          setSource(e.currentTarget.value);
        }}
        defaultValue={source}
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
          border-radius: 0.375rem; 
          border-color: #000000; 
          border-opacity: 0.2; 
          outline: 0; 
          padding-left: 8rem;
          padding-right: 1.5rem;
          top: 9.725rem;
          left: 1.625rem;
          width: 22.5rem;
          border-radius: 6px;
          padding: 1px;
          border: 1px solid #d0d7de;
          position: absolute;
        }
        .bytemd:focus-within {
          border-color: #0969da;
          box-shadow: inset 0 0 0 1px #0969da;
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
        .bytemd .bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:nth-of-type(1),
        .bytemd .bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:nth-of-type(4) {
          display: none;
        }
        .bytemd .bytemd-status {
          display: none;
        }
        .bytemd-fullscreen.bytemd {
          z-index: 100;
        }
        .tippy-box {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji';
        }

        .view {
          ${mode == "view" ? "color: RoyalBlue;" : null}
        }

        .write {
          ${mode == "write" ? "color: RoyalBlue;" : null}
        }

        @media (min-width: 768px) {
          .bytemd {
            top: 9.725rem;
            left: 1.625rem;
            width: 60.75rem;
          }
       }
      `}</style>
    </Layout>
  );
}
