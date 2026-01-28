import AuthLayout from '@/components/auth/auth-layout';
import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Join the Future" 
      description="Experience the next generation of infrastructure maintenance."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
