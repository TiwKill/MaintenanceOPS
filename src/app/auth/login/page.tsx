import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      description="Access your dashboard and manage your operations with precision."
    >
      <LoginForm />
    </AuthLayout>
  );
}
