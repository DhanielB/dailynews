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
import { useEffect, useState } from "react"

import "katex/dist/katex.min.css";
import axios from "axios";

export default function username({ newsFetched }) {
  const router = useRouter();
  const { username, post } = router.query;
  const [showConfetti, setShowConfetti] = useState("off")

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti("off")
    }, 5000)

    setShowConfetti(window.localStorage.getItem("confetti"))
  }, [])

  useEffect(() => {
    window.localStorage.setItem("confetti", showConfetti || "off");
  }, [showConfetti]);

  return (
    <Layout>
      <Confetti onConfettiComplete={() => {
        window.localStorage.setItem("confetti", "off")
      }} numberOfPieces={showConfetti == "on" ? 500 : 0}/>

      {newsFetched.map((news) => {
        const { title, titleSlug, by, content, sourceUrl } = news;

        if (by == username && titleSlug == post) {
          return (
            <div className="p-[1rem]">
              { /* @ts-ignore */ }
              <code className="bg-blue-300 text-blue-500 rounded-md px-1 py-[0.5rem] ml-4 mt-6">
                {username}
              </code>
              
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                children={`# ${title}\n${content}\n\n### ${sourceUrl || ""}`}
                className="markdown-body w-[calc(screen-2rem)] break-all pt-[1rem] bg-[#fafafa]"
              />
            </div>
          );
        }
      })}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { username, post, pagina } = context.query;

  const { data } = await findNewsHook({
    title: undefined,
    titleSlug: undefined,
    by: undefined,
    slug: undefined,
    sourceUrl: undefined,
    content: undefined,
    limit: 10,
    page: pagina || 0
  });

  return {
    props: {
      newsFetched: data,
    },
  };
}
