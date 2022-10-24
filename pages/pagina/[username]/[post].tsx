import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../components/Layout"
import { Viewer, Editor } from "@bytemd/react";
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
        const { title, titleSlug by, content } = news
        
        if(by == username && titleSlug == post) {
          return (
            <div className="p-[1rem]">
              <Viewer value={`# ${title} - ${by}\n${content}`}></Viewer>
            </div>
        )
      })}
    </Layout>
  )
}
