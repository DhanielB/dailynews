import Head from 'next/head'
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import findNewsHook from "../../../lib/db/findNews";
import Confetti from 'react-confetti' 
import { useEffect, useState } from "react"
import axios from "axios";

import "katex/dist/katex.min.css";
import { Viewer } from "@bytemd/react";

import "bytemd/dist/index.min.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

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
              <Head>
                <title>{title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              </Head>
              { /* @ts-ignore */ }
              <code className="bg-blue-300 text-blue-500 rounded-md px-1 py-[0.5rem] ml-4 mt-6">
                {username}
              </code>
              
              <Viewer
                source={`# ${title}\n${content}\n\n### ${sourceUrl || ""}`}
              />
            </div>
          );
        }
      })}

      <style jsx global>{`
        .markdown-body {
          width: calc(100vw - 2rem);
          word-break: break-all;
          padding-top: 1rem:
          background-color: #fafafa;
        }
      `}</style>
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
