"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          className="w-full p-3 mb-4 bg-zinc-800 rounded"
          placeholder="Email"
        />

        <input
          type="password"
          className="w-full p-3 mb-4 bg-zinc-800 rounded"
          placeholder="Password"
        />

        <button className="w-full bg-red-600 py-3 rounded font-semibold">
          Login
        </button>
      </div>
    </div>
  );
}
