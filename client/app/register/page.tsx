import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="p-10 space-y-4 w-[350px]">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <Input placeholder="Email" />
        <Input placeholder="Password" type="password" />

        <Button className="w-full bg-red-600 hover:bg-red-700">
          Login
        </Button>
      </Card>
    </div>
  );
}