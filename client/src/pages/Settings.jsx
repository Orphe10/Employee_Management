import { useEffect, useState } from "react"
import { Lock } from "lucide-react"
import Loading from "../components/Loading";
import { dummyProfileData } from "../assets/assets";
import ProfileForm from "../components/ProfileForm";
import ChangePasswodModal from "../components/ChangePasswodModal";

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchProfile = async () => {
    setProfile(dummyProfileData)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Paramètres</h1>
        <p className="page-subtitle">Gérer votre compte et vos préférences</p>
      </div>

      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}

      {/* Change Password trigger */}
      <div className="card max-w-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg">
            <Lock className="w-5 h-5 text-slate-600"/>
          </div>
          <div>
            <p className="font-medium text-slate-900">Mot de passe</p>
            <p className="text-sm text-slate-500">Modifier le mot de passe de votre compte</p>
          </div>
        </div>
        <button onClick={() => setShowPasswordModal(true)} className="btn-primary text-sm ">Modifier</button>
      </div>
      <ChangePasswodModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)}/>
    </div>
  )
}

export default Settings