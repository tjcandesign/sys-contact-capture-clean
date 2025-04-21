"use client";
import { useState } from "react";

const agents = [
  { id: "agentA", name: "Agent A", photo: "/agentA.jpg" },
  { id: "agentB", name: "Agent B", photo: "/agentB.jpg" },
  // Add more agents as needed
];

export default function ContactForm() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value,
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value,
      notes: (form.elements.namedItem("notes") as HTMLInputElement)?.value,
      agent: selectedAgent ?? ""
    };
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch (err: any) {
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
        <p>We’ve received your info.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Contact Capture</h2>
      <form className="w-full max-w-md bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Name
          <input required name="name" className="w-full border p-2 rounded mt-1" />
        </label>
        <label className="block mb-2 font-semibold">Email
          <input required type="email" name="email" className="w-full border p-2 rounded mt-1" />
        </label>
        <label className="block mb-2 font-semibold">Phone
          <input name="phone" className="w-full border p-2 rounded mt-1" />
        </label>
        <label className="block mb-2 font-semibold">Notes
          <textarea name="notes" className="w-full border p-2 rounded mt-1" />
        </label>
        <div className="my-4">
          <div className="font-semibold mb-1">Who did you talk to? (optional)</div>
          <div className="flex gap-4">
            {agents.map(agent => (
              <button
                type="button"
                key={agent.id}
                className={`flex flex-col items-center border rounded p-2 hover:bg-blue-100 focus:outline-none ${selectedAgent === agent.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedAgent(agent.id)}
                aria-pressed={selectedAgent === agent.id}
              >
                <img src={agent.photo} alt={agent.name} className="w-16 h-16 object-cover rounded-full mb-1" />
                <span>{agent.name}</span>
              </button>
            ))}
          </div>
        </div>
        <input type="hidden" name="agent" value={selectedAgent ?? ""} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold mt-4 hover:bg-blue-700" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </main>
  );
}
