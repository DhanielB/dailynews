import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";
import { formatDistance } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'; 
import findNewsHook from "../lib/db/findNews";

const Home = ({ newsFetched }) => {
  const router = useRouter()

  return (
    <Layout>
      <ul className="ml-[1.25rem] mt-[1.5rem] break-words md:ml-[1.25rem] md:mt-[1.5rem]">{newsFetched.map((news, newsCounted) => {
        const { title, commentCount, by, createdAt } = news

        return (
          <li className="md:ml-4 cursor-pointer pb-2 pr-4" key={newsCounted + 1}>
            <h1 className="font-[500] md:text-base hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}/${formatText(title)}`)
          }}>{newsCounted + 1}. {title}</h1>
            <p className="text-gray-500 ml-[1rem] text-[0.8rem] md:ml-[1rem] md:text-[0.75rem]"><span>{commentCount} comentário</span> · <span className="hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}`)
          }}>{by}</span> · <span>Há {formatDistance(Date.now(), createdAt, { locale: ptBR })}</span></p>
          </li>
        )
      })}</ul>
    </Layout>
  );
};

export async function getServerSideProps() {
  const responseNews = await findNewsHook({});

  return {
    props: {
      newsFetched: responseNews
    }
  }
}

export default Home;
