import {
  Home,
  Calendar,
  Users,
  Briefcase,
  FolderKanban,
  GraduationCap,
  UserCircle,
  ClipboardList,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '@/lib/types/usuario.types';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
  badge?: number;
}

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Semestres',
    href: '/dashboard/semestres',
    icon: Calendar,
    roles: [UserRole.Admin, UserRole.Professor],
  },
  {
    title: 'Turmas',
    href: '/dashboard/turmas',
    icon: Users,
    roles: [UserRole.Admin, UserRole.Professor],
  },
  {
    title: 'Disciplinas PI',
    href: '/dashboard/disciplinas-pi',
    icon: GraduationCap,
  },
  {
    title: 'Projetos',
    href: '/dashboard/projetos',
    icon: FolderKanban,
  },
  {
    title: 'Equipes',
    href: '/dashboard/equipes',
    icon: Briefcase,
  },
  {
    title: 'Meus Convites',
    href: '/convites',
    icon: Mail,
    roles: [UserRole.Aluno],
  },
  {
    title: 'Registro',
    href: '/dashboard/registro',
    icon: UserCircle,
    roles: [UserRole.Admin],
  },
];

export function getVisibleNavItems(userRole?: UserRole): NavItem[] {
  if (!userRole) return [];

  return navigationItems.filter((item) => {
    // Se não tem roles definidas, todos podem ver
    if (!item.roles || item.roles.length === 0) return true;
    // Se tem roles, verifica se o usuário está na lista
    return item.roles.includes(userRole);
  });
}
