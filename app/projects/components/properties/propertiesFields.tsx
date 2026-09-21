"use client";

import type { ReactNode } from "react";
import { cn } from "cn";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FieldRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Field className="gap-1.5">
      <FieldLabel className="text-xs font-medium text-muted-foreground">
        {label}
      </FieldLabel>
      {children}
    </Field>
  );
}


export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <FieldRow label={label}>
      <Input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldRow>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value?: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <FieldRow label={label}>
      <Input
        type="number"
        value={value ?? ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "") {
            onChange(min ?? 0);
          } else {
            const num = Number(val);
            if (!Number.isNaN(num)) onChange(num);
          }
        }}
      />
    </FieldRow>
  );
}


export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isValidHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
  return (
    <FieldRow label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-8 w-9 shrink-0 cursor-pointer rounded-sm border border-input bg-background p-0.5 shadow-xs transition-colors"
          value={isValidHex ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </FieldRow>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <FieldRow label={label}>
      <Select
        value={value}
        onValueChange={(val) => {
          if (val != null) onChange(val as T);
        }}
      >
        <SelectTrigger className="h-8 w-full text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FieldRow>
  );
}

export function TextAlignField({
  label = "Alignment",
  value,
  onChange,
}: {
  label?: string;
  value?: string;
  onChange: (val: string) => void;
}) {
  const options = [
    { value: "left", icon: AlignLeft, label: "Align left" },
    { value: "center", icon: AlignCenter, label: "Align center" },
    { value: "right", icon: AlignRight, label: "Align right" },
  ];

  return (
    <FieldRow label={label}>
      <div className="flex h-8 w-full items-center rounded-sm border border-input bg-background p-0.5 shadow-xs">
        {options.map((opt, idx) => {
          const Icon = opt.icon;
          const isSelected = value === opt.value;
          const nextOpt = options[idx + 1];
          const showDivider = !isSelected && nextOpt && value !== nextOpt.value;

          return (
            <div key={opt.value} className="relative flex flex-1 h-full items-center">
              <button
                type="button"
                onClick={() => onChange(opt.value)}
                title={opt.label}
                className={cn(
                  "flex h-full w-full items-center justify-center rounded-xs transition-colors cursor-pointer",
                  isSelected
                    ? "bg-primary/10 text-primary font-medium dark:bg-primary/20"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
              </button>
              {showDivider && (
                <div className="absolute right-0 top-1.5 bottom-1.5 w-px bg-border pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </FieldRow>
  );
}

export function SizeUnitField({
  label,
  value,
  unit = "px",
  onValueChange,
  onUnitChange,
  units = ["px", "%", "auto"],
}: {
  label: string;
  value?: number;
  unit?: string;
  onValueChange: (v: number) => void;
  onUnitChange: (u: string) => void;
  units?: string[];
}) {
  const isAuto = unit === "auto";

  return (
    <FieldRow label={label}>
      <div className="group relative flex h-8 w-full items-center rounded-sm border border-input bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50">
        <input
          type="number"
          disabled={isAuto}
          className="h-full w-full min-w-0 bg-transparent px-2.5 py-1 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-muted-foreground/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          value={isAuto ? "" : (value ?? "")}
          placeholder={isAuto ? "auto" : "0"}
          onChange={(e) => onValueChange(Number(e.target.value))}
        />
        <div className="shrink-0 pr-1.5">
          <Select
            value={unit}
            onValueChange={(u) => {
              if (u != null) onUnitChange(u);
            }}
          >
            <SelectTrigger className="h-6 gap-0 border-0 bg-transparent px-1.5 py-0 text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-0 shadow-none dark:bg-transparent [&_svg]:hidden cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-20">
              <SelectGroup>
                {units.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FieldRow>
  );
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export function PanelSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 last:border-b-0">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

