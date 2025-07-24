# Form Components

Wiederverwendbare Form-Komponenten für konsistentes Styling und einfache Wartung.

## Komponenten

### TextInput

Universelle Text-Input-Komponente für verschiedene Input-Typen.

```tsx
import { TextInput } from "~/components/form";

<TextInput
  control={form.control}
  name="email"
  label="E-Mail"
  placeholder="E-Mail eingeben"
  type="email"
  autoComplete="email"
/>;
```

**Props:**

- `control`: React Hook Form Control
- `name`: Field name
- `label`: Label-Text
- `placeholder?`: Placeholder-Text
- `type?`: Input-Typ (text, email, password, number, tel, url)
- `autoComplete?`: AutoComplete-Attribut
- `className?`: CSS-Klasse
- `id?`: HTML-ID

### NumberInput

Spezialisierte Number-Input-Komponente für numerische Felder.

```tsx
import { NumberInput } from "~/components/form";

<NumberInput
  control={form.control}
  name="amount"
  label="Betrag"
  placeholder="Betrag eingeben"
  step={0.01}
  min={0}
  max={1000}
/>;
```

**Props:**

- `control`: React Hook Form Control
- `name`: Field name
- `label`: Label-Text
- `placeholder?`: Placeholder-Text
- `min?`: Minimaler Wert
- `max?`: Maximaler Wert
- `minLength?`: Minimale Zeichenanzahl
- `maxLength?`: Maximale Zeichenanzahl
- `step?`: Schrittweite
- `className?`: CSS-Klasse
- `id?`: HTML-ID

### DateInput

Datums-Input mit Calendar-Popover.

```tsx
import { DateInput } from "~/components/form";

<DateInput
  control={form.control}
  name="bookedDate"
  label="Buchungsdatum"
  placeholder="Datum auswählen"
/>;
```

**Props:**

- `control`: React Hook Form Control
- `name`: Field name
- `label`: Label-Text
- `placeholder?`: Placeholder-Text
- `className?`: CSS-Klasse

### SelectInput

Select-Input mit Optionen-Liste.

```tsx
import { SelectInput } from "~/components/form";

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
];

<SelectInput
  control={form.control}
  name="category"
  label="Kategorie"
  placeholder="Kategorie auswählen..."
  options={options}
  isLoading={false}
/>;
```

**Props:**

- `control`: React Hook Form Control
- `name`: Field name
- `label`: Label-Text
- `placeholder?`: Placeholder-Text
- `options`: Array von SelectOption-Objekten
- `isLoading?`: Loading-Status
- `className?`: CSS-Klasse
- `disabled?`: Deaktiviert-Status

### FormActions

Wiederverwendbare Submit- und Cancel-Buttons.

```tsx
import { FormActions } from "~/components/form";

<FormActions
  isSubmitting={isSubmitting}
  showCancelButton={true}
  submitText="Speichern"
  cancelText="Abbrechen"
/>;
```

**Props:**

- `isSubmitting`: Submit-Status
- `showCancelButton?`: Cancel-Button anzeigen
- `submitText?`: Submit-Button-Text (Standard: "Speichern")
- `cancelText?`: Cancel-Button-Text (Standard: "Abbrechen")
- `className?`: CSS-Klasse
- `onCancel?`: Custom Cancel-Handler

## Beispiel: Komplettes Formular

```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Form } from "~/components/ui/form";
import {
  TextInput,
  NumberInput,
  SelectInput,
  DateInput,
  FormActions,
} from "~/components/form";
import mySchema from "~/schema/my-schema";

type FormValues = z.infer<typeof mySchema>;

function MyForm({
  isSubmitting,
  handleSubmit,
  defaultValues,
  showCancelButton,
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(mySchema),
    defaultValues,
  });

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <TextInput
          control={form.control}
          name="name"
          label="Name"
          placeholder="Name eingeben"
        />

        <NumberInput
          control={form.control}
          name="amount"
          label="Betrag"
          placeholder="Betrag eingeben"
          step={0.01}
        />

        <SelectInput
          control={form.control}
          name="category"
          label="Kategorie"
          placeholder="Kategorie auswählen..."
          options={options}
        />

        <DateInput control={form.control} name="date" label="Datum" />

        <FormActions
          isSubmitting={isSubmitting}
          showCancelButton={showCancelButton}
        />
      </form>
    </Form>
  );
}
```

## Vorteile

- ✅ **Konsistentes Styling** - Alle Formulare sehen gleich aus
- ✅ **Type Safety** - Vollständige TypeScript-Unterstützung
- ✅ **Wiederverwendbarkeit** - Einmal schreiben, überall verwenden
- ✅ **Wartbarkeit** - Änderungen nur an einer Stelle
- ✅ **Flexibilität** - Anpassbare Props für verschiedene Use Cases
- ✅ **Spezialisiert** - Unterschiedliche Komponenten für unterschiedliche Datentypen
