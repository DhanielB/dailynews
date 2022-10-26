import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../../components/Layout"
import formatText from "../../../lib/hooks/formatText"
import findNewsHook from "../../../lib/db/findNews";

export default function username() {
  return (
    <Layout>
      <div>
        <h1 className="w-[22.5rem] pb-4 m-[1.5rem] font-extrabold text-[2rem] text-[#23292f] border-b">{username}</h1>
      </div>
      
      <ul className="ml-[2rem] mt-[7.25rem] md:ml-[1.25rem] md:top-[10rem] md:left-[10rem] absolute">{newsFetched.map((news,index) => {
        const { title, comment, by, on } = news

        return (
          <li className="md:ml-4 cursor-pointer" key={newsFetched.length - index}>
            <h1 className="font-[500] md:text-base hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}/${formatText(title)}`)
          }}>{newsFetched.length - index}. {title}</h1>
            <p className="text-gray-500 text-[0.8rem] ml-[1rem] md:ml-[1rem] md:text-[0.75rem]"><span>{comment} comentário</span> · <span className="hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}`)
          }}>{by}</span> · <span>{on}</span></p>
          </li>
        )
      })}</ul>
    </Layout>
  )
}

export async function getServerSideProps() {
  const router = useRouter()
  const { username } = router.query

  const { data } = await findNewsHook({
    title: undefined,
    titleSlug: undefined,
    by: username,
    slug: undefined,
    sourceUrl: undefined,
    content: undefined
   });
  
   return {
     props: {
       newsFetched: data
     }
   }
}
