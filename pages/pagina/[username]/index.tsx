import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import formatText from "../../../lib/hooks/formatText";
import findNewsHook from "../../../lib/db/findNews";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useState } from "react";

export default function username({ newsFetched, users, page }) {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Layout>
      <div>
        <h1 className="w-[22.5rem] pb-4 m-[1.5rem] font-extrabold text-[2rem] text-[#23292f] border-b">
          {username} {users == 0 ? "(Usuário não existe)" : null}
        </h1>
      </div>

      <ul className="ml-[2rem] mt-[7.25rem] md:ml-[1.25rem] md:top-[10rem] md:left-[10rem] absolute">
        {newsFetched.map((news, newsCounted) => {
          const { title, comment, by, on, createdAt } = news;

          return (
            <li className="md:ml-4 cursor-pointer" key={newsCounted + 1}>
              <h1
                className="font-[500] md:text-base hover:underline"
                onClick={() => {
                  router.push(`/pagina/${formatText(by)}/${formatText(title)}`);
                }}
              >
                {newsCounted + 1}. {title}
              </h1>
              <p className="text-gray-500 text-[0.8rem] ml-[1rem] md:ml-[1rem] md:text-[0.75rem]">
                <span>{comment} comentário</span> ·{" "}
                <span
                  className="hover:underline"
                  onClick={() => {
                    router.push(`/pagina/${formatText(by)}`);
                  }}
                >
                  {by}
                </span>{" "}
                · <span>{on}</span> ·{" "}
                <span>
                  {" "}
                  Há{" "}
                  {formatDistance(Date.now(), createdAt, {
                    locale: ptBR,
                  })}{" "}
                </span>
              </p>

              {newsFetched.length - 1 == newsCounted ? (
                <footer>
                  <div className="flex">
                    <a
                      className="flex ml-[5rem] mr-[1rem]"
                      onClick={() => {
                        router.push({
                          query: {
                            pagina: page > 0 ? page - 1 : page,
                          },
                        });
                      }}
                    >
                      <CaretLeft size={20} className="mt-[4.15rem]" />
                      <p className="text-gray-650 text-[1.1rem] mt-[4rem]">
                        Anterior
                      </p>
                    </a>

                    <a className="flex">
                      <p
                        className="text-blue-500 text-[1.1rem] mt-[4rem]"
                        onClick={() => {
                          router.push({
                            query: {
                              pagina: page + 1,
                            },
                          });
                        }}
                      >
                        Proximo
                      </p>
                      <CaretRight
                        size={20}
                        color="rgb(59 130 246)"
                        className="mt-[4.15rem]"
                      />
                    </a>
                  </div>
                </footer>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { username, pagina } = context.query;

  const response = await findNewsHook({
    title: undefined,
    titleSlug: undefined,
    by: username.toString(),
    slug: undefined,
    sourceUrl: undefined,
    content: undefined,
    limit: 10,
    page: pagina > 0 ? pagina : 0 || 0,
  });

  const { data } = response

  return {
    props: {
      newsFetched: data,
      users: Number(response.count),
      page: Number(pagina > 0 ? pagina : 0 || 0),
    },
  };
}
