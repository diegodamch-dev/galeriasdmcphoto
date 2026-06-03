import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');
  
  // Precios por foto según plan
  const precios = {
    'Cóndor Early Bird': 1200,
    'Cóndor': 1200,
    'Cáraza': 1750,
    'Jilguero': 2250
  };
  
  const precioFoto = precios[plan] || 2250;
  
  // Formato CSV para importar a Arcadina
  const csvContent = `Nombre,Email,Plan,PrecioPorFoto,ListaPrecios\nEjemplo,cliente@email.com,${plan},${precioFoto},${plan}`;
  
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=clientes_${plan.replace(/ /g, '_')}.csv`
    }
  });
}