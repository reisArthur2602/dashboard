'use client';

import React, { useEffect } from 'react';
import { BackButton } from '@/app/components/back-button';
import { Input } from '@/app/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { normalizeCNPJ, normalizePhoneNumber } from '@/app/utils/masks';
import { CreateCustomer } from '@/app/actions/customer/create-customer';
import { toast } from 'react-toastify';

const FormCustomerSchema = z.object({
  email: z
    .string()
    .min(1, 'O campo email é obrigatório')
    .email('Insira um email em um formato válido')
    .trim(),
  name: z.string().min(1, 'O campo nome é obrigatório').trim(),
  phone: z
    .string()
    .min(1, 'O campo telefone é obrigatório')
    .refine(
      (value) => /\([1-9]{2}\) 9[1-9]\d{3}-\d{4}/.test(value),
      'O campo telefone deve estar no formato (xx) xxxxx-xxxx.',
    ),
  cnpj: z
    .string()
    .min(1, 'O campo CNPJ é obrigatório')
    .refine(
      (value) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value),
      'O campo CNPJ deve estar no formato xx.xxx.xxx/xxxx-xx',
    ),
});

export const FormCustomer = ({ userId }: { userId: string }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof FormCustomerSchema>>({
    resolver: zodResolver(FormCustomerSchema),
  });

  const phoneValue = watch('phone');
  const cnpjValue = watch('cnpj');

  useEffect(() => {
    setValue('phone', normalizePhoneNumber(phoneValue));
  }, [phoneValue, setValue]);

  useEffect(() => {
    setValue('cnpj', normalizeCNPJ(cnpjValue));
  }, [cnpjValue, setValue]);

  const handleCreateCustomer = async (
    data: z.infer<typeof FormCustomerSchema>,
  ) => {
    try {
      await CreateCustomer({ ...data, userId }).then(() => reset());
      toast.success('Cliente cadastrado com sucesso!');
    } catch (error) {
      toast.error('Falha ao cadastrar cliente');
    }
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(handleCreateCustomer)}
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Input label="Email" helperText={errors.email?.message}>
          <Input.Field placeholder="email@email.com" {...register('email')} />
        </Input>

        <Input label="Nome" helperText={errors.name?.message}>
          <Input.Field placeholder="Ex: Arthur Reis" {...register('name')} />
        </Input>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Input label="Telefone" helperText={errors.phone?.message}>
          <Input.Field placeholder="(xx) xxxxx-xxxx" {...register('phone')} />
        </Input>

        <Input label="CNPJ" helperText={errors.name?.message}>
          <Input.Field placeholder="xx.xxx.xxx/xxxx-xx" {...register('cnpj')} />
        </Input>
      </div>

      <div className="flex items-center justify-between">
        <BackButton href="/dashboard/customer" />
        <button className="bg-cyan-500 text-slate-50">Cadastrar Cliente</button>
      </div>
    </form>
  );
};
