import { GameController } from "phosphor-react";
import { AdBannerModal } from "./AdBannerModal";

interface adProps{
  id: string,
  name: string,
  weekDays: string[],
  useVoiceChannel: boolean,
  yearsPlaying: number,
  hourStart: string,
  hourEnd: string
}

export function AdBanner({ id, name, yearsPlaying, weekDays, useVoiceChannel, hourStart, hourEnd }: adProps){
  return(
    <div className="w-full flex flex-col gap-4 rounded-lg bg-[#2A2634] p-5 keen-slider__slide">
      <div className="flex flex-col gap-4 ">

        <div className=" flex flex-col ">
          <span className="text-zinc-500 font-normal text-sm ">Nome</span>
          <strong className="font-bold text-white">{name}</strong>
        </div>

        <div className=" flex flex-col">
          <span className="text-zinc-500 font-normal text-sm">Tempo de jogo</span>
          <strong className="font-bold text-white">{yearsPlaying} anos</strong>
        </div>

        <div className=" flex flex-col">
          <span className="text-zinc-500 font-normal text-sm">Disponibilidade</span>
          <strong className="font-bold text-white">{String(weekDays.length)} dias &#x2022; {hourStart} - {hourEnd}</strong>
        </div>

        <div className=" flex flex-col">
          <span className="text-zinc-500 font-normal text-sm">Chamada de áudio?</span>
          {
            useVoiceChannel
            ?
              <strong className="font-bold text-emerald-400">Sim</strong>
            : <strong className="font-bold text-red-500">Não</strong>
          }
        </div>
      </div>
      <AdBannerModal id={id}/>
      
  </div>
  )
}