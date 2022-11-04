import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import "bytemd/dist/index.min.css";
import "bytemd/dist/index.min.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import findNewsHook from "../../../lib/db/findNews";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import Confetti from 'react-confetti' 

import "katex/dist/katex.min.css";
import axios from "axios";

export default function username({ newsFetched }) {
  const router = useRouter();
  const { username, post } = router.query;

  useEffect(() => {
    setShowConfetti(window.localStorage.getItem("confetti"))
  , [])

  async function handleDelete() {
    await axios.post("/api/v1/db/deleteNews", {
      by: username,
      titleSlug: post,
    });

    router.push("/");
  }

  return (
    <Layout>
      {showConfetti ? (
        <Confetti onComplete={() => {
          window.localStorage.setItem("confetti", false)
        }}/>
      }

      {newsFetched.map((news) => {
        const { title, titleSlug, by, content, sourceUrl } = news;

        if (by == username && titleSlug == post) {
          return (
            <div className="p-[1rem]">
              { /* @ts-ignore */ }
              <code className="bg-blue-300 text-blue-500 rounded-md px-1 py-[0.5rem] ml-4 mt-6">
                {username}
              </code>
              {by == username ? null : (
                <div>
                  <button className="text-gray-500 top-[1rem] left-[17rem] absolute">
                    editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 top-[1rem] left-[21rem] absolute"
                  >
                    deletar
                  </button>
                </div>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                children={`# ${title}\n${content}\n\n### ${sourceUrl || ""}`}
                className="markdown-body w-[calc(screen-2rem)] break-all pt-[1rem]"
              />
            </div>
          );
        }
      })}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { username, post } = context.query;

  const { data } = await findNewsHook({
    title: undefined,
    titleSlug: post.toString(),
    by: username.toString(),
    slug: undefined,
    sourceUrl: undefined,
    content: undefined,
  });

  return {
    props: {
      newsFetched: data,
    },
  };
}
