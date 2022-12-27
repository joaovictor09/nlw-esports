import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { CheckCircle, Clipboard, GameController } from "phosphor-react";
import { useState } from "react";

interface AdBannerModalProps{
  id: string;
}

export function AdBannerModal(props: AdBannerModalProps){

  const [discord, setDiscord] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function fetchDiscordHandle(open: boolean){
    if (open) {
      setIsLoading(true)
      await axios(`http://localhost:3333/ads/${props.id}/discord`).then(response => {
        setDiscord(response.data.discord);
       }).then(()=> setIsLoading(false))
    }
  }

  function copyDiscordHandle(){
    navigator.clipboard.writeText(discord)
  }

  return(
    <Dialog.Root onOpenChange={(open) => {fetchDiscordHandle(open)}}>
      <Dialog.Trigger className="w-full h-12 rounded-md flex flex-row items-center justify-center bg-violet-500 text-white font-semibold gap-2">
        <GameController />
        Conectar
      </Dialog.Trigger>
      <Dialog.Portal >
        <Dialog.Overlay>
          <Dialog.Content className="fixed bg-[#2A2634] flex flex-col items-center gap-5 py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
            <CheckCircle className="h-16 w-16 text-emerald-400"/>
            <Dialog.Title className="self-center text-3xl font-bold">
              Let's Play
            </Dialog.Title>

            <div className="flex flex-col items-center gap-6">
              <span className="text-zinc-400 font-normal ">Agora é só começar a jogar!</span>
              <strong className="font-semibold">Adicione no Discord</strong>
              <span
                className="w-full flex justify-center py-3 px-3 rounded bg-zinc-900"
              >
                {discord}
              </span>
            </div>

            <div className="flex w-full gap-2">
              <Dialog.Close
                type="button"
                className="w-full bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
                onClick={copyDiscordHandle}
              >
                Cancelar
              </Dialog.Close>
              <button 
                className="w-full flex items-center gap-2 justify-center bg-violet-500 px-5 h-12 rounded-md font-semibold hover:bg-violet-600"
                onClick={copyDiscordHandle}
              >
                <Clipboard  className="h-12 font-bold"/>
                Copiar Discord
              </button>
            </div>
            

          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}