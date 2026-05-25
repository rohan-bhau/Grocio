'use client'
import Welcome from '@/components/Welcome'
import RegisterForm from '@/components/Register'

import  { useState } from 'react'

const RegisterPage = () => {
  const [step, setStep] = useState(1)
  return (
    <div>
      {step === 1 ? (
        <Welcome nextStep={setStep} />
      ) : (
        <RegisterForm previousStep={setStep} />
      )}
    </div>
  );
}

export default RegisterPage
