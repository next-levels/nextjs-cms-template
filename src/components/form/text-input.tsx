"use client";

import type { HTMLAttributes } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type TextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  autoComplete?: string;
  className?: string;
  id?: string;
} & HTMLAttributes<HTMLInputElement>;

export default function TextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  className,
  id,
  ...props
}: TextInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel htmlFor={id}>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...props}
              id={id}
              className={cn("", field.value && "border-input")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
