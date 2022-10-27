import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../components/Layout"
import ReactMarkdown from '../../../components/Markdown'
import "bytemd/dist/index.min.css";
import "bytemd/dist/index.min.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import findNewsHook from "../../../lib/db/findNews";

export default function username({ newsFetched }) {
  const router = useRouter()
  const { username, post } = router.query

  return (
    <Layout>
      {newsFetched.map((news) => {
        const { title, titleSlug, by, content } = news
        
        if(by == username && titleSlug == post) {
          return (
            <div className="p-[1rem]">
              <ReactMarkdown source={`# ${title} - ${by}\n${content}`} className="markdown-body"/>
            </div>
          )
        }
      })}
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { username, post } = context.query

  const { data } = await findNewsHook({
    title: undefined,
    titleSlug: post.toString(),
    by: username.toString(),
    slug: undefined,
    sourceUrl: undefined,
    content: undefined
  });
  
  return {
    props: {
      newsFetched: data
    }
  }}
