import { v4 } from "uuid";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";
import { useUser } from "../lib/hooks/useUser";
import Router, { useRouter } from "next/router";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import { Warning } from "phosphor-react";
import findUser from "../lib/db/findUser";

export default function Publicar({ usersFetched }) {
  const user = useUser({ redirectTo: "/cadastro" });
  const router = useRouter()

  const [mode, setMode] = useState("write");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [internalContent, setInternalContent] = useState("");
  const [externalContent, setExternalContent] = useState("");
  const [source, setSource] = useState("");
  const [email, setEmail] = useState("");
  const [userFetched, setUserFetched] = useState({
    name: '',
    email: '',
    role: '',
    nuked: false
  });
  const [canPublish, setCanPublish] = useState(true);
  const [showTitleError, setShowTitleError] = useState("");
  const [showContentError, setShowContentError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setShowTitleError("");
    }, 5000);
  }, [showTitleError]);

  useEffect(() => {
    setTimeout(() => {
      setShowContentError("");
    }, 5000);
  }, [showContentError]);

  useEffect(() => {
    setTitle(window.localStorage.getItem("title"));
    setInternalContent(window.localStorage.getItem("internalContent"));
    setExternalContent(window.localStorage.getItem("externalContent"));
    setImages(JSON.parse(window.localStorage.getItem("images")) || []);
    setSource(window.localStorage.getItem("source"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("title", title || "");
  }, [title]);

  useEffect(() => {
    window.localStorage.setItem("images", JSON.stringify(images) || "[]");
  }, [images]);

  useEffect(() => {
    window.localStorage.setItem("internalContent", internalContent || "");
  }, [internalContent]);

  useEffect(() => {
    let content = externalContent;

    for(let image of images) {
      const fileName = image["name"];
      const fileContent = image["content"];

      content = content.replaceAll(fileName, fileContent);
    }

    setInternalContent(content);

    window.localStorage.setItem("externalContent", externalContent || "");
  }, [externalContent]);

  useEffect(() => {
    window.localStorage.setItem("source", source || "");
  }, [source]);

  const [showConfetti, setShowConfetti] = useState("off");

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti("off");
    }, 5000);

    setShowConfetti(window.localStorage.getItem("confetti"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("confetti", showConfetti || "off");
  }, [showConfetti]);

  async function handlePublish(event) {
    event.preventDefault();

    if (canPublish && title != "" && externalContent.length > 50) {
      setCanPublish(false);

      const responseUser = await axios.post("/api/v1/db/findUser", {
        email: email,
      }, {
        headers: {
          request: process.env.NEXT_SECRET_API_KEY
        }
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
            email: email,
          },
        }, {
          headers: {
            request: process.env.NEXT_SECRET_API_KEY
          }
        });

        if (responsePublish.status == 200) {
          window.localStorage.setItem("title", "");
          window.localStorage.setItem("content", "");
          window.localStorage.setItem("source", "");

          Router.push(`/pagina/${formatText(by)}/${formatText(title)}`);
        }
      }
    }
  }

  function handleFile(event) {
    const fileReader = new FileReader();
    const { files } = event.target;

    fileReader.onload = async (e) => {
      const fileContent = e.target.result;
      const fileName = v4();

      setImages(state => [...state, { name: fileName, content: fileContent }]);
      setExternalContent(state => `${state}\n![](${fileName})`);
    };

    for (let index = 0; index <= files.length - 1; index++) {
      fileReader.readAsDataURL(files[index]);
    }
  }

  useEffect(() => {
    for(let userFetchedData of usersFetched) {
      if(userFetchedData.email == user?.email) {
        setUserFetched(userFetchedData)
      }
    }

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
            className="bg-transparent text-5 px-4 py-[0.5rem] top-[6rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[6rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
            placeholder="Título"
            value={title}
            required={true}
          ></input>
          {showTitleError ? (
            <div>
              <div className="warn">
                <Warning color="red" weight="bold" />
              </div>

              <p className="flex w-screen text-red-600 font-[600] text-[0.8rem] top-[10rem] left-[2.5rem] md:left-[17.5rem] md:top-[9.45rem] md:text-[0.875rem] absolute">
                {showTitleError}
              </p>
            </div>
          ) : null}

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
                <textarea
                  className="bg-transparent h-72 pl-[8rem] pr-[1.5rem] first-line:pr-[8rem] py-[3rem] top-[9.725rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-[8rem] md:py-[3rem] md:top-[9.725rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
                  onChange={(e) => {
                    setExternalContent(e.currentTarget.value);
                  }}
                  value={externalContent}
                  required={true}
                ></textarea>

                <div className="bg-gray-100 border-t-[2px] border-black border-opacity-20 top-[25.15rem] left-[1.75rem] w-[22.25rem] h-[2.5rem] rounded-b-md md:w-[60.5rem] absolute">
                  <input
                    className="bg-transparent px-[1rem] py-[0.25rem] text-sm w-[22.25rem] md:w-[60.5rem] absolute"
                    type="file"
                    accept="images/*"
                    onChange={handleFile}
                    multiple
                  />
                </div>
              </div>
            )}
            {showContentError ? (
              <div>
                <div className="warn">
                  <Warning color="red" weight="bold" />
                </div>

                <p className="flex w-screen text-red-600 font-[600] text-[0.8rem] top-[10rem] left-[2.5rem] md:left-[17.5rem] md:top-[9.45rem] md:text-[0.875rem] absolute">
                  {showContentError}
                </p>
              </div>
            ) : null}

            <button
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
            </button>
          </div>

          <input
            onChange={(e) => {
              setSource(e.currentTarget.value);
            }}
            defaultValue={source}
            value={source}
            className="bg-transparent px-4 py-[0.5rem] top-[28.75rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[28.75rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
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
        </div>
      ) : (
        <div className="flex items-center justify-center w-screen h-[calc(screen-4rem)]">
          <h1 className="flex items-center justify-center w-screen font-extrabold text-4xl top-[2rem] md:text-6xl absolute">Você foi banido!</h1>
          <p className="flex items-center justify-center w-screen text-gray-500 font-extrabold text-xl top-[8rem] md:text-2xl absolute">Eu não esperava isto de você</p>
          <svg
            width="400"
            height="400"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="400" height="400" fill="white" />
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

      <style jsx>{`
        .view {
          ${mode == "view" ? "color: RoyalBlue;" : null}
        }
        .write {
          ${mode == "write" ? "color: RoyalBlue;" : null}
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { data } = await findUser({}, {
    limit: 0,
    page: 0
  });

  return {
    props: {
      usersFetched: data
    }
  }
}
