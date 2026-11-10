-- PrivacyGuard: Synthetic Data Generator Supabase Schema
-- Run this in your Supabase SQL Editor if you are using Supabase

-- 1. Table for Dataset Metadata
CREATE TABLE IF NOT EXISTS dataset_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_name TEXT NOT NULL,
    category TEXT NOT NULL,
    record_count INTEGER NOT NULL,
    columns JSONB NOT NULL,
    format TEXT DEFAULT 'json',
    privacy_score NUMERIC(5, 2) DEFAULT 100.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for Export History
CREATE TABLE IF NOT EXISTS export_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES dataset_metadata(id) ON DELETE CASCADE,
    dataset_name TEXT NOT NULL,
    export_format TEXT NOT NULL,
    records_exported INTEGER NOT NULL,
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: In accordance with PrivacyGuard's core privacy policy,
-- NO raw synthetic records or fictional PII are stored in the database.
-- Only statistical and operational metadata is persisted.

