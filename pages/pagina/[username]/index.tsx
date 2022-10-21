import { useRouter } from "next/router"
import Layout from "../../../components/Layout"
import formatText from "../../../lib/hooks/formatText"

export default function username() {
  const router = useRouter()
  const { username } = router.query

  return (
    <Layout>
      <div>
        <h1 className="w-[22.5rem] pb-4 m-[1.5rem] font-extrabold text-[2rem] text-[#23292f] border-b">{username}</h1>
      </div>
      
      <ul className="w-[22.5rem] pb-4 m-[1.5rem] font-extrabold text-[2rem] text-[#23292f] border-b">{[
        {
          id: 1,
          title: "Tab News",
          comment: 0,
          by: 'Felipe Deschamps',
          on: '15 horas atrás'
        },
        {
          id: 2,
          title: "Gerando uma imagem microscópica - Uma brincadeirinha divertida =)",
          comment: 0,
          by: 'melchisedech333',
          on: '18 horas atrás'
        }
      ].map((news) => {
        const { id, title, comment, by, on } = news

        return (
          <li className="ml-[2rem] mt-[7.25rem] md:ml-[1.25rem] md:top-[10rqem] md:left-[10rem] absolute" key={id}>
            <h1 className="font-[500] md:text-base hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}/${formatText(title)}`)
          }}>{id}. {title}</h1>
            <p className="text-gray-500 ml-[1rem] text-[0.8rem] md:ml-[1rem] md:text-[0.75rem]"><span>{comment} comentário</span> · <span className="hover:underline" onClick={() => {
            router.push(`/pagina/${formatText(by)}`)
          }}>{by}</span> · <span>{on}</span></p>
          </li>
        )
      })}</ul>
    </Layout>
  )
}
