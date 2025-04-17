import Boards from "@/components/Boards";
import LoginView from "@/components/views/LoginView";
import {authOptions} from "@/lib/authOptions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getServerSession} from "next-auth";
import Link from "next/link";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <LoginView />
    );
  }
  return (
    <div>
      <h1 className="text-4xl mb-4">Seus quadros</h1>
      <Boards/>
      <div className="mt-4">
        <Link
          className="btn primary inline-flex gap-2"
          href={'/new-board'}>
          Criar novo quadro <FontAwesomeIcon className="h-6" icon={faArrowRight}/>
        </Link>
      </div>
    </div>
  )
}
