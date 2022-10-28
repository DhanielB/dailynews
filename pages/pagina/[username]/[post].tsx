
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../components/Layout"
import "bytemd/dist/index.min.css";
import "bytemd/dist/index.min.css";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import findNewsHook from "../../../lib/db/findNews";
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import 'katex/dist/katex.min.css'

export default function username({ newsFetched }) {
  const router = useRouter()
  const { username, post } = router.query

  return (
    <Layout>
      {newsFetched.map((news) => {
        const { title, titleSlug, by, content, source } = news
        
        if(by == username && titleSlug == post) {
          return (
            <div className="p-[1rem]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                children={`# ${title} - ${by}\n${content}\n\n### ${source}`}
                className="markdown-body"/>
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
