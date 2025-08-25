export interface AuthContextType {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  Login: (email: string, senha: string, endpoint: string) => Promise<void>;
  Logout: () => void;
  getInformations: (id: string, token: string) => Promise<UserInfo | null>;
}

export interface UserInfo {
  email: string;
  cpf: string | null;
  rg: string | null;
  nome: string;
  foto?: string | null;
  telefone: string | null;
  rua: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  cep: string | null;
  faculdade: string | null;
  curso: string | null;
  turno: string | null;
  cidadeTransporte: string | null;
  modalidadeTransporte: string | null;
  situacao: string;
  firstTime: boolean;
}

export interface QuantidadeAssociadosCidade {
  Franca: number;
  Passos: number;
  Batatais: number;
  Total: number;
}

export interface QuantidadeAssociadosModalidade {
  Mensal: number;
  Diaria: number;
}

export interface QuantidadeAssociadosSituacao {
  Ativo: number;
  Pendente: number;
  Inativo: number;
}
