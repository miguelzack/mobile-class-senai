import { colors } from '../styles/colors';

export function getAreaIcon(area) {
  const icons = {
    'Front-end': 'monitor-dashboard',
    'Back-end': 'server',
    'Banco de dados': 'database',
    'UI/UX': 'palette-outline',
    'Projetos com Scrum': 'clipboard-text-clock-outline',
    'DevOps com nuvem': 'cloud-braces',
  };

  return icons[area] || 'school-outline';
}

export function getAreaColor(area) {
  const areaColors = {
    'Front-end': colors.info,
    'Back-end': colors.primary,
    'Banco de dados': colors.success,
    'UI/UX': colors.purple,
    'Projetos com Scrum': colors.warning,
    'DevOps com nuvem': colors.dark,
  };

  return areaColors[area] || colors.primary;
}

export function getAreaSoftColor(area) {
  const areaColors = {
    'Front-end': colors.infoSoft,
    'Back-end': colors.primarySoft,
    'Banco de dados': colors.successSoft,
    'UI/UX': colors.purpleSoft,
    'Projetos com Scrum': colors.warningSoft,
    'DevOps com nuvem': '#E2E8F0',
  };

  return areaColors[area] || colors.primarySoft;
}
