import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "./components/sign-in-form";
import { SignUpForm } from "./components/sign-up-form";

export default function SignInPage() {
  return (
    <div className="bg-white flex flex-col">
      <main className="bg-white flex flex-col gap-4 max-w-sm w-full lg:m-0 lg:translate-y-0 mx-auto -translate-y-1/2 rounded-lg p-7 border border-slate-200">
        <h1 className="text-blue-700 lg:text-5xl text-4xl font-poppins font-extrabold">Roda Ja</h1>
        <p className="text-slate-800">Um sistema PDV feito pro seu negócio!</p>

        <Tabs defaultValue="sign-in" className="w-full">
          <TabsList className="w-full rounded-full">
            <TabsTrigger className="rounded-full" value="sign-in">Entrar em uma conta</TabsTrigger>
            <TabsTrigger className="rounded-full" value="sign-up">Criar uma conta</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <SignInForm />
          </TabsContent>
          <TabsContent value="sign-up">
            <SignUpForm />
          </TabsContent>
        </Tabs>

      </main>
    </div>
  )
}