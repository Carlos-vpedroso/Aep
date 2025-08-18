export interface AuthContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  Login: (email: string, senha: string, endpoint: string) => Promise<void>;
  Logout: () => void;
  getInformations: (id: string, token: string) => Promise<UserInfo | null>;
}

export interface User {
  id: string;
  email: string;
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
