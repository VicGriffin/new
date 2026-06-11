export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      contacts: {
        Row: {
          admin_response: string | null;
          created_at: string;
          email: string;
          id: string;
          is_archived: boolean;
          is_read: boolean;
          message: string;
          name: string;
          organization: string | null;
          subject: string | null;
        };
        Insert: {
          admin_response?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          is_archived?: boolean;
          is_read?: boolean;
          message: string;
          name: string;
          organization?: string | null;
          subject?: string | null;
        };
        Update: {
          admin_response?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          is_archived?: boolean;
          is_read?: boolean;
          message?: string;
          name?: string;
          organization?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      course_enrollments: {
        Row: {
          completed_at: string | null;
          enrolled_at: string;
          id: string;
          program_id: string;
          progress: number;
          status: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          enrolled_at?: string;
          id?: string;
          program_id: string;
          progress?: number;
          status?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          enrolled_at?: string;
          id?: string;
          program_id?: string;
          progress?: number;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_enrollments_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          description: string | null;
          ends_at: string | null;
          id: string;
          is_published: boolean;
          location: string | null;
          starts_at: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          is_published?: boolean;
          location?: string | null;
          starts_at: string;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          is_published?: boolean;
          location?: string | null;
          starts_at?: string;
          title?: string;
        };
        Relationships: [];
      };
      membership_applications: {
        Row: {
          country: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          message: string | null;
          profession: string | null;
          status: string;
          tier: string;
        };
        Insert: {
          country?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          message?: string | null;
          profession?: string | null;
          status?: string;
          tier: string;
        };
        Update: {
          country?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          message?: string | null;
          profession?: string | null;
          status?: string;
          tier?: string;
        };
        Relationships: [];
      };
      news: {
        Row: {
          body: string | null;
          cover_url: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          is_published: boolean;
          published_at: string | null;
          slug: string;
          title: string;
        };
        Insert: {
          body?: string | null;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          slug: string;
          title: string;
        };
        Update: {
          body?: string | null;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          slug?: string;
          title?: string;
        };
        Relationships: [];
      };
      partners: {
        Row: {
          created_at: string;
          id: string;
          is_published: boolean;
          logo_url: string | null;
          name: string;
          sort_order: number;
          website: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          logo_url?: string | null;
          name: string;
          sort_order?: number;
          website?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          logo_url?: string | null;
          name?: string;
          sort_order?: number;
          website?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          is_read: boolean;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
        audit_logs: {
          Row: {
            actor_id: string | null;
            action: string;
            table_name: string;
            row_id: string | null;
            changes: Json | null;
            meta: Json | null;
            created_at: string;
            id: string;
          };
          Insert: {
            actor_id?: string | null;
            action: string;
            table_name: string;
            row_id?: string | null;
            changes?: Json | null;
            meta?: Json | null;
            created_at?: string;
            id?: string;
          };
          Update: {
            actor_id?: string | null;
            action?: string;
            table_name?: string;
            row_id?: string | null;
            changes?: Json | null;
            meta?: Json | null;
            created_at?: string;
            id?: string;
          };
          Relationships: [];
        };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          country: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          profession: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          profession?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          country?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          profession?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      program_categories: {
        Row: {
          description: string | null;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          description?: string | null;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      programs: {
        Row: {
          apply_link: string | null;
          category_id: string | null;
          certification: string | null;
          cover_url: string | null;
          created_at: string;
          curriculum: Json | null;
          description: string | null;
          duration: string | null;
          id: string;
          is_published: boolean;
          learning_outcomes: string[] | null;
          level: string | null;
          mode: string | null;
          price_ksh: number | null;
          requirements: string[] | null;
          slug: string;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          apply_link?: string | null;
          category_id?: string | null;
          certification?: string | null;
          cover_url?: string | null;
          created_at?: string;
          curriculum?: Json | null;
          description?: string | null;
          duration?: string | null;
          id?: string;
          is_published?: boolean;
          learning_outcomes?: string[] | null;
          level?: string | null;
          mode?: string | null;
          price_ksh?: number | null;
          requirements?: string[] | null;
          slug: string;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          apply_link?: string | null;
          category_id?: string | null;
          certification?: string | null;
          cover_url?: string | null;
          created_at?: string;
          curriculum?: Json | null;
          description?: string | null;
          duration?: string | null;
          id?: string;
          is_published?: boolean;
          learning_outcomes?: string[] | null;
          level?: string | null;
          mode?: string | null;
          price_ksh?: number | null;
          requirements?: string[] | null;
          slug?: string;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "programs_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "program_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonials: {
        Row: {
          author_name: string;
          author_role: string | null;
          created_at: string;
          id: string;
          is_published: boolean;
          quote: string;
          sort_order: number;
        };
        Insert: {
          author_name: string;
          author_role?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          quote: string;
          sort_order?: number;
        };
        Update: {
          author_name?: string;
          author_role?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          quote?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      research_articles: {
        Row: {
          abstract: string | null;
          area: string | null;
          authors: string | null;
          created_at: string;
          id: string;
          is_published: boolean;
          published_date: string | null;
          slug: string;
          title: string;
          url: string | null;
        };
        Insert: {
          abstract?: string | null;
          area?: string | null;
          authors?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          published_date?: string | null;
          slug: string;
          title: string;
          url?: string | null;
        };
        Update: {
          abstract?: string | null;
          area?: string | null;
          authors?: string | null;
          created_at?: string;
          id?: string;
          is_published?: boolean;
          published_date?: string | null;
          slug?: string;
          title?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          created_at: string;
          content_type: string | null;
          description: string | null;
          file_data: string | null;
          file_name: string | null;
          id: string;
          is_public: boolean;
          kind: string;
          program_id: string | null;
          storage_path: string | null;
          title: string;
          url: string | null;
        };
        Insert: {
          created_at?: string;
          content_type?: string | null;
          description?: string | null;
          file_data?: string | null;
          file_name?: string | null;
          id?: string;
          is_public?: boolean;
          kind?: string;
          program_id?: string | null;
          storage_path?: string | null;
          title: string;
          url?: string | null;
        };
        Update: {
          created_at?: string;
          content_type?: string | null;
          description?: string | null;
          file_data?: string | null;
          file_name?: string | null;
          id?: string;
          is_public?: boolean;
          kind?: string;
          program_id?: string | null;
          storage_path?: string | null;
          title?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "resources_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      bootstrap_first_admin: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      claim_seed_admin: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      has_any_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      insert_audit_log: {
        Args: {
          _actor_id?: string | null;
          _action: string;
          _table_name: string;
          _row_id?: string | null;
          _changes?: Json | null;
          _meta?: Json | null;
        };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin" | "instructor" | "student" | "member";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "instructor", "student", "member"],
    },
  },
} as const;
