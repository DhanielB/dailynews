
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
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import 'katex/dist/katex.min.css'

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
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                source={`# ${title} - ${by}\n${content}`} className="markdown-body flex flex-col overflow-auto box-border h-72 pl-[8rem] pr-[1.5rem] first-line:pr-[8rem] py-[3rem] top-[9.725rem] left-[1.625rem] w-[22.5rem] border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-[8rem] md:py-[3rem] md:top-[9.725rem] md:left-[1.625rem] md:w-[60.75rem] absolute"/>
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
