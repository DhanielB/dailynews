import Head from "next/head";
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
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { CaretUp, CaretDown } from "phosphor-react";

import "katex/dist/katex.min.css";
import addNewsVote from "../../../lib/db/addNewsVote";

export default function username({ newsFetched }) {
  const router = useRouter();
  const { username, post } = router.query;
  const [votes, setVotes] = useState(newsFetched.votes)
  const [showConfetti, setShowConfetti] = useState("off");

  async function addVotes() {
    const news = await addNewsVote({
      title: newsFetched.title,
      votes: newsFetched.votes + 1
    })

    setVotes(news.data.votes)
  }

  async function removeVotes() {
    const news = await addNewsVote({
      title: newsFetched.title,
      votes: newsFetched.votes - 1
    })

    setVotes(news.data.votes)
  }

  useEffect(() => {
    setTimeout(() => {
      setShowConfetti("off");
    }, 5000);

    setShowConfetti(window.localStorage.getItem("confetti"));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("confetti", showConfetti || "off");
  }, [showConfetti]);

  return (
    <Layout>
      <Confetti
        onConfettiComplete={() => {
          window.localStorage.setItem("confetti", "off");
        }}
        numberOfPieces={showConfetti == "on" ? 500 : 0}
      />

      {newsFetched.map((news) => {
        const { title, titleSlug, by, content, sourceUrl, votes } = news;

        if (by == username && titleSlug == post) {
          return (
            <div className="p-[1rem]">
              <Head>
                <title>{title}</title>
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
              </Head>
              {/* @ts-ignore */}
              <code className="text-[0.75rem] text-blue-500 rounded-md ml-[2.5rem] my-[0.5rem] mt-6 hover:undeline">
                {username}
              </code>

              <div className="absolute">
                <CaretUp weight="bold" color="#a4acb4" onClick={addVotes}/>
                <p className="text-blue-500">{votes}</p>
                <CaretDown weight="bold" color="#a4acb4" onClick={removeVotes}/>
              </div>

              <h1 className="font-[600] text-[1.5rem] break-words pr-[1rem] md:pl-[2.5rem]">
                {title}
              </h1>

              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                children={`${content}\n\n### ${sourceUrl || ""}`}
                className="markdown-body w-[calc(screen-2rem)] break-all pt-[1rem] bg-[#fafafa] md:pr-[1rem] md:pl-[2.5rem]"
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
    content: undefined
  }, {
    limit: 1,
    page: pagina || 0,
  });

  return {
    props: {
      newsFetched: data,
    },
  };
}
