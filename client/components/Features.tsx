import { Card } from "@/components/ui/card";

export default function Features() {
  const features = [
    "Elite Equipment",
    "Certified Trainers",
    "24/7 Access",
  ];

  return (
    <section className="py-20 bg-zinc-100 dark:bg-zinc-950 text-center">
      <h2 className="text-4xl font-bold mb-12">Why Choose Us</h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {features.map((item) => (
          <Card
            key={item}
            className="p-8 bg-white dark:bg-zinc-900 hover:scale-105 transition"
          >
            <p className="font-semibold">{item}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}