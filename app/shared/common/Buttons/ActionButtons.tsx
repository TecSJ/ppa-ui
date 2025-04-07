'use client';

import { Box, Button } from '@mui/material';
import {
  Add,
  Search,
  EditOutlined,
  Close,
  PersonOutline,
  GroupsOutlined,
  BookmarkBorder,
  SellOutlined,
} from '@mui/icons-material';
import { madaniArabicRegular } from '@/public/assets/fonts';
import { usePermissions } from '@/app/context/PermissionsContext';
import { usePathname } from 'next/navigation';

interface ActionButtonsProps {
  tableType: 'aplicaciones' | 'credenciales' | 'grupos' | 'modulos' | 'programas';
  selectedRowsCount: number;
  onButtonClick: (actionType: string) => void;
}

type Action = {
  label: string;
  icon: React.ReactNode;
  show: boolean;
  disabled: boolean;
};

export default function ActionButtons({
  tableType,
  selectedRowsCount,
  onButtonClick,
}: ActionButtonsProps) {
  const { permissions } = usePermissions();
  const pathname = usePathname();

  const moduleName = pathname.split('/').filter(Boolean)[1] || '';
  const modulePermissions = permissions
    .flatMap((app) => app.modulos)
    .find((mod) => mod.moduloClave?.toLowerCase() === moduleName?.toLowerCase());

  //const allowedActions: Record<string, number> = modulePermissions?.acciones ?? {};
  const allowedActions: Record<string, number> = {
    agregar: 1,
    consultar: 1,
    editar: 1,
    cancelar: 1,
    perfil: 1,
    grupos: 1,
    etiquetas: 1,
    permisos: 1,
  };

  const customButtonStyles = {
    borderRadius: '20px',
    color: 'rgb(50, 22, 155)',
    textTransform: 'capitalize',
    borderColor: 'rgb(50, 22, 155)',
    '&:hover': {
      backgroundColor: 'rgba(50, 22, 155, 0.08)',
      borderColor: 'rgb(50, 22, 155)',
    },
  };

  const isMultipleSelection = selectedRowsCount > 1;
  const isSingleSelection = selectedRowsCount === 1;
  const notSelection = selectedRowsCount === 0;

  const buttonsConfig: Record<string, Action> = {
    agregar: {
      label: 'Agregar',
      icon: <Add />,
      show: allowedActions.agregar === 1,
      disabled: isMultipleSelection || isSingleSelection,
    },
    consultar: {
      label: 'Consultar',
      icon: <Search />,
      show: allowedActions.consultar === 1 ,
      disabled: isMultipleSelection || notSelection,
    },
    editar: {
      label: 'Actualizar',
      icon: <EditOutlined />,
      show: allowedActions.editar === 1,
      disabled: isMultipleSelection || notSelection,
    },
    perfil: {
      label: 'Validar',
      icon: <PersonOutline />,
      show: allowedActions.editar === 1,
      disabled: notSelection,
    },
    grupos: {
      label: 'Autorizar',
      icon: <GroupsOutlined />,
      show: allowedActions.editar === 1,
      disabled: notSelection,
    },
    etiquetas: {
      label: 'Publicar',
      icon: <SellOutlined />,
      show: allowedActions.editar === 1,
      disabled: notSelection,
    },
    cancelar: {
      label: 'Cancelar',
      icon: <Close />,
      show: allowedActions.cancelar === 1,
      disabled: notSelection,
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        marginBottom: 2,
      }}
    >
      {Object.keys(buttonsConfig).map((key) => {
        const button = buttonsConfig[key];
        return (
          button.show && (
            <Button
              key={key}
              variant='outlined'
              startIcon={button.icon}
              sx={customButtonStyles}
              className={madaniArabicRegular.className}
              onClick={() => onButtonClick(button.label)}
              disabled={button.disabled}
            >
              {button.label}
            </Button>
          )
        );
      })}
    </Box>
  );
}