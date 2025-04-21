import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONTACTS_FILE = path.join(process.cwd(), "data", "contacts.json");

async function ensureContactsFile() {
  try {
    await fs.access(CONTACTS_FILE);
  } catch {
    await fs.mkdir(path.dirname(CONTACTS_FILE), { recursive: true });
    await fs.writeFile(CONTACTS_FILE, "[]");
  }
}

export async function POST(req: NextRequest) {
  await ensureContactsFile();
  const data = await req.json();
  const contactsRaw = await fs.readFile(CONTACTS_FILE, "utf-8");
  const contacts = JSON.parse(contactsRaw);
  const newContact = { ...data, timestamp: new Date().toISOString() };
  contacts.push(newContact);
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
  return NextResponse.json({ success: true });
}

export async function GET() {
  await ensureContactsFile();
  const contactsRaw = await fs.readFile(CONTACTS_FILE, "utf-8");
  const contacts = JSON.parse(contactsRaw);
  return NextResponse.json(contacts);
}
