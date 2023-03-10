import * as Dialog from "@radix-ui/react-dialog"
import * as Checkbox from "@radix-ui/react-checkbox"
import * as ToggleGroup from "@radix-ui/react-toggle-group"
import * as Select from "@radix-ui/react-select"

import { useEffect, useState, FormEvent } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CaretDown, CaretUp, Check, CircleNotch, Divide, GameController } from "phosphor-react"

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

interface FormData {
  name: string;
  game: string;
  yearsPlaying: string;
  discord: string;
  weekDays: string[];
  hourStart: string;
  hourEnd: string;
  useVoiceChannel: boolean;
};

function AlertSpan(message: string){
  return(
    <p className="text-xs text-red-500" role="alert">{message}</p>
  )
}

export function CreateAdModal({ children, selectedGameProp }: props){

  const [games, setGames] = useState<Game[]>([]);
  
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [useVoiceChannel, setUseVoiceChannel] = useState(false)
  const [selectedGame, setSelectedGame] = useState(selectedGameProp)
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [popUpModal, setPopUpModal] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      game: selectedGameProp || '',
      yearsPlaying: "",
      discord: "",
      weekDays: [],
      hourStart: "",
      hourEnd: "",
      useVoiceChannel: false
    }
  });

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


  const handleCreateAd: SubmitHandler<FormData> = async data => {
    const { name, discord, game, hourEnd, hourStart, useVoiceChannel, weekDays, yearsPlaying } = data;
    setLoading(true);

    try {
      await axios.post(`http://localhost:3333/games/${game}/ads`, {
        name,
        yearsPlaying: Number(yearsPlaying),
        discord,
        weekDays: weekDays.map(Number),
        hourStart: hourStart,
        hourEnd: hourEnd,
        useVoiceChannel: useVoiceChannel
      })

      // alert("Anúncio criado com sucesso!")

      setPopUpModal(true);
      setModalOpen(false);
      setLoading(false);
      reset();
    } catch (err) {
      console.log(err);
      // alert("Erro ao criar o anúncio")
      setLoading(false);
    }
  };

  useEffect(() => {
    axios("http://localhost:3333/games").then(response => {
      setGames(response.data);
     })
  }, [])

  return(
    <>
    <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
      { children }
      <Dialog.Portal>
            <Dialog.Overlay className="bg-black/60 inset-0 fixed">

              <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
                <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>

                  <form 
                    onSubmit={handleSubmit(handleCreateAd)} 
                    className="mt-8 flex flex-col gap-4"
                    >
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="game" className="font-semibold">Qual o game?</label>
                      <Controller
                        name="game"
                        control={control}
                        rules={{
                          required: true
                        }}
                        render={({ field: {onChange, value} }) => { return(
                          <Select.Root {...onChange} onValueChange={(value) => {onChange(value)}} value={selectedGame}>
                            <Select.Trigger className={`flex items-center justify-between bg-zinc-900 py-3 px-4 rounded text-sm ${selectedGame == "" ? 'text-zinc-500' : 'text-white'}`}>
                              <Select.Value placeholder="Selecione um game…"></Select.Value>
                              <Select.Icon>
                                <CaretDown className="w-6 h-6 text-zinc-400"/>
                              </Select.Icon>
                            </Select.Trigger>
    
                            <Select.Portal className="w-full aria-invalid={errors.game ? 'true' : 'false'}">
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
                            {errors.game?.type === 'required' && AlertSpan("Selecione o jogo")}
                          </Select.Root>
                        )}}
                      />
                      
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="name">Seu nome (ou nickname)</label>
                      <Controller
                        name="name"
                        control={control}
                        rules={{
                          required: true,
                          minLength: 3
                        }}
                        render={({ field: {onChange} }) => { return(
                          <>
                            <Input  
                              type="text" 
                              name="name" 
                              id="name" 
                              {...onChange} 
                              onChange={onChange} 
                              placeholder="Como te chamam dentro do game?"
                              aria-invalid={errors.name ? "true" : "false"} 
                            />
                            {
                              errors.name?.type === 'required' && AlertSpan("Selecione o seu nome") ||
                              (errors.name?.type ==='minLength' && AlertSpan("Mínimo de 3 caracteres"))
                            }
                          </>
                          )}
                        }
                          
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                        <Controller
                          name="yearsPlaying"
                          control={control}
                          rules={{
                            required: true,
                            pattern: /^[0-9]+$/ 
                          }}
                          render={({ field: {onChange} }) => 
                            <>
                              <Input {...onChange} 
                                onChange={onChange} 
                                type="number" 
                                name="yearsPlaying" 
                                id="yearsPlaying" 
                                placeholder="Tudo bem ser ZERO" 
                                style={{MozAppearance: 'textfield', WebkitAppearance: 'none'}}
                                aria-invalid={errors.yearsPlaying ? "true" : "false"} 
                              />
                              {errors.yearsPlaying?.type === 'required' && AlertSpan("Insira há quantos anos você joga") 
                              || errors.yearsPlaying?.type === 'pattern' && AlertSpan("Insira um número válido(0-9)")
                              }
                            </>}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="discord">Qual seu discord?</label>
                        <Controller
                          name="discord"
                          control={control}
                          rules={{
                            required: true,
                            pattern: /^.{3,32}#[0-9]{4}$/
                          }}
                          render={({ field: {onChange} }) => 
                            <>
                              <Input {...onChange} 
                                onChange={onChange} 
                                type="text" 
                                name="discord" 
                                id="discord" 
                                placeholder="Usuario#0000" 
                                style={{MozAppearance: 'textfield', WebkitAppearance: 'none'}}
                                aria-invalid={errors.discord ? "true" : "false"} 
                              />
                              {errors.discord?.type === 'required' && AlertSpan("Insira seu Discord") 
                              || errors.discord?.type === 'pattern' && AlertSpan("Insira um Discord válido")
                              }
                            </>}
                        />
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="weekDays">Quando costuma jogar?</label>
                        <Controller
                          name="weekDays"
                          control={control}
                          rules={{
                            required: true
                          }}
                          render={({ field: {onChange} }) => {
                            return (
                              <>
                                <ToggleGroup.Root 
                                  type="multiple" 
                                  className="grid grid-cols-5 gap-2"
                                  value={weekDays}
                                  onValueChange={(value) => {setWeekDays(value); onChange(value)}}
                                  aria-invalid={errors.weekDays ? "true" : "false"} 
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
                                {
                                  errors.weekDays?.type === 'required' && AlertSpan("Insira ao menos um dia")
                                }
                              </>
                            )
                          }}
                        />
                      </div>

                      <div className="flex flex-col gap-2 flex-1">
                        <label htmlFor="hourStart">Qual horário do dia?</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="overflow-hidden rounded">
                            <Controller
                              name="hourStart"
                              control={control}
                              rules={{
                                required: true
                              }}
                              render={({ field: {onChange} }) => 
                                <Input {...onChange} 
                                  onChange={onChange} 
                                  type="time" 
                                  name="hourStart" 
                                  id="hourStart" 
                                  placeholder="De" 
                                  aria-invalid={errors.hourStart ? "true" : "false"} 
                                />}
                            />
                          </div>
                          <div className="overflow-hidden rounded">
                            <Controller
                                name="hourEnd"
                                control={control}
                                rules={{
                                  required: true
                                }}
                                render={({ field: {onChange} }) => 
                                  <Input {...onChange} 
                                    onChange={onChange} 
                                    type="time" 
                                    name="hourEnd" 
                                    id="hourEnd" 
                                    placeholder="Até" 
                                    aria-invalid={errors.hourEnd ? "true" : "false"} 
                                  />}
                              />
                          </div>
                        </div>
                        {
                          errors.hourStart?.type === 'required' && AlertSpan("Insira um horário válido") || 
                          errors.hourEnd?.type === 'required' && AlertSpan("Insira um horário válido")
                        }
                      </div>
                    </div>

                    <label className="mt-2  flex gap-2 text-sm items-center">
                    <Controller
                      name="useVoiceChannel"
                      control={control}
                      render={({ field: {onChange} }) => {
                        return(
                          <Checkbox.Root 
                            className="w-6 h-6 p-1 rounded bg-zinc-900" 
                            checked={useVoiceChannel}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                setUseVoiceChannel(true);
                                onChange(true);
                              } else {
                                setUseVoiceChannel(false);
                                onChange(false);
                              }
                            }}
                          >
                            <Checkbox.Indicator >
                              <Check className="w-4 h-4 text-emerald-400"/>
                            </Checkbox.Indicator>
                          </Checkbox.Root>
                        )
                      }}
                    />
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
        <SucessPopUp />
      </>
  )
}