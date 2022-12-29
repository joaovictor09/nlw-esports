import { useRouteError, Link, isRouteErrorResponse  } from "react-router-dom";
import logoImg from "../assets/logo-nlw-esports.svg";

export function ErrorPage() {
  const error  = useRouteError();
  
  if (isRouteErrorResponse(error)){

    return (
      <div className={"max-w-[1344px] w-full mx-auto flex flex-col items-center mt-10"}>
        <img src={logoImg} alt="" />

        <h1 className="text-6xl text-white font-black mt-20">
          <span className="bg-nlw-gradient text-transparent bg-clip-text">Oops!</span>
        </h1>

        <div className="flex w-full h-full justify-between items-center mt-10">
          <h2 className="text-white font-bold text-9xl w-full border-r-[1px] border-white">Erro {error.status}</h2>
          <div className="w-full flex flex-col items-center gap-10 text-8xl font-bold text-zinc-400">
            <p>{error.statusText}</p>
            {error.data?.message && <p>{error.data.message}</p>}
            <Link 
              to="/"
              className="text-2xl text-white w-max bg-violet-500 py-3 px-4 rounded hover:bg-violet-600"
            >
              Voltar para encontrar seu Duo
            </Link>
          </div>
        </div>
      </div>
    );
  } else{
    return(
      <div></div>
    )
  }
}