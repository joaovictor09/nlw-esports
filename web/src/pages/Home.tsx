import { useEffect, useState } from "react";
import axios from "axios";

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

import logoImg from "../assets/logo-nlw-esports.svg";
import { GameBanner } from "../components/GameBanner";
import { CreateAdBanner } from "../components/CreateAdBanner";
import { CreateAdModal } from "../components/CreateAdModal";

import "../styles/main.css";

export interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  }
}

export function Home() {

  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    
  const [ref] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 5,
      spacing: 15,
    },
  })

  useEffect(() => {
    axios("http://localhost:3333/games").then(response => {
      setGames(response.data);
     }).then(() => {setIsLoading(false)})
  }, [])

  return (
    <div className={"max-w-[1344px] w-max mx-auto flex flex-col items-center mt-20"}>


      <img src={logoImg} alt="" />

      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className="bg-nlw-gradient text-transparent bg-clip-text">duo</span> está aqui.
      </h1>

      {
        !isLoading
        ? (
          <>
          <div ref={ref} className="keen-slider mt-10">
            {games.map(game => {
              return (
                <div key={game.id} className="keen-slider__slide">
                  <GameBanner 
                    adsCount={game._count.ads} 
                    bannerUrl={game.bannerUrl} 
                    title={game.title}
                    gameId={game.id}
                  />
                </div>
              )
            })}
          </div>
          </>
          )
        : 'Carregando'
      }

      

      <CreateAdModal>
        <CreateAdBanner />
      </CreateAdModal>
    </div>
  )
}