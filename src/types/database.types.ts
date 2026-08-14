export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      amc_contracts: {
        Row: {
          billing_frequency: string | null
          contract_number: string
          contract_type: string | null
          contract_value: number | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          deleted_by: string | null
          end_date: string | null
          id: string
          notes: string | null
          organization_id: string
          start_date: string | null
          status: string | null
          tax_amount: number | null
          terms: string | null
          total_value: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          billing_frequency?: string | null
          contract_number: string
          contract_type?: string | null
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          deleted_by?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          start_date?: string | null
          status?: string | null
          tax_amount?: number | null
          terms?: string | null
          total_value?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          billing_frequency?: string | null
          contract_number?: string
          contract_type?: string | null
          contract_value?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          deleted_by?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          start_date?: string | null
          status?: string | null
          tax_amount?: number | null
          terms?: string | null
          total_value?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "amc_contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amc_contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amc_contracts_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amc_contracts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amc_contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      amc_equipment: {
        Row: {
          amc_id: string
          equipment_id: string
        }
        Insert: {
          amc_id: string
          equipment_id: string
        }
        Update: {
          amc_id?: string
          equipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "amc_equipment_amc_id_fkey"
            columns: ["amc_id"]
            isOneToOne: false
            referencedRelation: "amc_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amc_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          organization_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          organization_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          organization_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          alternate_phone: string | null
          billing_address: string | null
          city: string | null
          company_name: string
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          customer_code: string
          customer_type: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string | null
          gst_number: string | null
          id: string
          notes: string | null
          organization_id: string
          pan_number: string | null
          phone: string | null
          pincode: string | null
          service_address: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          alternate_phone?: string | null
          billing_address?: string | null
          city?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code: string
          customer_type?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          service_address?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          alternate_phone?: string | null
          billing_address?: string | null
          city?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_code?: string
          customer_type?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          service_address?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          organization_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          organization_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          organization_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          asset_number: string | null
          brand: string | null
          capacity: string | null
          condition: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          deleted_by: string | null
          equipment_code: string
          equipment_type: string | null
          id: string
          installation_date: string | null
          last_service_date: string | null
          location: string | null
          model: string | null
          next_service_date: string | null
          notes: string | null
          organization_id: string
          purchase_date: string | null
          serial_number: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
          warranty_end: string | null
          warranty_start: string | null
        }
        Insert: {
          asset_number?: string | null
          brand?: string | null
          capacity?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          deleted_by?: string | null
          equipment_code: string
          equipment_type?: string | null
          id?: string
          installation_date?: string | null
          last_service_date?: string | null
          location?: string | null
          model?: string | null
          next_service_date?: string | null
          notes?: string | null
          organization_id: string
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Update: {
          asset_number?: string | null
          brand?: string | null
          capacity?: string | null
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          deleted_by?: string | null
          equipment_code?: string
          equipment_type?: string | null
          id?: string
          installation_date?: string | null
          last_service_date?: string | null
          location?: string | null
          model?: string | null
          next_service_date?: string | null
          notes?: string | null
          organization_id?: string
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      installations: {
        Row: {
          assigned_engineer_id: string | null
          checklist: Json | null
          commissioning_report_url: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          customer_signature: string | null
          deleted_at: string | null
          deleted_by: string | null
          equipment_id: string
          gps_check_in: Json | null
          id: string
          installation_number: string
          organization_id: string
          photos: Json | null
          scheduled_date: string | null
          site_address: string | null
          stage: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          assigned_engineer_id?: string | null
          checklist?: Json | null
          commissioning_report_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          customer_signature?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          equipment_id: string
          gps_check_in?: Json | null
          id?: string
          installation_number: string
          organization_id: string
          photos?: Json | null
          scheduled_date?: string | null
          site_address?: string | null
          stage?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assigned_engineer_id?: string | null
          checklist?: Json | null
          commissioning_report_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          customer_signature?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          equipment_id?: string
          gps_check_in?: Json | null
          id?: string
          installation_number?: string
          organization_id?: string
          photos?: Json | null
          scheduled_date?: string | null
          site_address?: string | null
          stage?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installations_assigned_engineer_id_fkey"
            columns: ["assigned_engineer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installations_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installations_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "installations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          organization_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          organization_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          current_stock: number | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          maximum_stock: number | null
          minimum_stock: number | null
          name: string
          organization_id: string
          reserved_stock: number | null
          selling_price: number | null
          sku: string
          status: string | null
          supplier_id: string | null
          unit: string | null
          unit_cost: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stock?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          maximum_stock?: number | null
          minimum_stock?: number | null
          name: string
          organization_id: string
          reserved_stock?: number | null
          selling_price?: number | null
          sku: string
          status?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stock?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          maximum_stock?: number | null
          minimum_stock?: number | null
          name?: string
          organization_id?: string
          reserved_stock?: number | null
          selling_price?: number | null
          sku?: string
          status?: string | null
          supplier_id?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          notes: string | null
          organization_id: string
          performed_by: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          unit_cost: number | null
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          notes?: string | null
          organization_id: string
          performed_by?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          unit_cost?: number | null
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          notes?: string | null
          organization_id?: string
          performed_by?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          unit_cost?: number | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          description: string
          discount: number | null
          id: string
          inventory_item_id: string | null
          invoice_id: string
          quantity: number
          service_ticket_id: string | null
          tax_amount: number | null
          tax_rate: number | null
          total: number
          unit_price: number
        }
        Insert: {
          description: string
          discount?: number | null
          id?: string
          inventory_item_id?: string | null
          invoice_id: string
          quantity?: number
          service_ticket_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          unit_price?: number
        }
        Update: {
          description?: string
          discount?: number | null
          id?: string
          inventory_item_id?: string | null
          invoice_id?: string
          quantity?: number
          service_ticket_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_service_ticket_id_fkey"
            columns: ["service_ticket_id"]
            isOneToOne: false
            referencedRelation: "service_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amc_id: string | null
          amount_paid: number | null
          balance_amount: number | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          deleted_by: string | null
          discount: number | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string
          notes: string | null
          organization_id: string
          service_ticket_id: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          amc_id?: string | null
          amount_paid?: number | null
          balance_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number: string
          notes?: string | null
          organization_id: string
          service_ticket_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          amc_id?: string | null
          amount_paid?: number | null
          balance_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          notes?: string | null
          organization_id?: string
          service_ticket_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_amc_id_fkey"
            columns: ["amc_id"]
            isOneToOne: false
            referencedRelation: "amc_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_service_ticket_id_fkey"
            columns: ["service_ticket_id"]
            isOneToOne: false
            referencedRelation: "service_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_salesperson_id: string | null
          budget: number | null
          city: string | null
          company_name: string
          contact_person: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string | null
          estimated_kva: number | null
          expected_closure_date: string | null
          id: string
          lead_number: string
          organization_id: string
          phone: string | null
          probability: number | null
          requirement: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          assigned_salesperson_id?: string | null
          budget?: number | null
          city?: string | null
          company_name: string
          contact_person: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          estimated_kva?: number | null
          expected_closure_date?: string | null
          id?: string
          lead_number: string
          organization_id: string
          phone?: string | null
          probability?: number | null
          requirement?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assigned_salesperson_id?: string | null
          budget?: number | null
          city?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string | null
          estimated_kva?: number | null
          expected_closure_date?: string | null
          id?: string
          lead_number?: string
          organization_id?: string
          phone?: string | null
          probability?: number | null
          requirement?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_salesperson_id_fkey"
            columns: ["assigned_salesperson_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          organization_id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          organization_id: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          organization_id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          gst_number: string | null
          id: string
          legal_name: string | null
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          legal_name?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          legal_name?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          id: string
          invoice_id: string | null
          notes: string | null
          organization_id: string
          payment_date: string | null
          payment_method: string | null
          payment_number: string
          received_by: string | null
          reference_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          organization_id: string
          payment_date?: string | null
          payment_method?: string | null
          payment_number: string
          received_by?: string | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          organization_id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_number?: string
          received_by?: string | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string | null
          created_at: string | null
          description: string | null
          id: string
          key: string
          module: string | null
          name: string
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          module?: string | null
          name: string
        }
        Update: {
          action?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          module?: string | null
          name?: string
        }
        Relationships: []
      }
      pm_visits: {
        Row: {
          amc_contract_id: string
          assigned_engineer_id: string | null
          battery_voltage_readings: Json | null
          checklist: Json | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          customer_signature: string | null
          deleted_at: string | null
          deleted_by: string | null
          engineer_notes: string | null
          equipment_id: string
          id: string
          organization_id: string
          scheduled_date: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
          visit_number: string
        }
        Insert: {
          amc_contract_id: string
          assigned_engineer_id?: string | null
          battery_voltage_readings?: Json | null
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          customer_signature?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engineer_notes?: string | null
          equipment_id: string
          id?: string
          organization_id: string
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          visit_number: string
        }
        Update: {
          amc_contract_id?: string
          assigned_engineer_id?: string | null
          battery_voltage_readings?: Json | null
          checklist?: Json | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          customer_signature?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          engineer_notes?: string | null
          equipment_id?: string
          id?: string
          organization_id?: string
          scheduled_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
          visit_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "pm_visits_amc_contract_id_fkey"
            columns: ["amc_contract_id"]
            isOneToOne: false
            referencedRelation: "amc_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_visits_assigned_engineer_id_fkey"
            columns: ["assigned_engineer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_visits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_visits_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_visits_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_visits_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_visits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pm_visits_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          designation: string | null
          email: string
          employee_id: string | null
          full_name: string
          id: string
          organization_id: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email: string
          employee_id?: string | null
          full_name: string
          id: string
          organization_id?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          employee_id?: string | null
          full_name?: string
          id?: string
          organization_id?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          cgst_amount: number | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          deleted_by: string | null
          discount_amount: number | null
          discount_percentage: number | null
          grand_total: number | null
          gstin: string | null
          id: string
          igst_amount: number | null
          items: Json | null
          lead_id: string | null
          organization_id: string
          quote_number: string
          sgst_amount: number | null
          status: string | null
          subtotal: number | null
          terms: string | null
          total_tax: number | null
          updated_at: string | null
          updated_by: string | null
          valid_until: string | null
          version: number | null
        }
        Insert: {
          cgst_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          grand_total?: number | null
          gstin?: string | null
          id?: string
          igst_amount?: number | null
          items?: Json | null
          lead_id?: string | null
          organization_id: string
          quote_number: string
          sgst_amount?: number | null
          status?: string | null
          subtotal?: number | null
          terms?: string | null
          total_tax?: number | null
          updated_at?: string | null
          updated_by?: string | null
          valid_until?: string | null
          version?: number | null
        }
        Update: {
          cgst_amount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          grand_total?: number | null
          gstin?: string | null
          id?: string
          igst_amount?: number | null
          items?: Json | null
          lead_id?: string | null
          organization_id?: string
          quote_number?: string
          sgst_amount?: number | null
          status?: string | null
          subtotal?: number | null
          terms?: string | null
          total_tax?: number | null
          updated_at?: string | null
          updated_by?: string | null
          valid_until?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_assignments: {
        Row: {
          accepted_at: string | null
          assigned_at: string | null
          assigned_by: string | null
          completed_at: string | null
          created_at: string | null
          employee_id: string
          id: string
          notes: string | null
          service_ticket_id: string
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          notes?: string | null
          service_ticket_id: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string | null
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          notes?: string | null
          service_ticket_id?: string
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_assignments_service_ticket_id_fkey"
            columns: ["service_ticket_id"]
            isOneToOne: false
            referencedRelation: "service_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      service_ticket_parts: {
        Row: {
          created_at: string | null
          id: string
          inventory_item_id: string
          issued_by: string | null
          quantity: number
          service_ticket_id: string
          total_cost: number | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_item_id: string
          issued_by?: string | null
          quantity: number
          service_ticket_id: string
          total_cost?: number | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_item_id?: string
          issued_by?: string | null
          quantity?: number
          service_ticket_id?: string
          total_cost?: number | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_ticket_parts_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_ticket_parts_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_ticket_parts_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_ticket_parts_service_ticket_id_fkey"
            columns: ["service_ticket_id"]
            isOneToOne: false
            referencedRelation: "service_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tickets: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          equipment_id: string | null
          id: string
          organization_id: string
          priority: string | null
          reported_at: string | null
          scheduled_at: string | null
          source: string | null
          started_at: string | null
          status: string | null
          ticket_number: string
          ticket_type: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          equipment_id?: string | null
          id?: string
          organization_id: string
          priority?: string | null
          reported_at?: string | null
          scheduled_at?: string | null
          source?: string | null
          started_at?: string | null
          status?: string | null
          ticket_number: string
          ticket_type?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          equipment_id?: string | null
          id?: string
          organization_id?: string
          priority?: string | null
          reported_at?: string | null
          scheduled_at?: string | null
          source?: string | null
          started_at?: string | null
          status?: string | null
          ticket_number?: string
          ticket_type?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_visits: {
        Row: {
          arrival_time: string | null
          created_at: string | null
          customer_notes: string | null
          customer_signature_url: string | null
          departure_time: string | null
          id: string
          service_ticket_id: string
          status: string | null
          technician_id: string
          technician_notes: string | null
          updated_at: string | null
          visit_date: string | null
          work_summary: string | null
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string | null
          customer_notes?: string | null
          customer_signature_url?: string | null
          departure_time?: string | null
          id?: string
          service_ticket_id: string
          status?: string | null
          technician_id: string
          technician_notes?: string | null
          updated_at?: string | null
          visit_date?: string | null
          work_summary?: string | null
        }
        Update: {
          arrival_time?: string | null
          created_at?: string | null
          customer_notes?: string | null
          customer_signature_url?: string | null
          departure_time?: string | null
          id?: string
          service_ticket_id?: string
          status?: string | null
          technician_id?: string
          technician_notes?: string | null
          updated_at?: string | null
          visit_date?: string | null
          work_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_visits_service_ticket_id_fkey"
            columns: ["service_ticket_id"]
            isOneToOne: false
            referencedRelation: "service_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_visits_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          gst_number: string | null
          id: string
          name: string
          organization_id: string
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          organization_id: string
          role_id: string
          user_id: string
        }
        Insert: {
          organization_id: string
          role_id: string
          user_id: string
        }
        Update: {
          organization_id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_inventory: {
        Row: {
          id: string
          inventory_item_id: string
          quantity: number | null
          reserved_quantity: number | null
          updated_at: string | null
          warehouse_id: string
        }
        Insert: {
          id?: string
          inventory_item_id: string
          quantity?: number | null
          reserved_quantity?: number | null
          updated_at?: string | null
          warehouse_id: string
        }
        Update: {
          id?: string
          inventory_item_id?: string
          quantity?: number | null
          reserved_quantity?: number | null
          updated_at?: string | null
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_inventory_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_inventory_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouse_inventory_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          location: string | null
          manager_id: string | null
          name: string
          organization_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name: string
          organization_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          manager_id?: string | null
          name?: string
          organization_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warehouses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      inventory_items_view: {
        Row: {
          category: string | null
          id: string | null
          last_restocked_date: string | null
          minimum_threshold: number | null
          name: string | null
          organization_id: string | null
          quantity_in_stock: number | null
          reserved_quantity: number | null
          selling_price: number | null
          sku: string | null
          supplier_id: string | null
          supplier_name: string | null
          unit_cost: number | null
          warehouse_location: string | null
          warehouse_quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      consume_inventory: {
        Args: {
          p_item_id: string
          p_organization_id: string
          p_quantity: number
          p_ticket_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      create_inventory_item_flat: {
        Args: {
          p_category_name: string
          p_minimum_threshold: number
          p_name: string
          p_organization_id: string
          p_quantity_in_stock: number
          p_rack_number: string
          p_selling_price: number
          p_shelf_number: string
          p_sku: string
          p_supplier_name: string
          p_unit_cost: number
          p_user_id: string
          p_warehouse_location: string
        }
        Returns: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          current_stock: number | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          maximum_stock: number | null
          minimum_stock: number | null
          name: string
          organization_id: string
          reserved_stock: number | null
          selling_price: number | null
          sku: string
          status: string | null
          supplier_id: string | null
          unit: string | null
          unit_cost: number | null
          updated_at: string | null
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "inventory_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_user_organization_id: { Args: never; Returns: string }
      record_payment: {
        Args: {
          p_amount: number
          p_invoice_id: string
          p_organization_id: string
          p_payment_method: string
          p_payment_number: string
          p_user_id: string
        }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_inventory_stock: {
        Args: { p_delta: number; p_item_id: string }
        Returns: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          current_stock: number | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          maximum_stock: number | null
          minimum_stock: number | null
          name: string
          organization_id: string
          reserved_stock: number | null
          selling_price: number | null
          sku: string
          status: string | null
          supplier_id: string | null
          unit: string | null
          unit_cost: number | null
          updated_at: string | null
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "inventory_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

