import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUsuarioSchema,
  updateUsuarioSchema,
  CreateUsuarioFormData,
  UpdateUsuarioFormData,
} from '@/lib/schemas/usuario.schema';
import { Usuario } from '@/lib/types/usuario.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Hash, Mail, Lock, GraduationCap, CheckCircle2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface UsuarioFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateUsuarioFormData) => Promise<void>;
  isLoading?: boolean;
}

interface UsuarioFormEditProps {
  mode: 'edit';
  usuario: Usuario;
  onSubmit: (data: UpdateUsuarioFormData) => Promise<void>;
  isLoading?: boolean;
}

type UsuarioFormProps = UsuarioFormCreateProps | UsuarioFormEditProps;

export function UsuarioForm(props: UsuarioFormProps) {
  const { mode, onSubmit, isLoading } = props;
  const isEdit = mode === 'edit';
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<any>({
    resolver: zodResolver(isEdit ? updateUsuarioSchema : createUsuarioSchema),
    defaultValues:
      mode === 'edit'
        ? {
            nome: props.usuario.nome,
            email: props.usuario.email,
            role: props.usuario.role,
          }
        : undefined,
  });

  const role = watch('role');
  const roleItems = [
    { label: 'Selecione a função', value: null },
    { label: 'Aluno', value: 'Aluno' },
    { label: 'Professor', value: 'Professor' },
    { label: 'Admin', value: 'Admin' },
    { label: 'Coordenador', value: 'Coordenador' },
  ];
  const turnoItems = [
    { label: 'Escolha um turno', value: null },
    { label: 'Matutino', value: 'Matutino' },
    { label: 'Vespertino', value: 'Vespertino' },
    { label: 'Noturno', value: 'Noturno' },
    { label: 'Integral', value: 'Integral' },
  ];

  const titulacaoItems = [
    { label: 'Selecione uma titulação', value: null },
    { label: 'Graduação', value: 'Graduacao' },
    { label: 'Especialização', value: 'Especializacao' },
    { label: 'Mestrado', value: 'Mestrado' },
    { label: 'Doutorado', value: 'Doutorado' },
    { label: 'Pós-Doutorado', value: 'Pos-Doutorado' },
  ];

  return (
    <Card className="container mx-auto">
      <CardHeader className="text-center p-5 space-y-4 pb-6">
        <CardTitle className="text-gray-900 dark:text-foreground">
          <div
            className="w-20 h-20 mx-auto! rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#3F5B8B' }}
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <div className="mt-3 space-y-3">
            <CardTitle>{isEdit ? 'Editar Usuario' : 'Registro de Usuário'}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-muted-foreground mt-2">
              {role ? (
                <>Registrando {role.toLowerCase()}</>
              ) : (
                'Selecione a função e preencha os dados!'
              )}
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="matricula"
                  placeholder="Ex: 2024001234"
                  {...register('matricula')}
                  className={`pl-10 ${errors.matricula ? 'border-red-500' : ''}`}
                  disabled={isEdit}
                />
              </div>
              {errors.matricula && (
                <p className="text-sm text-red-600">{errors.matricula?.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Nome completo"
                {...register('nome')}
                className={errors.nome ? 'border-red-500' : ''}
              />
              {errors.nome && (
                <p className="text-sm text-red-600">{errors.nome?.message as string}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Institucional</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@universidade.edu.br"
                  {...register('email')}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email?.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Função</Label>

              <Select
                value={role ?? ''}
                onValueChange={(val) => {
                  setValue('role', val === '' ? undefined : val, { shouldValidate: true });
                }}
              >
                <SelectTrigger size="lg">
                  <SelectValue>{role ? role : 'Selecione a função'}</SelectValue>
                </SelectTrigger>

                <SelectPopup>
                  {roleItems.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
          </div>
          {!isEdit && (
            <div className="">
              <div className="  ">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha do usuário"
                    {...register('senha')}
                    className={`pl-10 pr-10 ${errors.senha ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {role === 'Aluno' && !isEdit && (
            <div className="p-4 rounded-lg bg-[#2E365A] dark:bg-[#2E365A] space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-foreground">
                Informações do Aluno
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="curso">Curso</Label>
                  <Input
                    id="curso"
                    placeholder="Ex: Ciência da Computação"
                    {...register('perfilAluno.curso')}
                    className={`bg-white dark:bg-gray-950 ${(errors as any).perfilAluno?.curso ? 'border-red-500' : ''}`}
                  />
                  {(errors as any).perfilAluno?.curso && (
                    <p className="text-sm text-red-600">
                      {(errors as any).perfilAluno?.curso?.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turno">Turno</Label>
                  <Select
                    value={watch('perfilAluno.turno') || 'Escolha um turno'}
                    onValueChange={(value) =>
                      setValue('perfilAluno.turno', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      size="lg"
                      className={`bg-white dark:bg-gray-950 ${(errors as any).perfilAluno?.turno ? 'border-red-500' : ''}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {turnoItems.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                </div>
              </div>
            </div>
          )}
          {role === 'Professor' && !isEdit && (
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-foreground">
                Informações do Professor
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulacao">Titulação</Label>
                  <Select
                    value={watch('perfilProfessor.titulacao') || 'Selecione a titulação'}
                    onValueChange={(value) =>
                      setValue('perfilProfessor.titulacao', value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className={`bg-white dark:bg-gray-950 ${(errors as any).perfilProfessor?.titulacao ? 'border-red-500' : ''}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectPopup>
                      {titulacaoItems.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectPopup>
                  </Select>
                  {(errors as any).perfilProfessor?.titulacao && (
                    <p className="text-sm text-red-600">
                      {(errors as any).perfilProfessor?.titulacao?.message as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="areaEspecializacao">Área de Especialização</Label>
                    <Input
                      id="areaEspecializacao"
                      placeholder="Ex: Inteligência Artificial"
                      {...register('perfilProfessor.areaEspecializacao')}
                      className={`bg-white dark:bg-gray-950 ${(errors as any).perfilProfessor?.areaEspecializacao ? 'border-red-500' : ''}`}
                    />
                    {(errors as any).perfilProfessor?.areaEspecializacao && (
                      <p className="text-sm text-red-600">
                        {(errors as any).perfilProfessor?.areaEspecializacao?.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input
                      id="departamento"
                      placeholder="Ex: Departamento de Computação"
                      {...register('perfilProfessor.departamento')}
                      className={`bg-white dark:bg-gray-950 ${(errors as any).perfilProfessor?.departamento ? 'border-red-500' : ''}`}
                    />
                    {(errors as any).perfilProfessor?.departamento && (
                      <p className="text-sm text-red-600">
                        {(errors as any).perfilProfessor?.departamento?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : isEdit ? 'Atualizar' : `Registrar ${role || 'Usuário'}`}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
