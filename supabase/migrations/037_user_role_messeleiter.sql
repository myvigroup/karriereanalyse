-- Migration 037: 'messeleiter' zum user_role enum hinzufügen
-- Code referenziert die Rolle bereits an mehreren Stellen, aber im Enum fehlte sie.

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'messeleiter';
