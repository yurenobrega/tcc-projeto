'use client';
import {faArrowLeft, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

type Props = {
  onDelete: () => void;
};
export default function DeleteWithConfirmation({onDelete}: Props) {
  const [wannaDelete, setWannaDelete] = useState(false);

  if (wannaDelete) {
    return (
      <div>
        <h4 className="mb-2 text-center">Tem certeza?</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="">
            <button
              className="btn block grow w-full with-icon"
              onClick={() => setWannaDelete(false)}
            >
              <FontAwesomeIcon icon={faArrowLeft}/>
              Não
            </button>
          </div>
          <div>
            <button onClick={onDelete} className="w-full btn red with-icon">
              Sim, excluir!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setWannaDelete(true)}
      className="bg-red-500 text-white p-2 w-full justify-center items-center flex gap-2 rounded-md">
      <FontAwesomeIcon icon={faTrash}/>
      Excluir
    </button>
  );
}