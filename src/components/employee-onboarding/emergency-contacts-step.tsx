import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmergencyContactsData } from "@/types/employee-onboarding";
import type { EmergencyContact } from "@/types/employee";
import type { ValidationErrors } from "@/lib/validators";

interface Props {
  data: EmergencyContactsData;
  errors: ValidationErrors<EmergencyContactsData>;
  onChange: (updates: EmergencyContactsData) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function createEmptyContact(): EmergencyContact {
  return { id: generateId(), name: "", relationship: "", phone: "", email: "", address: "" };
}

export function EmergencyContactsStep({ data, errors, onChange }: Props) {
  function addContact() {
    onChange({ contacts: [...data.contacts, createEmptyContact()] });
  }

  function removeContact(id: string) {
    onChange({ contacts: data.contacts.filter((c) => c.id !== id) });
  }

  function updateContact(id: string, updates: Partial<EmergencyContact>) {
    onChange({
      contacts: data.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Emergency Contacts</h3>
        <p className="text-sm text-muted-foreground">
          Add at least one emergency contact who can be reached in case of an emergency.
        </p>
      </div>

      {errors.contacts && (
        <div className="px-3 py-2.5 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {errors.contacts}
        </div>
      )}

      <div className="space-y-4">
        {data.contacts.map((contact, index) => (
          <div
            key={contact.id}
            className="border border-border rounded-lg p-4 space-y-4 bg-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Contact {index + 1}</p>
              {data.contacts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeContact(contact.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Full name"
                  value={contact.name}
                  onChange={(e) => updateContact(contact.id, { name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Relationship <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. Spouse, Parent, Sibling"
                  value={contact.relationship}
                  onChange={(e) => updateContact(contact.id, { relationship: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="+2348012345678"
                  value={contact.phone}
                  onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={contact.email}
                  onChange={(e) => updateContact(contact.id, { email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Address</Label>
              <Input
                placeholder="Contact address"
                value={contact.address}
                onChange={(e) => updateContact(contact.id, { address: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addContact} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Emergency Contact
      </Button>
    </div>
  );
}
