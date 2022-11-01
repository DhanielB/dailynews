import Header from "./Header";

export default function Layout({ children }: { children: any }) {
  return (
    <div className="flex w-max h-full">
      <Header></Header>
      <div className="flex w-screen h-[45.5rem] md:h-[37rem] top-16 absolute">
        {children}
      </div>
    </div>
  );
}
