import { useState } from "react";
import Layout from "../components/Layout";

export default function Publicar() {
  const [mode, setMode] = useState('write')

  return (
    <Layout>
      <h1 className="font-semibold md:text-[2rem] md:mt-[1.5rem] md:ml-[1.625rem]">
        Publicar novo conteúdo
      </h1>

      <input
        className="border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[6rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
        placeholder="Título"
      ></input>
      <div>
        <textarea className="h-72 border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-[8rem] md:py-[3rem] md:top-[9.725rem] md:left-[1.625rem] md:w-[60.75rem] absolute"></textarea>
        <button
          onClick={() => {
            setMode("write");
          }}
          className="write md:text-[0.9rem] md:top-[10rem] md:left-[3rem] absolute"
        >
          Escrever
        </button>
        <button
          onClick={() => {
            setMode("view");
          }}
          className="view md:text-[0.9rem] md:top-[10rem] md:left-[7.5rem] absolute"
        >
          Visualizar
        </button>
      </div>

      <input
        className="border-[2px] border-black border-opacity-20 rounded-md outline-none focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[28.75rem] md:left-[1.625rem] md:w-[60.75rem] absolute"
        placeholder="Fonte (Opicional)"
      ></input>

        <button
          className="text-gray-600 md:text-base md:top-[34rem] md:left-[52rem] absolute"
        >
          Cancelar
        </button>
        <button
          className="border border-gray-500 px-3 py-[0.15rem] rounded-md text-white bg-[#2DA44E] md:text-base md:top-[33.75rem] md:left-[57.5rem] absolute"
        >
          Publicar
        </button>

      <style jsx>{`
        .view {
          ${mode == "view" ? "color: RoyalBlue;" : null}
        }

        .write {
          ${mode == "write" ? "color: RoyalBlue;" : null}
        }
      `}</style>
    </Layout>
  );
}
