import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

import logoImg from "../assets/logo-nlw-esports.svg";
import { AdBanner } from "../components/AdBanner";
import { CreateAdModal } from "../components/CreateAdModal";
import { CreateAdBanner } from "../components/CreateAdBanner";
import { CaretLeft, CaretRight } from "phosphor-react";

interface ads {
  id: string,
  name: string,
  weekDays: string[],
  useVoiceChannel: boolean,
  yearsPlaying: number,
  hourStart: string,
  hourEnd: string
}

export function GameAds(){
  const { id } = useParams();

  const [ads, setAds] = useState<ads[]>([])
  const [gameTitle, setGameTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true);

  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    slides: {
       perView: 5,
       spacing: 15
    },
    created() {
      setLoaded(true)
    },
  })

  useEffect(()=>{
    async function fetchAdsAndGameTitle(){
      await axios(`http://localhost:3333/games/${id}/ads`).then(response => {
        setAds(response.data);
       }).then(()=> setIsLoading(false))

       await axios(`http://localhost:3333/game/${id}`).then(response => {
        setGameTitle(response.data.title);
       })
    }
    fetchAdsAndGameTitle();
  },[])

  return(
    <div className="max-w-[1344px] w-full mx-auto flex flex-col items-center mt-20 mb-5">

        <Link to="/">
          <img src={logoImg} alt="" />
        </Link>

        <h1 className="text-4xl text-white font-black mt-20">
          Seu&nbsp;
          <span className="bg-nlw-gradient text-transparent bg-clip-text">duo&nbsp;</span>
           de&nbsp;
           <span className="bg-nlw-gradient text-transparent bg-clip-text">{gameTitle}</span> está aqui.
        </h1>

        {
        !isLoading && ads.length >= 1
        ? (
          <>
            <div className="mt-10 relative w-full flex items-center">
              <div ref={sliderRef} className="keen-slider">
                {ads.map(ad => {
                  return(
                      <AdBanner 
                        key={ad.id}
                        id={ ad.id }
                        name={ad.name}
                        hourEnd={ad.hourEnd}
                        hourStart={ad.hourStart}
                        useVoiceChannel={ad.useVoiceChannel}
                        weekDays={ad.weekDays}
                        yearsPlaying={ad.yearsPlaying}
                      />
                  )
                })}
              </div>

              {loaded && instanceRef.current && (
                <>
                  <button
                    className="absolute -left-12 text-zinc-400 disabled:text-zinc-700"
                    onClick={(e: any) =>
                      e.stopPropagation() || instanceRef.current?.prev()
                    }
                    disabled={currentSlide === 0}
                  >
                    <CaretLeft size={48}/>
                  </button>

                  <button
                    className="absolute -right-12 text-zinc-400 disabled:text-zinc-700"
                    onClick={(e: any) =>
                      e.stopPropagation() || instanceRef.current?.next()
                    }
                    disabled={
                      currentSlide ===
                      instanceRef.current.track.details.slides.length - 5
                    }
                  >
                    <CaretRight size={48}/>
                  </button>
                </>
              )}
            </div>
            <CreateAdModal selectedGameProp={id}>
              <CreateAdBanner />
            </CreateAdModal>
          </>
          )
        : 'Carregando'
        }
        

    
    </div>

  );
}