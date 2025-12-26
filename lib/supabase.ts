import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfomkgtsecfnzjsbpipc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmb21rZ3RzZWNmbnpqc2JwaXBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzQyNDAsImV4cCI6MjA4MjExMDI0MH0.XZSuhhE0ddlvjEl1627zNplmPaz8RR0aFs03Wv0AFP4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storageKey: 'mandalapp-auth',
        storage: window.localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

export type Profile = {
    id: string;
    email: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
};

export type SvgTemplate = {
    id: string;
    title: string;
    description?: string;
    svg_content: string;
    shadow_content?: string;
    thumbnail_url?: string;
    difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
    category: string;
    background_color?: string;
    created_by?: string;
    created_at: string;
    is_active: boolean;
};

export type UserCreation = {
    id: string;
    user_id: string;
    template_id?: string;
    title?: string;
    colored_svg: string;
    created_at: string;
    updated_at: string;
    is_public?: boolean;
    show_author?: boolean;
    svg_templates?: {
        shadow_content?: string;
    };
};
