import { ServerNode, Language, AdReward } from './types';

export const SERVER_LIST: ServerNode[] = [
  { id: 'ao-unitel', country: 'Angola', name: 'AO - Unitel Direct', flag: '🇦🇴', ping: 45, type: 'FREE', network: 'Unitel' },
  { id: 'ao-africell', country: 'Angola', name: 'AO - Africell Gaming', flag: '🇦🇴', ping: 42, type: 'FREE', network: 'Africell' },
  { id: 'ao-movicel', country: 'Angola', name: 'AO - Movicel Stream', flag: '🇦🇴', ping: 50, type: 'FREE', network: 'Movicel' },
  { id: 'br-sp', country: 'Brazil', name: 'BR - São Paulo', flag: '🇧🇷', ping: 120, type: 'FREE' },
  { id: 'us-ny', country: 'USA', name: 'US - New York 1', flag: '🇺🇸', ping: 180, type: 'FREE' },
  { id: 'mz-maputo', country: 'Mozambique', name: 'MZ - Maputo', flag: '🇲🇿', ping: 85, type: 'FREE' },
];

export const AD_REWARDS: AdReward[] = [
  { id: 'ad-1', provider: 'Google AdMob', durationHours: 2, valueUsd: 2.30 },
  { id: 'ad-2', provider: 'Unity Ads', durationHours: 4, valueUsd: 3.00 },
];

export const TRANSLATIONS = {
  [Language.PT]: {
    appName: 'HG Tunnel',
    tapToConnect: 'Toque para Conectar',
    connecting: 'Conectando...',
    connected: 'Conectado',
    disconnecting: 'Desconectando...',
    disconnected: 'Desconectado',
    selectServer: 'Selecionar Servidor',
    addTime: 'Adicionar Tempo',
    home: 'Início',
    earn: 'Ganhar',
    timeLeft: 'Tempo Restante',
    watchAd: 'Assistir Anúncio',
    rewardInfo: 'Assista para ganhar horas e saldo',
    balance: 'Saldo Acumulado',
    hours: 'Horas',
    support: 'Suporte AI',
    supportPlaceholder: 'Pergunte sobre sua conexão...',
    connectionSecure: 'Conexão Segura',
    publicIP: 'IP Público',
    upload: 'Upload',
    download: 'Download',
  },
  [Language.EN]: {
    appName: 'HG Tunnel',
    tapToConnect: 'Tap to Connect',
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnecting: 'Disconnecting...',
    disconnected: 'Disconnected',
    selectServer: 'Select Server',
    addTime: 'Add Time',
    home: 'Home',
    earn: 'Earn',
    timeLeft: 'Time Left',
    watchAd: 'Watch Ad',
    rewardInfo: 'Watch to earn hours and balance',
    balance: 'Accumulated Balance',
    hours: 'Hours',
    support: 'AI Support',
    supportPlaceholder: 'Ask about your connection...',
    connectionSecure: 'Connection Secure',
    publicIP: 'Public IP',
    upload: 'Upload',
    download: 'Download',
  }
};