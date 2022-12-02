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
import { getLoginSession } from "../../lib/auth/auth";
import { redirect } from "next/dist/server/api-utils";

export default function Users({ usersFetched, page, redirect }) {
  const router = useRouter();
  const user = useUser({ redirectTo: "/" });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [userFetched, setUserFetched] = useState({
    name: "",
    email: "",
    role: "",
    nuked: false,
  });

  useEffect(() => {
    for (let userFetchedData of usersFetched) {
      if (userFetchedData.email == user?.email) {
        setUserFetched(userFetchedData);
      }
    }

    if (userFetched.role == "USER") {
      router.push("/");
    }

    setEmail(user?.email);
    setLoading(false);
  }, [user]);

  async function handleEditRoleUser(role: "ADMIN" | "USER") {
    await axios.post(
      "/api/v1/db/editRoleUser",
      {
        email: email,
        role: role,
      },
      {
        headers: {
          request: process.env.NEXT_SECRET_API_KEY,
        },
      }
    );
  }

  async function handleNuke(nuked: boolean) {
    await axios.post(
      "/api/v1/db/nuke",
      {
        email: email,
        nuked: nuked,
      },
      {
        headers: {
          request: process.env.NEXT_SECRET_API_KEY,
        },
      }
    );
  }

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-400 top-[1rem] left-[10rem] md:top-[1rem] md:left-[29.5rem] absolute">
          Carregando...
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <ul className="ml-[1.25rem] mt-[1.5rem] break-words md:ml-[1.25rem] md:mt-[1.5rem]">
        {usersFetched.map((users, usersCounted) => {
          const { name, email, nuked, role, createdAt } = users;
          const [isNuked, setIsNuked] = useState(nuked);
          const [userRole, setUserRole] = useState(role);

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
                {userRole == "USER" ? (
                  <span
                    className="text-blue-500"
                    onClick={async () => {
                      setUserRole("ADMIN");
                      await handleEditRoleUser("ADMIN");
                    }}
                  >
                    Promover
                  </span>
                ) : (
                  <span
                    className="text-blue-500"
                    onClick={async () => {
                      setUserRole("USER");
                      await handleEditRoleUser("USER");
                    }}
                  >
                    Rebaixar
                  </span>
                )}{" "}
                ·{" "}
                {isNuked ? (
                  <span
                    className="text-red-500"
                    onClick={async () => {
                      setIsNuked((state) => !state);
                      await handleNuke(false);
                    }}
                  >
                    Banido
                  </span>
                ) : (
                  <span
                    className="text-red-500"
                    onClick={async () => {
                      setIsNuked((state) => !state);
                      await handleNuke(true);
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
}

export async function getServerSideProps(context) {
  let redirect = false;
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
      redirect: redirect,
      page: Number(pagina > 0 ? pagina : 0 || 0),
    },
  };
}
