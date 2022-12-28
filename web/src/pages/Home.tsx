import { useEffect, useState } from "react";
import axios from "axios";

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

import logoImg from "../assets/logo-nlw-esports.svg";
import { GameBanner } from "../components/GameBanner";
import { CreateAdBanner } from "../components/CreateAdBanner";
import { CreateAdModal } from "../components/CreateAdModal";

import "../styles/main.css";
import { CaretLeft, CaretRight } from "phosphor-react";

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
    
  const [loaded, setLoaded] = useState(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
       perView: 5,
       spacing: 15
    },
    loop: true,
    created() {
      setLoaded(true)
    },
  },
  [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>
      let mouseOver = false
      function clearNextTimeout() {
        clearTimeout(timeout)
      }
      function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider.next()
        }, 2000)
      }
      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })
      slider.on("dragStarted", clearNextTimeout)
      slider.on("animationEnded", nextTimeout)
      slider.on("updated", nextTimeout)
    },
  ])

  useEffect(() => {
    axios("http://localhost:3333/games").then(response => {
      setGames(response.data);
     }).then(() => {setIsLoading(false)})
  }, [])

  return (
    <div className={"max-w-[1344px] w-full mx-auto flex flex-col items-center mt-10"}>


      <img src={logoImg} alt="" />

      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className="bg-nlw-gradient text-transparent bg-clip-text">duo</span> está aqui.
      </h1>

      {
        !isLoading
        ? (
          <>
            <div className="mt-10 relative w-full flex items-center">
              <div ref={sliderRef} className="keen-slider">
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

              {loaded && instanceRef.current && (
                <>
                  <button
                    className="absolute -left-12 text-zinc-400"
                    onClick={(e: any) =>
                      e.stopPropagation() || instanceRef.current?.prev()
                    }
                    // disabled={currentSlide === 0}
                  >
                    <CaretLeft size={48}/>
                  </button>

                  <button
                    className="absolute -right-12 text-zinc-400"
                    onClick={(e: any) =>
                      e.stopPropagation() || instanceRef.current?.next()
                    }
                    // disabled={
                    //   currentSlide ===
                    //   instanceRef.current.track.details.slides.length - 1
                    // }
                  >
                    <CaretRight size={48}/>
                  </button>
                </>
              )}
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