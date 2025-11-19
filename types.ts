export enum Language {
  PT = 'PT',
  EN = 'EN'
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING'
}

export enum TabView {
  HOME = 'HOME',
  EARN = 'EARN',
  SETTINGS = 'SETTINGS'
}

export interface ServerNode {
  id: string;
  country: string;
  name: string;
  flag: string;
  ping: number;
  type: 'FREE' | 'PREMIUM';
  network?: string; // For specific networks like Unitel/Africell
}

export interface AdReward {
  id: string;
  provider: string;
  durationHours: number;
  valueUsd: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}