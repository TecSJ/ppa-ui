const colorsByYear: { [key: string]: string } = {
  2023: '#32169B',
  2024: '#AC0087',
  2025: '#EB2268',
  2026: '#F56B91',
  2027: '#FF88A3',
  2028: '#FF724D',
  2029: '#FFB847',
  2030: '#FFD27A',
};

const getColorByYear = (periodo: string): string => {
  const year = periodo.slice(0, 4); // Extraemos el año del periodo
  return colorsByYear[year] || '#8884d8'; // Color por defecto si no está definido
};

export {
  getColorByYear,
  colorsByYear,
};
