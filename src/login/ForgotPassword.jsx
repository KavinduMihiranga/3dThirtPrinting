import React from 'react';
import {Eye, EyeOff} from 'lucide-react';
import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";

function ForgotPassword(props) {

    const [email, setEmail] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Password reset email sent to: ${email}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Forgot Password?</h2>
                <form onSubmit={handleSubmit}>

                    <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    showToggle
                    />
                    <Button
                        type="submit"
                        text={"send Email"}
                    />
                </form>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-blue-600 text-sm hover:underline">
                        &lt; Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;