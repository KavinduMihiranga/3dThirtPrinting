import React, {useState} from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Login(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        alert('Login functionality is not implemented in this demo. Check console for input values.');

    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900"
                            placeholder="kavindu@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'} // Toggle type based on state
                                id="password"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 pr-10 text-gray-900" // Added pr-10 for icon
                                placeholder="************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button" // Important: type="button" to prevent form submission
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="text-right mt-2">
                            <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                                Forgot it?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;