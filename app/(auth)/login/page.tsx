'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/lib/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, LogIn, Hash, Lock, GraduationCap, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage('');
      await login(data);
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMessage(error?.message || 'Erro ao fazer login. Tente novamente.');
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="container mx-auto w-lg my-8! p-6!">
      <CardHeader className="text-center p-5! space-y-4 pb-6">
        <div
          className="w-20 h-20 mx-auto! rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#6F73D2' }}
        >
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl" style={{ color: '#6F73D2' }}>
            PeiFeira
          </CardTitle>
          <CardDescription style={{ color: '#7681B3' }}>
            Gestão de Projetos Integradores
          </CardDescription>
        </div>
      </CardHeader>
      {/* Mensagem de erro*/}
      <CardContent className="space-y-6!">
        {errorMessage && (
          <div
            className="rounded-lg w-md  flex items-center"
            style={{ backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444' }}
          >
            <AlertCircle className="w-10 h-5! text-red-600 flex-shrink-0 mt-0.5 text-center p-5!" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}
        {/* form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4!">
          <div className="space-y-2!">
            <Label htmlFor="matricula" style={{ color: '#6F73D2' }}>
              Matrícula
            </Label>
            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                style={{ color: '#7681B3 ' }}
              />
              <Input
                id="matricula"
                type="text"
                placeholder="Digite sua matrícula"
                {...register('matricula')}
                disabled={isLoggingIn}
                className={`pl-11! h-12! border-2 ${
                  errors.matricula ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
            </div>
            {errors.matricula && <p className="text-xs text-red-600">{errors.matricula.message}</p>}
          </div>

          <div className="space-y-2!">
            <Label htmlFor="senha" style={{ color: '#6F73D2' }}>
              Senha
            </Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5! h-5! z-10"
                style={{ color: '#7681B3' }}
              />
              <Input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                {...register('senha')}
                disabled={isLoggingIn}
                className={`pl-11! pr-11! h-12! border-2! ${
                  errors.senha ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                style={{ color: '#7681B3' }}
                disabled={isLoggingIn}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.senha && <p className="text-xs text-red-600">{errors.senha.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full h-12! border-0 transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2 mt-6!"
            style={{
              backgroundColor: isValid && !isLoggingIn ? '#6F73D2' : '#7681B3',
              opacity: isValid && !isLoggingIn ? 1 : 0.7,
            }}
            disabled={!isValid || isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <div className="w-5! h-5! border-2! border-white/30! border-t-white! rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-5! h-5!" />
                Entrar
              </>
            )}
          </Button>
        </form>
        <Separator className="my-6!" />
        <div className="p-4! rounded-lg space-y-2!" style={{ backgroundColor: '#D9F0FF' }}>
          <p className="text-sm text-center" style={{ color: '#6F73D2' }}>
            Credenciais de teste:
          </p>
          <div className="space-y-1! text-center">
            <p className="text-xs" style={{ color: '#7681B3' }}>
              <span>Matrícula:</span> <span className="font-mono">admin</span>
            </p>
            <p className="text-xs" style={{ color: '#7681B3' }}>
              <span>Senha:</span> <span className="font-mono">Admin@123</span>
            </p>
          </div>
        </div>
        <div className="text-center space-y-2! pt-2!">
          <p style={{ color: '#7681B3' }} className="text-sm">
            Sistema de Gestão Acadêmica
          </p>
          <p className="text-xs" style={{ color: '#7681B3' }}>
            Para suporte técnico, entre em contato com a TI da instituição
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
