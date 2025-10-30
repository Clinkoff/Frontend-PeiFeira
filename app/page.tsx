import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">PeiFeira ✅</h1>
        <p className="text-gray-600 mb-6">Sistema de Gestão de Projetos Integradores</p>

        <div className="space-y-2 mb-6">
          <p className="text-sm text-green-600 font-semibold">✅ Next.js 14</p>
          <p className="text-sm text-green-600 font-semibold">✅ TypeScript</p>
          <p className="text-sm text-green-600 font-semibold">✅ Tailwind CSS v4</p>
          <p className="text-sm text-green-600 font-semibold">✅ Origin UI</p>
          <p className="text-sm text-green-600 font-semibold">✅ Node.js 22.20.0</p>
        </div>

        {/* Testando componentes do Origin UI */}
        <div className="space-y-3">
          <Button className="w-full">Botão Primary</Button>
          <Button variant="secondary" className="w-full">
            Botão Secondary
          </Button>
          <Button variant="outline" className="w-full">
            Botão Outline
          </Button>
          <Button variant="destructive-outline" className="w-full">
            Delete
          </Button>
          <Button variant="destructive" className="w-full">
            Botão Destructive
          </Button>
        </div>
      </div>
    </main>
  );
}
