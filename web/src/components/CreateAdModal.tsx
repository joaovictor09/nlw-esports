import * as Dialog from "@radix-ui/react-dialog"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as ToggleGroup from "@radix-ui/react-toggle-group"
import * as Select from "@radix-ui/react-select"

import { useEffect, useState, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { CaretDown, CaretUp, Check, CircleNotch, GameController } from "phosphor-react"

import { Input } from "../components/Form/Input"
import { Game } from "../pages/Home";
import axios from "axios";
import { PopUpModal } from "./PopUpModal"

interface props{
  children?:
    | React.ReactChild
    | React.ReactChild[];
  selectedGameProp?: string;
}


export function CreateAdModal({ children, selectedGameProp }: props){

  const [games, setGames] = useState<Game[]>([]);
  
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [useVoiceChannel, setUseVoiceChannel] = useState(false)
  const [selectedGame, setSelectedGame] = useState(selectedGameProp)
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [popUpModal, setPopUpModal] = useState(false);
  const [formError, setFormError] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    axios("http://localhost:3333/games").then(response => {
      setGames(response.data);
     })
  }, [])

  function resetFormStates(){
    setWeekDays([]);
    setUseVoiceChannel(false);
    setSelectedGame("")
  }

  async function handleCreateAd(event: FormEvent){
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData)
    setLoading(true);

    try {
      await axios.post(`http://localhost:3333/games/${selectedGame}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel
      })

      // alert("Anúncio criado com sucesso!")

      setPopUpModal(true);
      setFormError(false);
      setModalOpen(false);
      setLoading(false);
      resetFormStates();
    } catch (err) {
      console.log(err);
      // alert("Erro ao criar o anúncio")

      setLoading(false);
      setPopUpModal(true);
      setModalOpen(false);
      setFormError(true);
      resetFormStates();
    }
  }
  
  function ErrorPopUp(){
    return(
      <PopUpModal 
          open={popUpModal} 
          onOpenChange={setPopUpModal}
          title="Erro!"
          buttonText="OK!"
      >
        <span>
          Ocorreu um erro ao criar seu anúncio.<br/> Tente novamente mais tarde!
        </span>
      </PopUpModal>
    )
  }

  function SucessPopUp(){
    return(
      <PopUpModal 
          open={popUpModal} 
          onOpenChange={setPopUpModal}
          title="Sucesso!"
          buttonText="OK!"
      >
        <span>
          Seu anúncio foi publicado com sucesso em nossa vitrine!
        </span>
      </PopUpModal>
    )
  }

  return(
    <>
    <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
      { children }
      <Dialog.Portal>
            <Dialog.Overlay className="bg-black/60 inset-0 fixed">

              <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
                <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>

                  <form 
                    onSubmit={handleCreateAd} 
                    className="mt-8 flex flex-col gap-4"
                    >
                    <div className="flex flex-col gap-2">
                      <label htmlFor="game" className="font-semibold">Qual o game?</label>
                      <Select.Root onValueChange={setSelectedGame} value={selectedGame}>
                        <Select.Trigger className={`flex items-center justify-between bg-zinc-900 py-3 px-4 rounded text-sm ${selectedGame == "" ? 'text-zinc-500' : 'text-white'}`}>
                          <Select.Value placeholder="Selecione um game…"></Select.Value>
                          <Select.Icon>
                            <CaretDown className="w-6 h-6 text-zinc-400"/>
                          </Select.Icon>
                        </Select.Trigger>

                        <Select.Portal className="w-full">
                          <Select.Content className="overflow-hidden bg-zinc-900 rounded-md">
                            <Select.ScrollUpButton className="flex items-center justify-center text-white">
                              <CaretUp />
                            </Select.ScrollUpButton>

                            <Select.Viewport className="p-2">
                              <Select.Group className="flex flex-col text-white gap-1">
                                <Select.Label className="text-zinc-500 mb-2">Games</Select.Label>

                                { games.map(game => {
                                  return (
                                    <Select.Item key={game.id} value={game.id} className="text-white flex flex-row items-center gap-2 hover:cursor-pointer" >
                                    <Select.ItemIndicator className="SelectItemIndicator">
                                      <Check  weight="bold" />
                                    </Select.ItemIndicator>
                                    <Select.ItemText>{game.title}</Select.ItemText>
                                </Select.Item>
                                  )
                                })}
                                
                              </Select.Group>

                            </Select.Viewport>
                            <Select.ScrollDownButton className="flex items-center justify-center text-white">
                              <CaretDown />
                            </Select.ScrollDownButton>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="name">Seu nome (ou nickname)</label>
                      <Input type="text" name="name" id="name" placeholder="Como te chamam dentro do game?"/>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                        <Input type="number" name="yearsPlaying" id="yearsPlaying" placeholder="Tudo bem ser ZERO" style={{MozAppearance: 'textfield', WebkitAppearance: 'none'}}/>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="discord">Qual seu discord?</label>
                        <Input type="text" name="discord" id="discord" placeholder="Usuario#0000" />
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="weekDays">Quando costuma jogar?</label>
                        <ToggleGroup.Root 
                          type="multiple" 
                          className="grid grid-cols-4 gap-2"
                          value={weekDays}
                          onValueChange={setWeekDays}
                        >
                          <ToggleGroup.Item 
                            value="0"
                            title="Domingo"
                            className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                          >
                            D
                          </ToggleGroup.Item>
                          <ToggleGroup.Item 
                            value="1"
                            title="Segunda"
                            className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                          >
                            S
                          </ToggleGroup.Item>
                          <ToggleGroup.Item 
                            value="2"
                            title="Terça"
                            className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                          >
                            T
                          </ToggleGroup.Item>
                          <ToggleGroup.Item 
                            value="3"
                            title="Quarta"
                            className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                          >
                            Q
                          </ToggleGroup.Item>
                          <ToggleGroup.Item 
                            value="4"
                            title="Quinta"
                            className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                          >
                            Q
                          </ToggleGroup.Item>
                          <ToggleGroup.Item 
                            value="5"
                            title="Sexta"
                            className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                          >
                            S
                          </ToggleGroup.Item>
                          <ToggleGroup.Item 
                            value="6"
                            title="Sábado"
                            className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                          >
                            S
                          </ToggleGroup.Item>
                        </ToggleGroup.Root>
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor="hourStart">Qual horário do dia?</label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input type="time" name="hourStart" id="hourStart" placeholder="De" />
                          <Input type="time" name="hourEnd" id="hourEnd" placeholder="Até" />
                        </div>
                      </div>
                    </div>

                    <label className="mt-2  flex gap-2 text-sm items-center">
                      <Checkbox.Root 
                        className="w-6 h-6 p-1 rounded bg-zinc-900" 
                        checked={useVoiceChannel}
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            setUseVoiceChannel(true);
                          } else {
                            setUseVoiceChannel(false);
                          }
                        }}
                      >
                        <Checkbox.Indicator >
                          <Check className="w-4 h-4 text-emerald-400"/>
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      Costume me conectar ao chat de voz
                    </label>

                    <footer className="mt-4 flex gap-4">
                      <Dialog.Close 
                        type="button"
                        className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
                      >
                        Cancelar
                      </Dialog.Close> 

                      <button 
                        className={`px-5 h-12 w-full rounded-md font-semibold flex items-center justify-center gap-3 hover:bg-violet-600 ${loading ? 'bg-violet-600 disabled:cursor-wait' : 'bg-violet-500 cursor-pointer'}`}
                        type="submit"
                        disabled={loading}
                      >
                        { loading 
                        ? (
                            <div className="px-4 h-12 rounded-md font-semibold flex items-center justify-center gap-3">
                              <CircleNotch className="animate-spin" size={24} weight="bold" />
                            </div>
                          )
                        : (
                            <div className="px-1 h-12 rounded-md font-semibold flex items-center gap-2">
                              <GameController size={24}/>
                              Encontrar duo
                            </div>
                          )  
                      }
                        
                      </button>
                    </footer>
                  </form>

              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      {
        !formError 
        ? <SucessPopUp />
        : <ErrorPopUp />
      }
      </>
  )
}