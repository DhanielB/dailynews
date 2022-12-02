import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import formatText from "../../lib/hooks/formatText";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import findUser from "../../lib/db/findUser";
import { CaretLeft, CaretRight } from "phosphor-react";
import axios from "axios";
import { useUser } from "../../lib/hooks/useUser";
import { useEffect, useState } from "react";

const Home = ({ usersFetched, page }) => {
  const router = useRouter();
  const user = useUser({ redirectTo: "/" });

  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(user?.email);
  }, [user]);

  async function handleUnNuke() {
    await axios.post("/api/v1/db/nuke", {
      email: email,
      nuked: false,
    });
  }

  async function handleNuke() {
    await axios.post("/api/v1/db/nuke", {
      email: email,
      nuked: true,
    });
  }

  return (
    <Layout>
      <ul className="ml-[1.25rem] mt-[1.5rem] break-words md:ml-[1.25rem] md:mt-[1.5rem]">
        {usersFetched.map((users, usersCounted) => {
          const { name, email, nuked, createdAt } = users;
          const [isNuked, setIsNuked] = useState(nuked);

          return (
            <li
              className="md:ml-4 cursor-pointer pb-2 pr-4"
              key={usersCounted + 1}
            >
              <h1
                className="font-[500] md:text-base hover:underline"
                onClick={() => {
                  router.push(`/pagina/${formatText(name)}`);
                }}
              >
                {usersCounted + 1}. {name}
              </h1>
              <p className="text-gray-500 ml-[1rem] text-[0.8rem] md:ml-[1rem] md:text-[0.75rem]">
                <span
                  className="hover:underline"
                  onClick={() => {
                    router.push(`/pagina/${formatText(email)}`);
                  }}
                >
                  {email}
                </span>{" "}
                ·{" "}
                <span>
                  Foi criado há{" "}
                  {formatDistance(Date.now(), createdAt, { locale: ptBR })}
                </span>{" "}
                ·{" "}
                {isNuked ? (
                  <span
                    className="text-red-500"
                    onClick={async () => {
                      setIsNuked((state) => !state);
                      await handleUnNuke();
                    }}
                  >
                    Banido
                  </span>
                ) : (
                  <span
                    className="text-red-500"
                    onClick={async () => {
                      setIsNuked((state) => !state);
                      await handleNuke();
                    }}
                  >
                    Banir
                  </span>
                )}
              </p>

              {usersFetched.length - 1 == usersCounted ? (
                <footer>
                  <div className="flex ml-[25vw] md:ml-[25vw]">
                    <a
                      className="flex mr-[1rem]"
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
        {usersFetched.length == 0 ? (
          <p className="text-gray-400 top-[1rem] left-[8rem] md:top-[1rem] md:left-[27.5rem] absolute">
            Não tem nada aqui.
          </p>
        ) : null}
      </div>

      {usersFetched.length == 0 ? (
        <footer>
          <div className="flex ml-[25vw] md:ml-[25vw]">
            <a
              className="flex mr-[1rem]"
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

  const { data } = await findUser(
    {},
    {
      limit: 10,
      page: pagina > 0 ? pagina : 0 || 0,
    }
  );

  return {
    props: {
      usersFetched: data,
      page: Number(pagina > 0 ? pagina : 0 || 0),
    },
  };
}

export default Home;
