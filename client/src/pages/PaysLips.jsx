import { useCallback, useEffect, useState } from "react"
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Loading from "../components/Loading";
import PayslipList from "../components/payslip/PayslipList";
import GeneratePayslipFrom from "../components/payslip/GeneratePayslipFrom";

const PaysLips = () => {

  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = true;

  const fetchPayslip = useCallback(async () => {
    setPayslips(dummyPayslipData)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetchPayslip()
  },[fetchPayslip])

  useEffect(() => {
    if(isAdmin) setEmployees(dummyEmployeeData)
  },[isAdmin])

  if(loading) return <Loading/>

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-cebter gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">{isAdmin ? "Générer et gérer les bulletins de paie des salariés" : "L'historique de vos fiches de paie" }</p>
        </div>
        {isAdmin && <GeneratePayslipFrom employees={employees} onSuccess={fetchPayslip} />}
      </div>
      <PayslipList payslips={payslips} isAdmin={isAdmin}/>
    </div>
  )
}

export default PaysLips