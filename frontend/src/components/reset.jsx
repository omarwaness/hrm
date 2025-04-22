import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Shadcn/ui-style components for preview
const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className || ''}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-6 pb-2 ${className || ''}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className || ''}`}>{children}</h3>
);

const CardDescription = ({ children, className }) => (
  <p className={`text-sm text-gray-500 ${className || ''}`}>{children}</p>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 ${className || ''}`}>{children}</div>
);

const Button = ({ children, className, disabled, onClick }) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors 
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'} ${className || ''}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

const Input = ({ type, placeholder, className, value, onChange }) => (
  <input
    type={type || 'text'}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${className || ''}`}
  />
);

const Label = ({ children }) => (
  <label className="text-sm font-medium leading-none text-gray-700">{children}</label>
);

const Alert = ({ children, className }) => (
  <div className={`rounded-md p-4 ${className || ''}`}>{children}</div>
);

const Link = ({ children, href }) => (
  <a href={href} className="text-sm text-gray-600 hover:text-gray-900 hover:underline underline-offset-4">{children}</a>
);

export default function PasswordReset() {
  const { token } = useParams();
  const navigate = useNavigate();
  console.log("Token from URL:", token);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirm: confirmPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 500);
      } else {
        setError(data.message || "An error occurred.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-50 border border-green-200 text-green-800">
                Your password has been successfully updated! Redirecting to login page...
              </Alert>
            ) : (
              <div className="grid gap-6">
                {error && (
                  <Alert className="bg-red-50 border border-red-200 text-red-800">
                    {error}
                  </Alert>
                )}
                <div className="grid gap-3">
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter new password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Confirm Password</Label>
                  <Input 
                    type="password" 
                    placeholder="Confirm new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Password
                </Button>
                <div className="text-center">
                  <Link href="/login">Return to login</Link>
                </div>
                <div className="text-gray-500 text-center text-xs">
                  By clicking update, you agree to our <a href="#" className="underline underline-offset-4 hover:text-gray-900">Terms of Service</a>{" "}
                  and <a href="#" className="underline underline-offset-4 hover:text-gray-900">Privacy Policy</a>.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}