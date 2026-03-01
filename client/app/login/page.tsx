import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">

      {/* Card */}
      <Card className="w-full max-w-md p-10 space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400">
            Login to continue your fitness journey
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <Input
            placeholder="Email"
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:ring-red-500"
          />

          <Input
            placeholder="Password"
            type="password"
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:ring-red-500"
          />
        </div>

        {/* Button */}
        <Button className="w-full py-6 text-lg font-semibold bg-red-600 hover:bg-red-700 rounded-xl shadow-lg">
          Login
        </Button>

        {/* Extra Links */}
        <div className="flex justify-between text-sm text-gray-400">
          <span className="hover:text-white cursor-pointer">
            Forgot password?
          </span>
          <span className="hover:text-white cursor-pointer">
            Sign up
          </span>
        </div>

      </Card>
    </div>
  );
}