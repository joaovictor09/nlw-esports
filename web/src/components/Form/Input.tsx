import { InputHTMLAttributes } from 'react'
import { useForm } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps){
  const { register, handleSubmit } = useForm();

  return(
      <input 
        {...props}
        className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500"
        
      />
  )
}