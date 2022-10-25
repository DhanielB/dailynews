import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";

const Home = () => {
  const router = useRouter()
  
  const [newsFetched, setNewsFetched] = useState([])

  async function handleInit() {
    const responseNews = await axios.post("/api/v1/db/findNews")

    setNewsFetched(responseNews.data.data)
  }

  useEffect(() => {
    handleInit()
  }, [])
  
  return (
    <Layout>
      <ul className="ml-[1.25rem] mt-[1.5rem] break-words md:ml-[1.25rem] md:mt-[1.5rem]">{newsFetched.map((news, newsCounted) => {
        const { title, commentCount, by, on } = news

        return (
          <li className="md:ml-4 cursor-pointer pb-2 pr-4" key={newsCounted + 1}>
            <h1 className="font-[500] md:text-base hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}/${formatText(title)}`)
          }}>{newsCounted + 1}. {title}</h1>
            <p className="text-gray-500 ml-[1rem] text-[0.8rem] md:ml-[1rem] md:text-[0.75rem]"><span>{commentCount} comentário</span> · <span className="hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}`)
          }}>{by}</span> · <span>{on}</span></p>
          </li>
        )
      })}</ul>
    </Layout>
  );
};

export default Home;
