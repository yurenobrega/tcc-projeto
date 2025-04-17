"use client";

import {
  Card,
  useMutation,
  useStorage,
  useThreads,
} from "@/app/liveblocks.config";
import { BoardContext, BoardContextProps } from "@/components/BoardContext";
import CancelButton from "@/components/CancelButton";
import CardDescription from "@/components/CardDescription";
import DeleteWithConfirmation from "@/components/DeleteWithConfirmation";
import { faComments, faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shallow } from "@liveblocks/core";
import { Composer, Thread, CommentsConfig } from "@liveblocks/react-comments";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useContext, useEffect, useState } from "react";

export default function CardModalBody() {
  const router = useRouter();
  const params = useParams();
  const { threads } = useThreads({
    query: {
      metadata: {
        cardId: params.cardId.toString(),
      },
    },
  });
  const { setOpenCard } = useContext<BoardContextProps>(BoardContext);
  const [editMode, setEditMode] = useState(false);

  const card = useStorage((root) => {
    return root.cards.find((c) => c.id === params.cardId);
  }, shallow);

  const updateCard = useMutation(({ storage }, cardId, updateData) => {
    const cards = storage.get("cards").map((c) => c.toObject());
    const index = cards.findIndex((c) => c.id === cardId);
    const card = storage.get("cards").get(index);
    for (let updateKey in updateData) {
      card?.set(updateKey as keyof Card, updateData[updateKey]);
    }
  }, []);

  const deleteCard = useMutation(({ storage }, id) => {
    const cards = storage.get("cards");
    const cardIndex = cards.findIndex((c) => c.toObject().id === id);
    cards.delete(cardIndex);
  }, []);

  useEffect(() => {
    if (params.cardId && setOpenCard) {
      setOpenCard(params.cardId.toString());
    }
  }, [params]);

  function handleDelete() {
    deleteCard(params.cardId);
    if (setOpenCard) {
      setOpenCard(null);
    }
    router.back();
  }

  function handleNameChangeSubmit(ev: FormEvent) {
    ev.preventDefault();
    const input = (ev.target as HTMLFormElement).querySelector("input");
    if (input) {
      const newName = input.value;
      updateCard(params.cardId, { name: newName });
      setEditMode(false);
    }
  }

  return (
    <CommentsConfig
      overrides={{
        locale: "pt-BR",
        THREAD_COMPOSER_PLACEHOLDER: "Escreva um comentário…",
        THREAD_RESOLVE: "Resolver",
        THREAD_UNRESOLVE: "Desfazer resolução",
        THREAD_COMPOSER_SEND: "Enviar",
        COMMENT_MORE: "Mais",
        COMMENT_EDIT: "Editar",
        COMMENT_EDIT_COMPOSER_PLACEHOLDER: "Editar comentário…",
        COMMENT_EDIT_COMPOSER_CANCEL: "Cancelar",
        COMMENT_EDIT_COMPOSER_SAVE: "Salvar",
        COMMENT_DELETE: "Excluir",
        COMMENT_ADD_REACTION: "Adicionar reação",
        COMPOSER_PLACEHOLDER: "Responder…",
        COMPOSER_INSERT_EMOJI: "Adicionar emoji",
        COMPOSER_SEND: "Enviar",
        COMPOSER_INSERT_MENTION: "Adicionar menção",
        EMOJI_PICKER_SEARCH_PLACEHOLDER: "Pesquisar",
        UNKNOWN_USER: "Usuário desconhecido",
        LIST_REMAINING: (count) => `+${count} mais`,
        EMOJI_PICKER_EMPTY: <>Nenhum emoji encontrado</>,
        EMOJI_PICKER_ERROR: (error) => <>Erro ao carregar emojis: {error.message}</>,
        COMMENT_REACTION_REMAINING: (others: number) =>
          `e mais ${others}`,
        COMMENT_REACTION_DESCRIPTION: (emoji: string, count: number) =>
          `${count} pessoa${count > 1 ? "s" : ""} reagiu com ${emoji}`,
        COMMENT_REACTION_TOOLTIP: (emoji, list, count) => (
          <>
            {count === 1 ? (
              <>1 pessoa reagiu com {emoji}</>
            ) : (
              <>{count} pessoas reagiram com {emoji}</>
            )}
          </>),
      }}
    >
      <>
        {!editMode && (
          <div className="flex justify-between">
            <h4 className="text-2xl">{card?.name}</h4>
            <button className="text-gray-400" onClick={() => setEditMode(true)}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          </div>
        )}
        {editMode && (
          <div>
            <form onSubmit={handleNameChangeSubmit}>
              <input type="text" defaultValue={card?.name} className="mb-2" />
              <button type="submit" className="w-full">
                Salvar
              </button>
            </form>
            <div className="mt-2">
              <DeleteWithConfirmation onDelete={() => handleDelete()} />
            </div>
            <CancelButton onClick={() => setEditMode(false)} />
          </div>
        )}
        {!editMode && (
          <div>
            <h2 className="flex gap-2 items-center mt-4">
              <FontAwesomeIcon icon={faFileLines} />
              Descrição
            </h2>
            <CardDescription />
            <h2 className="flex gap-2 items-center mt-4">
              <FontAwesomeIcon icon={faComments} />
              Comentários
            </h2>
            <div className="-mx-4">
              {threads &&
                threads.map((thread) => (
                  <div key={thread.id}>
                    <Thread thread={thread} id={thread.id} />
                  </div>
                ))}
              {threads?.length === 0 && (
                <div>
                  <Composer metadata={{ cardId: params.cardId.toString() }} />
                </div>
              )}
            </div>
          </div>
        )}
      </>
    </CommentsConfig>
  );
}
