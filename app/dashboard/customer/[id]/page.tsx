import { Container } from '@/app/components/container';
import { NavMenu } from '@/app/components/nav-menu';
import { db } from '@/app/lib/prisma';
import React from 'react';
import { InfoCustomer } from './components/info-customer';

type DetailsCustomerProps = {
  params: { id: string };
};

const DetailsCustomer = async ({ params }: DetailsCustomerProps) => {
  const customer = await db.customer.findUnique({
    where: { id: params.id },
    include: { tickets: { include: { User: true } } },
  });

  const paths = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/customer', label: 'Clientes' },
    { href: '/dashboard/customer/details', label: 'Detalhes do cliente' },
  ];

  return (
    <Container>
      <div className="my-14">
        <NavMenu paths={paths} />
      </div>
      <InfoCustomer customer={customer} />
    </Container>
  );
};

export default DetailsCustomer;
