import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../components/Layout"
import ReactMarkdown from 'react-markdown'
import "bytemd/dist/index.min.css";
import "bytemd/dist/index.min.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";

export default function username() {
  const router = useRouter()
  const { username, post } = router.query

  const [newsFetched, setNewsFetched] = useState([])

  async function handleInit() {
    const responseNews = await axios.post("/api/v1/db/findNews", {
      by: username,
      titleSlug: post
    })

    setNewsFetched(responseNews.data.data)
  }

  useEffect(() => {
    handleInit()
  }, [])
  
  return (
    <Layout>
      {newsFetched.map((news) => {
        const { title, titleSlug, by, content } = news
        
        if(by == username && titleSlug == post) {
          return (
            <div className="p-[1rem]">
              <ReactMarkdown className="markdown-body flex flex-col overflow-auto box-border h-72 pl-[8rem] pr-[1.5rem] first-line:pr-[8rem] py-[3rem] top-[9.725rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-[8rem] md:py-[3rem] md:top-[9.725rem] md:left-[1.625rem] md:w-[60.75rem] absolute">{`# ${title} - ${by}\n${content}`}></ReactMarkdown>
            </div>
          )
        }
      })}
    </Layout>
  )
}
