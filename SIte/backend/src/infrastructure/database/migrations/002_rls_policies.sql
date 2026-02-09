-- Migration: Row Level Security Policies
-- Created: 2024-01-01

BEGIN;

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_select_own ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Sessions policies
CREATE POLICY sessions_select_own ON sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY sessions_insert_own ON sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY sessions_delete_own ON sessions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Enrollments policies
CREATE POLICY enrollments_select_own ON enrollments
    FOR SELECT
    USING (auth.uid() = user_id);

-- Progress policies
CREATE POLICY progress_select_own ON progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY progress_insert_own ON progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY progress_update_own ON progress
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY payments_select_own ON payments
    FOR SELECT
    USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY subscriptions_select_own ON subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

COMMIT;