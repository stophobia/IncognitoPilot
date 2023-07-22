'use client'

import React from "react";
import { Message } from "@/llm/base";
import ChatInput from "@/app/chat_input";
import ChatHistory from "@/app/chat_history";
import InterpreterIO from "@/app/interpreter_io";
import { Interpreter } from "@/app/api_calls";
import { useApprover } from "@/app/approver";
import { ChatRound } from "@/app/chat_round";


export default function Session() {
  const [history, setHistory] = React.useState<Message[]>([])

  const chatInputRef = React.useRef<HTMLInputElement | null>(null);
  const [chatInputDisabled, setChatInputDisabled] = React.useState<boolean>(false)

  const [approverInRef, code, askApproveIn, autoApproveIn] = useApprover()
  const [approverOutRef, result, askApproveOut, autoApproveOut] = useApprover()

  const interpreterRef = React.useRef<Interpreter | null>(null);
  if(interpreterRef.current === null) {
    interpreterRef.current = new Interpreter()
  }

  const focusChatInput = () => {
    setTimeout(() => chatInputRef.current && chatInputRef.current.focus(), 100)
  }
  React.useEffect(focusChatInput, [])

  const endChatRound = () => {
    setChatInputDisabled(false)
    focusChatInput()
  }

  const startChatRound = (message: string) => {
    setChatInputDisabled(true)
    const chatRound = new ChatRound(
      history,
      setHistory,
      approverInRef.current,
      approverOutRef.current,
      interpreterRef.current!,
      endChatRound
    )
    chatRound.start(message)
  }


  return (
    <div className="flex gap-4 h-full bg-blue-50">
      <div className="flex-1 flex flex-col px-4">
        <div className="flex-1 h-0 overflow-y-auto">
          <ChatHistory history={history} />
        </div>
        <div className="flex-0">
          <ChatInput
            innerRef={chatInputRef}
            disabled={chatInputDisabled}
            onMessage={startChatRound}
          />
        </div>
      </div>
      <div className="flex-1 w-0 flex flex-col px-4 bg-blue-100 shadow-[0_0_25px_10px_rgba(0,0,0,0.15)]">
        <div className="flex-1 flex flex-col h-0">
          <div className="flex-1 h-0">
            <InterpreterIO
              title="Code"
              content={code}
              askApprove={askApproveIn}
              autoApprove={autoApproveIn}
              approver={approverInRef.current}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col h-0">
          <div className="flex-1 h-0">
            <InterpreterIO
              title="Result"
              content={result}
              askApprove={askApproveOut}
              autoApprove={autoApproveOut}
              approver={approverOutRef.current}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
