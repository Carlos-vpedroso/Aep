export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "") // remove tudo que não é número
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskRG = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})$/, "$1-$2");
};

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");
};

export const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "") 
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};
