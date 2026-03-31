export interface Organisation {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  parent: string | null;
  currencies: string[];
  features: string[];
  payment_methods: string[];
  image: string | null;
  legacy_id: string | null;
  deleted_at: string | null;
}
