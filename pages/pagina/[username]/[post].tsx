import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
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
import { CaretUp, CaretDown, Link } from "phosphor-react";

import "katex/dist/katex.min.css";
import axios from "axios";
import { useUser } from "../../../lib/hooks/useUser";
import ptBR from "date-fns/locale/pt-BR";
import { formatDistance } from "date-fns";

export default function username({ newsFetched }) {
  const router = useRouter();
  const { post, username } = router.query;
  const [votesCount, setVotesCount] = useState(newsFetched.votes);
  const [showConfetti, setShowConfetti] = useState("off");
 
  const user = useUser({});

  async function addVotes() {
    setVotesCount(votesCount + 1);

    await axios.post("/api/v1/db/editVoteNews", {
      title: newsFetched.title,
      votes: votesCount + 1,
    }, {
      headers: {
        request: process.env.NEXT_SECRET_API_KEY
      }
    });
  }

  async function removeVotes() {
    setVotesCount(votesCount - 1);

    await axios.post("/api/v1/db/editVoteNews", {
      title: newsFetched.title,
      votes: votesCount - 1,
    }, {
      headers: {
        request: process.env.NEXT_SECRET_API_KEY
      }
    });
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
      const { id, by, title, titleSlug, content, sourceUrl, createdAt } = news; 
      
      if(user == by && post == titleSlug) {
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
        <code
          className="text-[0.75rem] text-blue-500 rounded-md ml-[2.5rem] my-[0.5rem] mt-6 cursor-pointer hover:underline"
          onClick={() => {
            router.push(`/pagina/${username}`);
          }}
        >
          {username}
        </code>

        <p className="text-[0.80rem] text-gray-500 rounded-md ml-[8rem] my-[0.5rem] top-[0.8rem] hover:underline absolute">
          Há {formatDistance(Date.now(), createdAt, { locale: ptBR })}
        </p>

        <div className="absolute">
          <CaretUp weight="bold" color="#a4acb4" onClick={addVotes} />
          <p className="votes text-center text-blue-500">
            {votesCount > 99 ? "99+" : votesCount}
          </p>
          <CaretDown weight="bold" color="#a4acb4" onClick={removeVotes} />
        </div>

        <h1 className="font-[600] text-[1.5rem] break-words pr-[1rem] pl-[2.5rem]">
          {title}
        </h1>

        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          children={`${content}`}
          className="markdown-body w-[calc(screen-2rem)] break-all pt-[1rem] pr-[1rem] pl-[2.5rem]"
        />
        <br />
        <br />
        <div className="inline">
          <Link className="inline" size={18} />
          <a
            href={sourceUrl}
            className="inline text-blue-600 ml-[0.5rem] hover:underline"
          >
            {sourceUrl || ""}
          </a>
        </div>
        <style jsx>{`
      	* {
          user-select: none;
        }
      `}</style>
      </div>
       )}})}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { username, post } = context.query;

  const { data } = await findNewsHook(
    {
      title: undefined,
      titleSlug: post.toString(),
      by: username.toString(),
      slug: undefined,
      sourceUrl: undefined,
      content: undefined,
    },
    {
      limit: 0,
      page: 0,
    }
  );

  return {
    props: {
      newsFetched: data,
    },
  };
}
