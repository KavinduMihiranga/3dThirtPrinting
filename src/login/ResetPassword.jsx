import React from 'react';
import {Eye, EyeOff} from 'lucide-react';
import TextField from "../components/TextField.jsx";
import Button from "../components/Button.jsx";

function ResetPassword(props) {

    const [password, setPassword] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Password reset for ${password}`);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Reset Password?</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    showToggle
                    />

                    <TextField
                        label="Confirm Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
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

export default ResetPassword;