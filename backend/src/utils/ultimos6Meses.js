function getLast6Months() {
  const meses = [];
  const hoje = new Date();

  for (let i = 0; i < 6; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);

    const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
    const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0);

    meses.push({
      label: data.toLocaleString("pt-BR", { month: "short" }).replace(".", ""),
      ano: data.getFullYear(),
      mes: data.getMonth() + 1,
      inicio: primeiroDia,
      fim: ultimoDia,
    });
  }

  return meses.reverse();
}

module.exports = getLast6Months;
