'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, User, MapPin, Phone, Mail, Hash } from 'lucide-react';
import { useEquipes } from '@/lib/hooks/useEquipes';
import { useDisciplinasPI } from '@/lib/hooks/useDisciplinasPI';
import {
  createProjetoSchema,
  updateProjetoSchema,
  type CreateProjetoFormData,
  type UpdateProjetoFormData,
} from '@/lib/schemas/projeto.schema';
import { StatusProjetoLabels } from '@/lib/types/projetos.types';
import type { Projeto } from '@/lib/types/projetos.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjetoFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateProjetoFormData) => Promise<void>;
  isLoading?: boolean;
}

interface ProjetoFormEditProps {
  mode: 'edit';
  projeto: Projeto;
  onSubmit: (data: UpdateProjetoFormData) => Promise<void>;
  isLoading?: boolean;
}

type ProjetoFormProps = ProjetoFormCreateProps | ProjetoFormEditProps;

// Tipo unificado para o formulário
type ProjetoFormData = CreateProjetoFormData & UpdateProjetoFormData;

export function ProjetoForm(props: ProjetoFormProps) {
  const { mode, onSubmit, isLoading } = props;
  const isEdit = mode === 'edit';

  const { equipes, isLoading: isLoadingEquipes } = useEquipes();
  const { disciplinasPI, isLoading: isLoadingDisciplinas } = useDisciplinasPI();

  const [showEmpresaFields, setShowEmpresaFields] = useState(
    isEdit && props.mode === 'edit' ? !!props.projeto.nomeEmpresa : false
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProjetoFormData>({
    resolver: zodResolver(isEdit ? updateProjetoSchema : createProjetoSchema) as any,
    defaultValues:
      mode === 'edit'
        ? ({
            titulo: props.projeto.titulo,
            desafioProposto: props.projeto.desafioProposto,
            status: props.projeto.status,
            nomeEmpresa: props.projeto.nomeEmpresa || '',
            enderecoCompleto: props.projeto.enderecoCompleto || '',
            cidade: props.projeto.cidade || '',
            redeSocial: props.projeto.redeSocial || '',
            contato: props.projeto.contato || '',
            nomeResponsavel: props.projeto.nomeResponsavel || '',
            cargoResponsavel: props.projeto.cargoResponsavel || '',
            telefoneResponsavel: props.projeto.telefoneResponsavel || '',
            emailResponsavel: props.projeto.emailResponsavel || '',
            redesSociaisResponsavel: props.projeto.redesSociaisResponsavel || '',
          } as ProjetoFormData)
        : ({
            disciplinaPIId: '',
            equipeId: '',
            titulo: '',
            desafioProposto: '',
            nomeEmpresa: '',
            enderecoCompleto: '',
            cidade: '',
            redeSocial: '',
            contato: '',
            nomeResponsavel: '',
            cargoResponsavel: '',
            telefoneResponsavel: '',
            emailResponsavel: '',
            redesSociaisResponsavel: '',
          } as ProjetoFormData),
  });

  const nomeEmpresa = watch('nomeEmpresa');

  useEffect(() => {
    setShowEmpresaFields(!!nomeEmpresa && nomeEmpresa.length > 0);
  }, [nomeEmpresa]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-foreground">
          {isEdit ? 'Editar Projeto' : 'Novo Projeto'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
              Informações Básicas
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Disciplina PI (apenas criar) */}
              {!isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="disciplinaPIId">
                    Disciplina PI <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={watch('disciplinaPIId') || ''}
                    onValueChange={(value) => setValue('disciplinaPIId', value)}
                    disabled={isLoadingDisciplinas}
                  >
                    <SelectTrigger className={errors.disciplinaPIId ? 'border-red-500' : ''}>
                      <SelectValue>
                        {watch('disciplinaPIId') ?
                          disciplinasPI.find(d => d.id === watch('disciplinaPIId'))?.nome :
                          'Selecione uma disciplina PI'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinasPI.map((disciplina) => (
                        <SelectItem key={disciplina.id} value={disciplina.id}>
                          {disciplina.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.disciplinaPIId && (
                    <p className="text-sm text-red-600">
                      {errors.disciplinaPIId.message as string}
                    </p>
                  )}
                </div>
              )}

              {/* Equipe (apenas criar) */}
              {!isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="equipeId">
                    Equipe <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={watch('equipeId') || ''}
                    onValueChange={(value) => setValue('equipeId', value)}
                    disabled={isLoadingEquipes}
                  >
                    <SelectTrigger className={errors.equipeId ? 'border-red-500' : ''}>
                      <SelectValue>
                        {watch('equipeId') ?
                          equipes.find(e => e.id === watch('equipeId'))?.nome :
                          'Selecione uma equipe'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {equipes.map((equipe) => (
                        <SelectItem key={equipe.id} value={equipe.id}>
                          {equipe.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.equipeId && (
                    <p className="text-sm text-red-600">{errors.equipeId.message as string}</p>
                  )}
                </div>
              )}

              {/* Status (apenas editar) */}
              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={watch('status')?.toString()}
                    onValueChange={(value) => setValue('status', Number(value) as any)}
                  >
                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{StatusProjetoLabels[1]}</SelectItem>
                      <SelectItem value="2">{StatusProjetoLabels[2]}</SelectItem>
                      <SelectItem value="3">{StatusProjetoLabels[3]}</SelectItem>
                      <SelectItem value="4">{StatusProjetoLabels[4]}</SelectItem>
                      <SelectItem value="5">{StatusProjetoLabels[5]}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status.message as string}</p>
                  )}
                </div>
              )}

              {/* Título */}
              <div className={`space-y-2 ${!isEdit ? 'md:col-span-2' : ''}`}>
                <Label htmlFor="titulo">
                  Título <span className="text-red-600">*</span>
                </Label>
                <Input
                  {...register('titulo')}
                  id="titulo"
                  placeholder="Ex: Sistema de Gerenciamento de Estoque"
                  className={errors.titulo ? 'border-red-500' : ''}
                />
                {errors.titulo && (
                  <p className="text-sm text-red-600">{errors.titulo.message as string}</p>
                )}
              </div>

              {/* Desafio Proposto */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="desafioProposto">
                  Desafio Proposto <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  {...register('desafioProposto')}
                  id="desafioProposto"
                  rows={4}
                  placeholder="Descreva o desafio que será abordado pelo projeto..."
                  className={errors.desafioProposto ? 'border-red-500' : ''}
                />
                {errors.desafioProposto && (
                  <p className="text-sm text-red-600">{errors.desafioProposto.message as string}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dados da Empresa (Opcional) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-700 dark:text-foreground" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                Dados da Empresa (Opcional)
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                <Input
                  {...register('nomeEmpresa')}
                  id="nomeEmpresa"
                  placeholder="Ex: Tech Solutions Ltda"
                />
              </div>

              {showEmpresaFields && (
                <>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="enderecoCompleto" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço Completo
                    </Label>
                    <Input
                      {...register('enderecoCompleto')}
                      id="enderecoCompleto"
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input {...register('cidade')} id="cidade" placeholder="Ex: São Paulo" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contato" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contato
                    </Label>
                    <Input {...register('contato')} id="contato" placeholder="(11) 98765-4321" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="redeSocial" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Rede Social
                    </Label>
                    <Input
                      {...register('redeSocial')}
                      id="redeSocial"
                      placeholder="@empresa ou link da rede social"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dados do Responsável (Opcional) */}
          {showEmpresaFields && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-700 dark:text-foreground" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                  Dados do Responsável na Empresa (Opcional)
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nomeResponsavel">Nome do Responsável</Label>
                  <Input
                    {...register('nomeResponsavel')}
                    id="nomeResponsavel"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargoResponsavel">Cargo</Label>
                  <Input
                    {...register('cargoResponsavel')}
                    id="cargoResponsavel"
                    placeholder="Ex: Gerente de TI"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefoneResponsavel" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </Label>
                  <Input
                    {...register('telefoneResponsavel')}
                    id="telefoneResponsavel"
                    placeholder="(11) 98765-4321"
                    className={errors.telefoneResponsavel ? 'border-red-500' : ''}
                  />
                  {errors.telefoneResponsavel && (
                    <p className="text-sm text-red-600">
                      {errors.telefoneResponsavel.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailResponsavel" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-mail
                  </Label>
                  <Input
                    {...register('emailResponsavel')}
                    id="emailResponsavel"
                    type="email"
                    placeholder="joao.silva@empresa.com"
                    className={errors.emailResponsavel ? 'border-red-500' : ''}
                  />
                  {errors.emailResponsavel && (
                    <p className="text-sm text-red-600">
                      {errors.emailResponsavel.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="redesSociaisResponsavel" className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Redes Sociais
                  </Label>
                  <Input
                    {...register('redesSociaisResponsavel')}
                    id="redesSociaisResponsavel"
                    placeholder="LinkedIn, Instagram, etc"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar Projeto'}
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
