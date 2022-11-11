import { useRouter } from "next/router";
import Layout from "../components/Layout";
import formatText from "../lib/hooks/formatText";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import findNewsHook from "../lib/db/findNews";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useEffect, useState } from "react";

const Home = ({ newsFetched, page }) => {
  const router = useRouter();

  useEffect(() => {
    if(page < 0) {
      router.push({ query: { pagina: 0 } });
    }
  }, []);

  return (
    <Layout>
        <ul className="ml-[1.25rem] mt-[1.5rem] break-words md:ml-[1.25rem] md:mt-[1.5rem]">
          {newsFetched.map((news, newsCounted) => {
            const { title, commentCount, by, createdAt } = news;

            return (
              <li
                className="md:ml-4 cursor-pointer pb-2 pr-4"
                key={newsCounted + 1}
              >
                <h1
                  className="font-[500] md:text-base hover:underline"
                  onClick={() => {
                    router.push(`/pagina/${formatText(by)}/${formatText(title)}`);
                  }}
                >
                  {newsCounted + 1}. {title}
                </h1>
                <p className="text-gray-500 ml-[1rem] text-[0.8rem] md:ml-[1rem] md:text-[0.75rem]">
                  <span>{commentCount} comentário</span> ·{" "}
                  <span
                    className="hover:underline"
                    onClick={() => {
                      router.push(`/pagina/${formatText(by)}`);
                    }}
                  >
                    {by}
                  </span>{" "}
                  ·{" "}
                  <span>
                    Há {formatDistance(Date.now(), createdAt, { locale: ptBR })}
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

        <div>
          {newsFetched.length == 0 ? (
            <p className="text-gray-400 top-[1rem] left-[8rem] md:top-[1rem] md:left-[27.5rem] absolute">
              Não tem nada aqui.
            </p>
          ) : null}
        </div>

        {newsFetched.length == 0 ? (
          <footer>
            <div className="flex">
              <a
                className="flex ml-[5rem] mr-[1rem] md:ml-[25rem]"
                onClick={() => {
                  router.push({
                    query: {
                      pagina: page > 0 ? page - 1 : page,
                    },
                  });
                }}
              >
                <CaretLeft size={20} className="mt-[4.15rem]" />
                <p className="text-gray-650 text-[1.1rem] mt-[4rem]">Anterior</p>
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
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { pagina } = context.query;

  const { data } = await findNewsHook({
    title: undefined,
    titleSlug: undefined,
    by: undefined,
    slug: undefined,
    sourceUrl: undefined,
    content: undefined,
    limit: 10,
    page: pagina > 0 ? pagina : 0 || 0,
  });

  return {
    props: {
      newsFetched: data,
      page: Number(pagina > 0 ? pagina : 0 || 0),
    },
  };
}

export default Home;
