import { useRouter } from "next/router";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";

const Home = () => {
  const router = useRouter()

  return (
    <Layout>
      <ul className="ml-[1.25rem] mt-[1.5rem] break-words md:ml-[1.25rem] md:mt-[1.5rem]">{[
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
          <li className="md:ml-4 cursor-pointer pb-2 pr-4" key={id}>
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
  );
};

export default Home;
