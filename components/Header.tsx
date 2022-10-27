import { useRouter } from "next/router";
import { useState } from "react";
import { useUser } from "../lib/hooks/useUser"
import { User } from "phosphor-react"
import axios from "axios";

export default function Header() {
  const router = useRouter()
  const user = useUser({})

  const [lookingAt, setLokingAt] = useState('relevant');
  const [menuVisible, setMenuVisible] = useState(false)

  async function handleLogout() {
    await axios.post("/api/v1/auth/logout")
    router.push("/")
  }

  return (
    <div className="w-screen h-16 bg-[#23292f] absolute">
      <div onClick={() => {
        router.push('/')
      }} className="left-[0.5rem] top-[1.125rem] md:left-[1rem] md:top-[1.125rem] absolute">
        <svg
          className="hover:opacity-60"
          stroke="#ffffff"
          fill="none"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.9999 4C20.6568 4 21.9999 5.34315 21.9999 7V17C21.9999 18.6569 20.6568 20 18.9999 20H4.99994C3.34308 20 1.99994 18.6569 1.99994 17V7C1.99994 5.34315 3.34308 4 4.99994 4H18.9999ZM19.9999 9.62479H13C12.4478 9.62479 11.8442 9.20507 11.652 8.68732L10.6542 6H4.99994C4.44765 6 3.99994 6.44772 3.99994 7V17C3.99994 17.5523 4.44765 18 4.99994 18H18.9999C19.5522 18 19.9999 17.5523 19.9999 17V9.62479Z"
            fill="#ffffff"
          ></path>
        </svg>
      </div>
      <a className="hidden text-white font-[600] md:flex md:text-[0.900rem] md:top-[1.5rem] md:left-[3.5rem] absolute">
        DailyNews
      </a>
      <a onClick={() => {
        setLokingAt('relevant')
        router.push('/')
      }} className="relevant text-white font-[600] top-[1.225rem] left-[3.5rem] text-[0.875rem] md:text-[0.9rem] md:top-[1.5rem] md:left-[8.95rem] absolute">
        Relevantes
      </a>
      <a onClick={() => {
        setLokingAt('recent')
        router.push('/recent')
      }} className="recent text-white font-[600] top-[1.225rem] left-[8.5rem] text-[0.875rem] md:text-[0.900rem] md:top-[1.5rem] md:left-[14.4rem] absolute">
        Recentes
      </a>
      {user?.email === undefined ?  (
        <div>
          <a onClick={() => {
            setLokingAt('cadastro')
            router.push('/cadastro')
          }} className="text-white font-[600] top-[1.225rem] right-[1.225rem] text-[0.875rem] md:text-[0.900rem] md:top-[1.5rem] md:right-[3rem] absolute">
            Cadastrar
          </a>

          <a onClick={() => {
            setLokingAt('login')
            router.push('/login')
          }} className=" text-white font-[600] top-[1.225rem] right-[5.725rem] text-[0.875rem] md:text-[0.900rem] md:top-[1.5rem] md:right-[8rem] absolute">
            Login
          </a>
        </div>
      ) : null}

      <style jsx>{`
        a {
          cursor: pointer;
        }

        a:hover {
          color: #9CA3AF;
          border-color: #9CA3AF;
        }

        .recent {
          ${lookingAt == 'recent' ? "border-bottom-width: 1px;" : null}
        }

        .relevant {
          ${lookingAt == 'relevant' ? "border-bottom-width: 1px;" : null}
        }
      `}</style>
    </div>
  );
}
