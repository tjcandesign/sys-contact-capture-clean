import { useEffect, useState } from "react";

type Contact = {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  agent?: string;
  timestamp?: string;
};

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contacts")
      .then(res => res.json())
      .then(data => {
        setContacts(Array.isArray(data) ? data.reverse() : []);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Captured Contacts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <p>No contacts found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Notes</th>
              <th className="border px-2 py-1">Agent</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 text-xs">{c.timestamp ? new Date(c.timestamp).toLocaleString() : ""}</td>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.email}</td>
                <td className="border px-2 py-1">{c.phone}</td>
                <td className="border px-2 py-1">{c.notes}</td>
                <td className="border px-2 py-1">{c.agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
