export type Role = "brand" | "creator";

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  created_at: string;
};

export type Campaign = {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  campaign_type: "clipping" | "ugc";
  budget: number;
  pay_rate_per_100k: number;
  min_views: number;
  requirements: string | null;
  status: "active" | "paused" | "ended";
  created_at: string;
};

export type Submission = {
  id: string;
  campaign_id: string;
  creator_id: string;
  video_url: string;
  platform: "tiktok" | "instagram" | "youtube";
  status: "pending" | "approved" | "rejected";
  views: number;
  earnings: number;
  created_at: string;
};
