"use client";

const plans = [
  {
    name: "Monthly",
    price: "₹2,000",
    features: ["Unlimited Access", "Free Trainer Support"]
  },
  {
    name: "Quarterly",
    price: "₹5,500",
    popular: true,
    features: ["Everything in Monthly", "Diet Plan"]
  },
  {
    name: "Yearly",
    price: "₹18,000",
    features: ["All Features", "Personal Trainer"]
  }
];

export default function Plans() {
  return (
    <section id="plans" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">
          Membership <span className="text-red-500">Plans</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-xl p-8 border ${
                plan.popular
                  ? "border-red-500 bg-zinc-900"
                  : "border-zinc-800"
              }`}
            >
              {plan.popular && (
                <span className="text-sm text-red-500">Most Popular</span>
              )}

              <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
              <p className="text-3xl font-extrabold my-4">{plan.price}</p>

              <ul className="text-gray-400 space-y-2">
                {plan.features.map((f, idx) => (
                  <li key={idx}>✔ {f}</li>
                ))}
              </ul>

              <button className="mt-6 w-full bg-red-600 py-3 rounded-lg font-semibold hover:bg-red-700">
                Join Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
