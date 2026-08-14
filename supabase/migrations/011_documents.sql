-- 011_documents.sql
CREATE TABLE IF NOT EXISTS public.documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_url text NOT NULL,
    mime_type text,
    file_size bigint,
    uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    deleted_at timestamptz
);
