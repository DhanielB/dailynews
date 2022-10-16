import { useRouter } from "next/router"
import Layout from "../../../components/Layout"
import formatText from "../../../lib/hooks/formatText"

export default function username() {
  const router = useRouter()
  const { username } = router.query

  return (
    <Layout>
      <div>
        <h1 className="m-[1.5rem] font-extrabold text-[2rem] text-[#23292f]">{username}</h1>
      </div>
      
      <ul className="md:ml-[1.25rem] md:top-[10rem] md:left-[10rem]">{[ { id: 1, title: "Tab News", comment: 0, by: 'Felipe Deschamps', on: '15 horas atrás' }, { id: 2, title: "Gerando uma imagem microscópica - Uma brincadeirinha divertida =)", comment: 0, by: 'melchisedech333', on: '18 horas atrás' } ].map((news) => {
        const { id, title, comment, by, on } = news

        if(username == formatText(by)) {
          return (
            <li className="md:ml-4 cursor-pointer" key={id}>
              <h1 className="font-[500] md:text-base hover:underline" onClick={() => {
              router.push(`/${formatText(by)}/${formatText(title)}`)
            }}>{id}. {title}</h1>
              <p className="text-gray-500 md:ml-[1rem] md:text-[0.75rem]"><span>{comment} comentário</span> · <span className="hover:underline" onClick={() => {
              router.push(`/${formatText(by)}`)
            }}>{by}</span> · <span>{on}</span></p>
            </li>
          )
        }else{
          return null
        }
      })}</ul>
    </Layout>
  )
}
