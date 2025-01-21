import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Signin() {
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function signin() {
        try {
            setError("");
            setLoading(true);
            const username = usernameRef.current?.value;
            const password = passwordRef.current?.value;
            
            if (!username || !password) {
                setError("Please enter both username and password");
                return;
            }

            const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
                username,
                password
            });
            
            const jwt = response.data.token;
            login(jwt); // Use the login function from AuthContext
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid username or password");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <div className="mb-4 text-2xl font-bold text-center">Sign In</div>
            {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
            <Input reference={usernameRef} placeholder="Username" />
            <Input reference={passwordRef} placeholder="Password" type="password" />
            <div className="flex justify-center pt-4">
                <Button onClick={signin} loading={loading} variant="primary" text="Sign In" fullWidth={true} />
            </div>
            <div className="mt-4 text-sm text-center">
                Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
            </div>
        </div>
    </div>
}