export interface Company {
  name: string;
  sector: string;
  category: string;
  shortlistUrl: string;
  logoUrl?: string | null;
  fundingRound?: string;
  description?: string;
  investors?: string[];
  totalFunding?: number;
  fundingDate?: string;
  founded?: number;
}

export interface SectorConfig {
  name: string;
  color: string;
  gridArea: string;
}
