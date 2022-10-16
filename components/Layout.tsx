import Header from "./Header"

export default function Layout({ children }: { children: any }) {
  return (
    <div className="flex w-full h-full">
      <Header></Header>
      <div className="flex w-full h-[45.5rem] md:h-[37rem] top-16 absolute">
        {children}
      </div>
    </div>
  )
}