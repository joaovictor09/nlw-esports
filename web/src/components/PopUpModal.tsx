import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction, useState } from "react";

interface props {
  title: string;
  buttonText: string;
  children?: JSX.Element | JSX.Element[];
  open: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export function PopUpModal({open, onOpenChange, title, buttonText, children}: props){

  return(
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal className="">
        <Dialog.Overlay>
          <Dialog.Content className="fixed bg-[#2A2634] flex flex-col gap-5 py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
            <Dialog.Title className="self-center text-3xl font-bold">
              {title}
            </Dialog.Title>

            <div>
              {children}
            </div>

            <Dialog.Close
              type="button"
              className="w-full bg-violet-500 px-5 h-12 rounded-md font-semibold hover:bg-violet-600"

            >
              {buttonText}
            </Dialog.Close>

          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}