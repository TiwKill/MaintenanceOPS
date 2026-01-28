import AuthLayout from '@/components/auth/auth-layout';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Secure Recovery" 
      description="Quickly restore access to your account with our secure verification."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
