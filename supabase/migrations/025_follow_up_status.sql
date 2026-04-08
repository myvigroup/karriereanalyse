-- Add follow_up_status to fair_leads for post-fair advisor tracking
ALTER TABLE fair_leads
ADD COLUMN IF NOT EXISTS follow_up_status text
CHECK (follow_up_status IN ('not_reached', 'appointment_set', 'interested', 'no_interest', 'purchased'))
DEFAULT NULL;

COMMENT ON COLUMN fair_leads.follow_up_status IS 'Post-fair follow-up tracking: not_reached, appointment_set, interested, no_interest, purchased';
