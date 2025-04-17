import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import {authOptions} from "@/lib/authOptions";
import {getServerSession} from "next-auth";
import Link from "next/link";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return (
    <header className="bg-white p-4 px-8">
      <div className="flex justify-between items-center">
        < h1 className="logo">Gerenciador de projetos</h1>
        <div>
          {session && (
            <>
              Olá, {session?.user?.name}
              <LogoutButton />
            </>
          )}
          {!session && (
            <>
              Não está logado
              <LoginButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}