import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyPayslipData } from '../assets/assets';
import Loading from '../components/Loading';
import { format } from 'date-fns';

const PrintPayslip = () => {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPayslip(dummyPayslipData.find((slip) => slip._id === id))
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) return <Loading />
  if (!payslip) return <p className='text-center py-12 text-slate-400'>Bulletin introuvable</p>
  return (
    <div className='max-w-2xl mx-auto p-8 bg-white animate-fade-in'>
      <div className='text-center border-b border-slate-200 pb-6 mb-8'>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>FICHE DE PAIE</h1>
        <p className='text-slate-500 text-sm mt-1'>{format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}</p>
      </div>
      <div className='grid grid-cols-2 gap-6 mb-8'>
        <div>
          <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>Nom de l'employée</p>
          <p className='font-semibold text-slate-900'>{payslip.employee?.firstName} {payslip.employee?.lastName}</p>
        </div>
        <div>
          <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>Poste</p>
          <p className='font-semibold text-slate-900'>{payslip.employee?.position} </p>
        </div>
        <div>
          <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>E-mail</p>
          <p className='font-semibold text-slate-900'>{payslip.employee?.email} </p>
        </div>
        <div>
          <p className='text-xs text-slate-400 uppercase tracking-wider mb-1'>Période</p>
          <p className='font-semibold text-slate-900'>{format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy ")} </p>
        </div>
      </div>
      <div className='rounded-xl border border-slate-200 overflow-hidden mb-8'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-slate-50'>
              <th className='text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider'>Description</th>
              <th className='text-right py-3 px-4 text-xs text-slate-500 uppercase tracking-wider'>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-t border-slate-100'>
              <td className='py-3 px-4 text-slate-700'>Salaire de base</td>
              <td className='text-right py-3 px-4 text-slate-900 font-medium'>${payslip.basicSalary?.toLocaleString()}</td>
            </tr>
            <tr className='border-t border-slate-100'>
              <td className='py-3 px-4 text-slate-700'>Indemnités</td>
              <td className='text-right py-3 px-4 text-slate-900 font-medium'>+${payslip.allowances?.toLocaleString()}</td>
            </tr>
            <tr className='border-t border-slate-100'>
              <td className='py-3 px-4 text-slate-700'>Déductions</td>
              <td className='text-right py-3 px-4 text-slate-900 font-medium'>-${payslip.deductions?.toLocaleString()}</td>
            </tr>
            <tr className='border-t-2 border-slate-200 bg-slate-50'>
              <td className='py-3 px-4 text-slate-900 font-bold'>Salaire net</td>
              <td className='text-right py-3 px-4 text-slate-900 font-bold text-lg'>${payslip.netSalary?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='text-center'>
        <button className='btn-primary print:hidden' onClick={() => window.print()}>
          Imprimer la fiche de paie
        </button>
      </div>
    </div>
  )
}

export default PrintPayslip