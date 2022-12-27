import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

import logoImg from "../assets/logo-nlw-esports.svg";
import { AdBanner } from "../components/AdBanner";
import { CreateAdModal } from "../components/CreateAdModal";
import { CreateAdBanner } from "../components/CreateAdBanner";

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

  const [ref] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 5,
      spacing: 15,
    },
  })

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
        !isLoading
        ? (
            <div ref={ref} className="w-full keen-slider mt-10">
              
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
          )
        : 'Carregando'
        }
        
        <CreateAdModal selectedGameProp={id}>
          <CreateAdBanner />
        </CreateAdModal>
    
    </div>

  );
}